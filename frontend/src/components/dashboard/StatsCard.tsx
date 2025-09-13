import React from 'react';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';

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
    <div className="group relative overflow-hidden backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm font-medium mb-2 group-hover:text-white transition-colors duration-300">{title}</p>
          <div className="text-3xl font-bold text-white mb-1 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <AnimatedCounter value={value} />
          </div>
          {change && (
            <p className={`text-sm font-semibold ${changeColor[changeType]} group-hover:scale-105 transition-transform duration-300`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
          <Icon size={28} className="text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -top-2 -left-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
    </div>
  );
};

export default StatsCard;



