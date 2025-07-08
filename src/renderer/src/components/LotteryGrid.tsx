import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Grid } from 'lucide-react';

interface LotteryGridProps {
  drawnNumbers: number[];
  maxNumber: number;
}

export const LotteryGrid: React.FC<LotteryGridProps> = ({ drawnNumbers, maxNumber }) => {
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-blue-400/50 h-full">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg p-4">
        <CardTitle className="text-4xl flex items-center justify-center gap-3">
          <Grid className="w-8 h-8" />
          Numeri estratti (1-{maxNumber})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-10 2xl:grid-cols-12 gap-3 sm:gap-4 md:gap-5 text-3xl">
          {numbers.map((number) => {
            const isDrawn = drawnNumbers.includes(number);
            return (
              <div
                key={number}
                className={`
                  w-14 h-14 md:size-16 md:scale-1.1 xl:p-0 xl:size-20 rounded-xl flex items-center justify-center font-extrabold text-2xl md:text-3xl transition-all duration-300 border-2
                  ${isDrawn 
                    ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-yellow-400 shadow-xl scale-110'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-100'
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
export default LotteryGrid;