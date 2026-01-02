import 'package:flutter/material.dart';
import '../models/signal.dart';

class SignalCard extends StatelessWidget {
  final Signal signal;

  SignalCard({required this.signal});

  @override
  Widget build(BuildContext context) {
    final actionColor = signal.action == 'buy' ? Colors.green : Colors.red;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  signal.currencyPair,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: actionColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    signal.action.toUpperCase(),
                    style: TextStyle(
                      color: actionColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  children: [
                    Text('Entry', style: TextStyle(fontSize: 12)),
                    Text('${signal.entryPrice}', style: TextStyle(fontWeight: FontWeight.bold)),
                  ],
                ),
                Column(
                  children: [
                    Text('SL', style: TextStyle(fontSize: 12, color: Colors.red)),
                    Text('${signal.stopLoss}', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
                  ],
                ),
                Column(
                  children: [
                    Text('TP', style: TextStyle(fontSize: 12, color: Colors.green)),
                    Text('${signal.takeProfit}', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

