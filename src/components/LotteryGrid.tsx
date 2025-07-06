
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from 'lucide-react';

interface LotteryGridProps {
  drawnNumbers: number[];
}

export const LotteryGrid: React.FC<LotteryGridProps> = ({ drawnNumbers }) => {
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-blue-400/50 h-full">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <Grid className="w-5 h-5" />
          Numeri estratti (1-90)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-10 gap-2">
          {numbers.map((number) => {
            const isDrawn = drawnNumbers.includes(number);
            return (
              <div
                key={number}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-500 border-2
                  ${isDrawn 
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-yellow-400 shadow-lg scale-110' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                {number}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
