
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Calendar } from 'lucide-react';

interface Extraction {
  id: number;
  numbers: number[];
  timestamp: Date;
}

interface ExtractionHistoryProps {
  history: Extraction[];
}

export const ExtractionHistory: React.FC<ExtractionHistoryProps> = ({ history }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-purple-400/50 h-fit">
      <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          <History className="w-5 h-5" />
          Cronologia Estrazioni
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nessuna estrazione completata</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((extraction, index) => (
              <div
                key={extraction.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-purple-500"
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="text-xs">
                    #{history.length - index}
                  </Badge>
                  <div className="text-xs text-gray-600">
                    {formatDate(extraction.timestamp)} - {formatTime(extraction.timestamp)}
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  {extraction.numbers.map((number, numIndex) => (
                    <div
                      key={`${extraction.id}-${number}-${numIndex}`}
                      className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
