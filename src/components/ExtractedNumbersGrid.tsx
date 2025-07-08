
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from 'lucide-react';

interface ExtractedNumbersGridProps {
  drawnNumbers: number[];
}

export const ExtractedNumbersGrid: React.FC<ExtractedNumbersGridProps> = ({ drawnNumbers }) => {
  // Ordina i numeri estratti
  const sortedNumbers = [...drawnNumbers].sort((a, b) => a - b);

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-green-400/50">
      <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg p-6">
        <CardTitle className="text-4xl flex items-center justify-center gap-3">
          <Grid className="w-8 h-8" />
          Numeri Estratti ({drawnNumbers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-20 gap-2 sm:gap-3">
          {sortedNumbers.map((number) => (
            <div
              key={number}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-2 border-yellow-400 shadow-lg flex items-center justify-center font-extrabold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105"
            >
              {number}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtractedNumbersGrid;
