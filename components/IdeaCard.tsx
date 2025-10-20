import React from 'react';
import { Idea } from '../types';
import { TargetIcon } from './icons/TargetIcon';
import { MoneyIcon } from './icons/MoneyIcon';
import { ChartIcon } from './icons/ChartIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { WandIcon } from './icons/WandIcon';

const IdeaCard: React.FC<{ idea: Idea; onRefine: (idea: Idea) => void; }> = ({ idea, onRefine }) => {
  const getProfitabilityClass = (profitability: string) => {
    if (profitability.includes('عالية')) return 'text-green-400 bg-green-900/50 border-green-500/50';
    if (profitability.includes('متوسطة')) return 'text-yellow-400 bg-yellow-900/50 border-yellow-500/50';
    if (profitability.includes('منخفضة')) return 'text-red-400 bg-red-900/50 border-red-500/50';
    return 'text-gray-400 bg-gray-700/50 border-gray-600/50';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/50 transform hover:-translate-y-1 h-full">
      <div className="space-y-5">
        <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg">
            <LightbulbIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">المفهوم</h3>
            <p className="text-gray-300 mt-1">{idea.concept}</p>
            </div>
        </div>

        <div className="border-t border-gray-700/50"></div>

        <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg">
            <TargetIcon className="w-6 h-6 text-teal-400" />
            </div>
            <div>
            <h4 className="text-md font-semibold text-gray-200">الجمهور المستهدف</h4>
            <p className="text-gray-400 mt-1">{idea.targetAudience}</p>
            </div>
        </div>

        <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg">
            <MoneyIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
            <h4 className="text-md font-semibold text-gray-200">طريقة الربح</h4>
            <p className="text-gray-400 mt-1">{idea.monetization}</p>
            </div>
        </div>

        <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg">
            <ChartIcon className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
            <h4 className="text-md font-semibold text-gray-200">الربحية المحتملة</h4>
            <p className={`text-sm mt-1 p-2 rounded-md border ${getProfitabilityClass(idea.profitability)}`}>
                {idea.profitability}
            </p>
            </div>
        </div>
      </div>
      
      <div className="mt-6 pt-5 border-t border-gray-700/50">
        <button
          onClick={() => onRefine(idea)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-500/50 text-sm font-medium rounded-md text-blue-300 bg-blue-900/30 hover:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-200"
        >
          <WandIcon className="w-4 h-4" />
          <span>تحسين الفكرة</span>
        </button>
      </div>
    </div>
  );
};

export default IdeaCard;
