import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, isPositive }) => {
  const chartData = data.map((val, i) => ({ i, val }));
  const color = isPositive ? '#22c55e' : '#ef4444'; // Green-500 or Red-500

  return (
    <div className="h-16 w-32 opacity-80 hover:opacity-100 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Performance optimization for lists
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};