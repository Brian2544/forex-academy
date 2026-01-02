const ProgressBar = ({ completed, total, label }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">{label}</span>
          <span className="text-primary-500 font-medium">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-dark-800 rounded-full h-3">
        <div
          className="bg-primary-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {label && (
        <p className="text-gray-500 text-xs mt-1">
          {completed} of {total} completed
        </p>
      )}
    </div>
  );
};

export default ProgressBar;

