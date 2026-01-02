class Signal {
  final String id;
  final String currencyPair;
  final String action;
  final double entryPrice;
  final double stopLoss;
  final double takeProfit;
  final double? riskPercentage;
  final String? explanation;
  final String status;
  final bool isPremium;
  final DateTime createdAt;

  Signal({
    required this.id,
    required this.currencyPair,
    required this.action,
    required this.entryPrice,
    required this.stopLoss,
    required this.takeProfit,
    this.riskPercentage,
    this.explanation,
    required this.status,
    required this.isPremium,
    required this.createdAt,
  });

  factory Signal.fromJson(Map<String, dynamic> json) {
    return Signal(
      id: json['id'],
      currencyPair: json['currencyPair'] ?? json['currency_pair'],
      action: json['action'],
      entryPrice: (json['entryPrice'] ?? json['entry_price']).toDouble(),
      stopLoss: (json['stopLoss'] ?? json['stop_loss']).toDouble(),
      takeProfit: (json['takeProfit'] ?? json['take_profit']).toDouble(),
      riskPercentage: json['riskPercentage'] != null 
          ? (json['riskPercentage'] ?? json['risk_percentage']).toDouble() 
          : null,
      explanation: json['explanation'],
      status: json['status'] ?? 'active',
      isPremium: json['isPremium'] ?? json['is_premium'] ?? false,
      createdAt: DateTime.parse(json['createdAt'] ?? json['created_at']),
    );
  }
}

