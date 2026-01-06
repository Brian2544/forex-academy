import { paystack } from '../../config/paystack.js';
import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

export const handleWebhook = asyncHandler(async (req, res) => {
  // Check if Paystack is configured
  const { paystack } = await import('../../config/paystack.js');
  if (!paystack.isConfigured()) {
    logger.warn('Paystack webhook received but Paystack is not configured');
    return res.status(503).json({
      success: false,
      message: 'Payment system is not configured',
    });
  }

  const signature = req.headers['x-paystack-signature'];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing signature',
    });
  }

  // Verify signature - Paystack expects the raw request body buffer
  const crypto = await import('crypto');
  const { config } = await import('../../config/env.js');
  
  // Get raw body - it should be a Buffer from express.raw()
  // Store original buffer before parsing
  const rawBodyBuffer = Buffer.isBuffer(req.body) 
    ? req.body 
    : Buffer.from(JSON.stringify(req.body));
  
  if (!rawBodyBuffer || rawBodyBuffer.length === 0) {
    logger.warn('No raw body available for signature verification');
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
    });
  }

  // Verify signature using raw buffer
  const hash = crypto.default
    .createHmac('sha512', config.paystack.webhookSecret)
    .update(rawBodyBuffer)
    .digest('hex');
  const isValid = hash === signature;

  if (!isValid) {
    logger.warn('Invalid webhook signature');
    return res.status(400).json({
      success: false,
      message: 'Invalid signature',
    });
  }

  // Parse the event from the buffer
  const event = JSON.parse(rawBodyBuffer.toString());

  // Store event for idempotency
  const { data: existingEvent } = await supabaseAdmin
    .from('payment_events')
    .select('id')
    .eq('event_id', event.event || event.data?.reference)
    .maybeSingle();

  if (existingEvent) {
    logger.info('Duplicate webhook event, ignoring');
    return res.json({ success: true, message: 'Event already processed' });
  }

  // Store event
  await supabaseAdmin.from('payment_events').insert({
    provider: 'paystack',
    event_id: event.event || event.data?.reference,
    payload_json: JSON.stringify(event),
  });

  // Handle charge.success event
  if (event.event === 'charge.success' || event.event === 'transaction.charge.success') {
    const reference = event.data?.reference;

    if (!reference) {
      logger.warn('No reference in webhook event');
      return res.json({ success: true });
    }

    // Verify transaction with Paystack
    try {
      const verifyResponse = await paystack.verifyTransaction(reference);

      if (verifyResponse.status && verifyResponse.data.status === 'success') {
        const transaction = verifyResponse.data;
        const metadata = transaction.metadata || {};

        const userId = metadata.userId;
        const planId = metadata.planId;

        if (!userId || !planId) {
          logger.warn('Missing userId or planId in transaction metadata');
          return res.json({ success: true });
        }

        // Get plan to determine period end
        const { data: plan } = await supabaseAdmin
          .from('plans')
          .select('interval')
          .eq('id', planId)
          .single();

        // Calculate period end
        let currentPeriodEnd = new Date();
        if (plan?.interval === 'monthly') {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        } else {
          // one_time - set to far future or null
          currentPeriodEnd = new Date('2099-12-31');
        }

        // Upsert subscription
        const { error: subError } = await supabaseAdmin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              plan_id: planId,
              status: 'active',
              provider: 'paystack',
              provider_ref: reference,
              current_period_end: currentPeriodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id',
            }
          );

        if (subError) {
          logger.error('Subscription upsert error:', subError);
        } else {
          logger.info(`Subscription activated for user ${userId}`);
        }
      }
    } catch (error) {
      logger.error('Transaction verification error:', error);
    }
  }

  // Handle failed/canceled events
  if (event.event === 'charge.failed' || event.event === 'transaction.charge.failed') {
    const reference = event.data?.reference;
    const metadata = event.data?.metadata || {};

    if (reference && metadata.userId) {
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', metadata.userId)
        .eq('provider_ref', reference);
    }
  }

  res.json({ success: true });
});

