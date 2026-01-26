import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, change, icon, color, subtitle, trend = 'neutral' }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <FiTrendingUp className="text-green-500" />;
    if (trend === 'down') return <FiTrendingDown className="text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden">
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" 
        style={{ backgroundColor: color + '20' }}
      ></div>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
            <div style={{ color }}>{icon}</div>
          </div>
        </div>
        {change !== undefined && (
          <div className="flex items-center">
            {getTrendIcon()}
            <span className={`text-sm font-medium ml-1 ${getTrendColor()}`}>
              {change > 0 ? '+' : ''}{change}% dari bulan lalu
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard