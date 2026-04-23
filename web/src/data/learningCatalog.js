export const learningCatalog = {
  beginner: {
    title: 'Beginner Course',
    subtitle: 'Forex Foundations',
    description:
      'Build a disciplined foundation in market structure, platform basics, and responsible risk awareness.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Introduction to Forex Trading',
        lessons: [
          { id: 'm1l1', title: 'How the forex market works', type: 'video' },
          { id: 'm1l2', title: 'Major, minor, and exotic pairs', type: 'article' },
          { id: 'm1l3', title: 'Market participants and sessions', type: 'article' },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Forex Market Basics',
        lessons: [
          { id: 'm2l1', title: 'Pips, lots, spreads, leverage', type: 'video' },
          { id: 'm2l2', title: 'Bid/ask and order types', type: 'article' },
          { id: 'm2l3', title: 'Margin and margin-call safety', type: 'worksheet' },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Trading Platforms & Tools',
        lessons: [
          { id: 'm3l1', title: 'MT4/MT5 orientation', type: 'video' },
          { id: 'm3l2', title: 'Chart reading fundamentals', type: 'video' },
          { id: 'm3l3', title: 'Indicators and drawing tools', type: 'article' },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Risk Awareness & Trading Ethics',
        lessons: [
          { id: 'm4l1', title: 'Why most traders lose money', type: 'article' },
          { id: 'm4l2', title: 'Responsible trading checklist', type: 'worksheet' },
          { id: 'm4l3', title: 'Education vs financial advice', type: 'article' },
        ],
      },
    ],
  },
  intermediate: {
    title: 'Intermediate Course',
    subtitle: 'Technical Analysis',
    description:
      'Develop technical confidence through structure, indicators, entry timing, and trade management.',
    modules: [
      {
        id: 'm5',
        title: 'Module 5: Price Action & Market Structure',
        lessons: [
          { id: 'm5l1', title: 'Candlestick anatomy and patterns', type: 'video' },
          { id: 'm5l2', title: 'Support and resistance mapping', type: 'article' },
          { id: 'm5l3', title: 'Trend identification workshop', type: 'worksheet' },
        ],
      },
      {
        id: 'm6',
        title: 'Module 6: Indicators & Technical Tools',
        lessons: [
          { id: 'm6l1', title: 'Moving averages, RSI, MACD', type: 'video' },
          { id: 'm6l2', title: 'Indicator combination frameworks', type: 'article' },
          { id: 'm6l3', title: 'Avoiding indicator overload', type: 'article' },
        ],
      },
      {
        id: 'm7',
        title: 'Module 7: Sniper Entry Techniques',
        lessons: [
          { id: 'm7l1', title: 'High-probability setup criteria', type: 'video' },
          { id: 'm7l2', title: 'Entry confirmation checklist', type: 'worksheet' },
          { id: 'm7l3', title: 'Session timing and execution', type: 'article' },
        ],
      },
      {
        id: 'm8',
        title: 'Module 8: Trade Management',
        lessons: [
          { id: 'm8l1', title: 'Stop loss and take profit planning', type: 'video' },
          { id: 'm8l2', title: 'Risk-to-reward management', type: 'article' },
          { id: 'm8l3', title: 'Partial exits and trailing stops', type: 'video' },
        ],
      },
    ],
  },
  advanced: {
    title: 'Advanced Course',
    subtitle: 'Professional Trading Practices',
    description:
      'Integrate fundamentals, psychology, strategy building, and professional trading operations.',
    modules: [
      {
        id: 'm9',
        title: 'Module 9: Economic Fundamentals',
        lessons: [
          { id: 'm9l1', title: 'Central banks and interest rates', type: 'video' },
          { id: 'm9l2', title: 'Inflation, employment, and GDP impact', type: 'article' },
        ],
      },
      {
        id: 'm10',
        title: 'Module 10: News Trading & Market Events',
        lessons: [
          { id: 'm10l1', title: 'Economic calendar planning', type: 'worksheet' },
          { id: 'm10l2', title: 'Volatility and event risk management', type: 'video' },
        ],
      },
      {
        id: 'm11',
        title: 'Module 11: Risk Management Mastery',
        lessons: [
          { id: 'm11l1', title: 'Position sizing frameworks', type: 'video' },
          { id: 'm11l2', title: 'Drawdown controls and capital defense', type: 'article' },
        ],
      },
      {
        id: 'm12',
        title: 'Module 12: Trading Psychology',
        lessons: [
          { id: 'm12l1', title: 'Discipline, patience, and mindset', type: 'video' },
          { id: 'm12l2', title: 'Emotional control playbook', type: 'worksheet' },
        ],
      },
      {
        id: 'm13',
        title: 'Module 13: Strategy Building & Backtesting',
        lessons: [
          { id: 'm13l1', title: 'Build a complete trading plan', type: 'article' },
          { id: 'm13l2', title: 'Backtesting workflow', type: 'video' },
        ],
      },
      {
        id: 'm14',
        title: 'Module 14: Sniper FX Trading Strategies',
        lessons: [
          { id: 'm14l1', title: 'Trend, range, and breakout models', type: 'video' },
          { id: 'm14l2', title: 'Session-based strategy map', type: 'article' },
        ],
      },
      {
        id: 'm15',
        title: 'Module 15: Trading Plans & Journaling',
        lessons: [
          { id: 'm15l1', title: 'Journaling methods and review cadence', type: 'worksheet' },
          { id: 'm15l2', title: 'Performance analysis routines', type: 'article' },
        ],
      },
      {
        id: 'm16',
        title: 'Module 16: From Learning to Live Trading',
        lessons: [
          { id: 'm16l1', title: 'Demo-to-live transition framework', type: 'video' },
          { id: 'm16l2', title: 'Responsible scaling and consistency', type: 'article' },
        ],
      },
    ],
  },
};

export const certificatePlaceholder = {
  status: 'placeholder',
  title: 'Certificate automation is being prepared',
  note: 'Learners can complete modules now; issuance workflow will plug into verified completion records.',
};
