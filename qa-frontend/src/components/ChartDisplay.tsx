import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';

interface ChartDisplayProps {
  chartData: string; // base64 encoded image
  toolType: string;
  statistics?: any;
  chartMetadata?: any;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ 
  chartData, 
  toolType, 
  statistics, 
  chartMetadata 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getToolIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'histogram': '📊',
      'pareto_chart': '📈',
      'control_chart': '⚙️',
      'process_capability': '🎯',
      'fishbone_diagram': '🐟'
    };
    return icons[type] || '📊';
  };

  const getToolTitle = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getToolColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'histogram': 'from-blue-500 to-indigo-600',
      'pareto_chart': 'from-red-500 to-pink-600',
      'control_chart': 'from-green-500 to-emerald-600',
      'process_capability': 'from-purple-500 to-violet-600',
      'fishbone_diagram': 'from-orange-500 to-amber-600'
    };
    return colors[type] || 'from-blue-500 to-indigo-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <motion.div
        className={`bg-gradient-to-r ${getToolColor(toolType)} text-white p-4 cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">{getToolIcon(toolType)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-['Poppins']">
                {getToolTitle(toolType)}
              </h3>
              <p className="text-sm text-white/80">
                Generated chart with analysis
              </p>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Chart Image */}
              <div className="relative">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src={`data:image/png;base64,${chartData}`}
                  alt={getToolTitle(toolType)}
                  className="w-full h-auto rounded-xl shadow-lg border border-gray-200"
                />
                
                {/* Overlay with expand button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="absolute top-4 right-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>

              {/* Statistics */}
              {statistics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200"
                >
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                    <span>📊</span>
                    <span>Key Statistics</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(statistics).slice(0, 6).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex justify-between items-center p-2 bg-white/60 rounded-lg"
                      >
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-semibold text-gray-800">
                          {typeof value === 'number' ? value.toFixed(2) : String(value)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex space-x-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const base64Data = chartData.replace(/^data:image\/\w+;base64,/, "");
                    const blob = new Blob([Buffer.from(base64Data, 'base64')], { type: 'image/png' });
                    saveAs(blob, `${toolType.replace(/_/g, '-')}-chart.png`);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Chart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Share
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};