import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType = 'neutral',
  loading = false
}) => {
  if (loading) {
    return (
      <div className="card-exp animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const changeColor = {
    positive: 'text-green-500 dark:text-green-400',
    negative: 'text-red-500 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };

  return (
    <div className="card-exp hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 dark:text-indigo-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white dark:text-indigo-800 mt-1">
            {value.toLocaleString()}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${changeColor[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;



