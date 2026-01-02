import { formatDistanceToNow } from 'date-fns';

const SignalCard = ({ signal }) => {
  const actionColors = {
    buy: 'bg-green-500/20 text-green-400 border-green-500/50',
    sell: 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  return (
    <div className={`card border-2 ${actionColors[signal.action]}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{signal.currencyPair}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${actionColors[signal.action]}`}>
            {signal.action.toUpperCase()}
          </span>
        </div>
        {signal.isPremium && (
          <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
            Premium
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Entry</p>
          <p className="text-white font-semibold">{signal.entryPrice}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Stop Loss</p>
          <p className="text-red-400 font-semibold">{signal.stopLoss}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Take Profit</p>
          <p className="text-green-400 font-semibold">{signal.takeProfit}</p>
        </div>
      </div>

      {signal.riskPercentage && (
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-1">Risk</p>
          <p className="text-white font-semibold">{signal.riskPercentage}%</p>
        </div>
      )}

      {signal.explanation && (
        <p className="text-gray-400 text-sm mb-4">{signal.explanation}</p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDistanceToNow(new Date(signal.createdAt), { addSuffix: true })}</span>
        <span className={`px-2 py-1 rounded ${
          signal.status === 'active' ? 'bg-green-500/20 text-green-400' :
          signal.status === 'hit_tp' ? 'bg-green-500/20 text-green-400' :
          signal.status === 'hit_sl' ? 'bg-red-500/20 text-red-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {signal.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default SignalCard;

