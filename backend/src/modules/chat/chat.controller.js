import { supabaseAdmin } from '../../config/supabaseAdmin.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { logger } from '../../utils/logger.js';

// Admin: Create chat group
export const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const { data: group, error } = await supabaseAdmin
    .from('chat_groups')
    .insert({
      name,
      description,
      created_by: req.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating chat group:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create chat group',
    });
  }

  res.status(201).json({
    success: true,
    data: group,
  });
});

// Admin: Update chat group
export const updateGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const { data: group, error } = await supabaseAdmin
    .from('chat_groups')
    .update({
      name,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !group) {
    return res.status(404).json({
      success: false,
      message: 'Chat group not found',
    });
  }

  res.json({
    success: true,
    data: group,
  });
});

// Admin: Delete chat group
export const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('chat_groups')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Error deleting chat group:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete chat group',
    });
  }

  res.json({
    success: true,
    message: 'Chat group deleted successfully',
  });
});

// Admin: Add member to group
export const addMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  // Check if already a member
  const { data: existing } = await supabaseAdmin
    .from('chat_group_members')
    .select('id')
    .eq('group_id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    return res.json({
      success: true,
      message: 'User is already a member',
    });
  }

  const { data: member, error } = await supabaseAdmin
    .from('chat_group_members')
    .insert({
      group_id: id,
      user_id: userId,
      joined_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    logger.error('Error adding member:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add member',
    });
  }

  res.json({
    success: true,
    data: member,
  });
});

// Admin: Remove member from group
export const removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  const { error } = await supabaseAdmin
    .from('chat_group_members')
    .delete()
    .eq('group_id', id)
    .eq('user_id', userId);

  if (error) {
    logger.error('Error removing member:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove member',
    });
  }

  res.json({
    success: true,
    message: 'Member removed successfully',
  });
});

// Student: Get groups they belong to
export const getMyGroups = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const { data: groups, error } = await supabaseAdmin
    .from('chat_group_members')
    .select(`
      group_id,
      joined_at,
      chat_groups (
        id,
        name,
        description,
        created_at
      )
    `)
    .eq('user_id', userId);

  if (error) {
    logger.error('Error fetching groups:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch groups',
    });
  }

  res.json({
    success: true,
    data: groups?.map((g) => ({
      ...g.chat_groups,
      joined_at: g.joined_at,
    })) || [],
  });
});

// Student: Get messages for a group
export const getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Verify user is a member
  const { data: member } = await supabaseAdmin
    .from('chat_group_members')
    .select('id')
    .eq('group_id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!member) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group',
    });
  }

  const { data: messages, error } = await supabaseAdmin
    .from('chat_messages')
    .select(`
      *,
      profiles (
        id,
        first_name,
        last_name
      )
    `)
    .eq('group_id', id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    logger.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }

  res.json({
    success: true,
    data: messages || [],
  });
});

// Student: Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  // Verify user is a member
  const { data: member } = await supabaseAdmin
    .from('chat_group_members')
    .select('id')
    .eq('group_id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (!member) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group',
    });
  }

  const { data: message, error } = await supabaseAdmin
    .from('chat_messages')
    .insert({
      group_id: id,
      user_id: userId,
      content,
      created_at: new Date().toISOString(),
    })
    .select(`
      *,
      profiles (
        id,
        first_name,
        last_name
      )
    `)
    .single();

  if (error) {
    logger.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }

  res.status(201).json({
    success: true,
    data: message,
  });
});

