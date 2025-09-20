// Create src/components/admin/StatCard.js
const StatCard = ({ title, value, icon: Icon, change, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">
                {value.toLocaleString()}
              </div>
            </dd>
            {change && (
              <div className={`text-sm font-medium ${getTrendColor()}`}>
                {change}
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatCard;