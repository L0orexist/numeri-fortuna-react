
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Trophy } from 'lucide-react';
import { LotteryGrid } from '@/components/LotteryGrid';
import { NumberBall } from '@/components/NumberBall';
import { ExtractionHistory } from '@/components/ExtractionHistory';

interface Extraction {
  id: number;
  numbers: number[];
  timestamp: Date;
}

const Index = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<Extraction[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);

  const extractNumber = useCallback(async () => {
    if (drawnNumbers.length >= 5) return;
    
    setIsExtracting(true);
    
    // Simula l'animazione dell'estrazione
    const extractionAnimation = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 90) + 1;
      setCurrentExtraction(randomNum);
    }, 50);

    // Dopo 2 secondi, estrae il numero finale
    setTimeout(() => {
      clearInterval(extractionAnimation);
      
      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * 90) + 1;
      } while (drawnNumbers.includes(newNumber));
      
      setCurrentExtraction(newNumber);
      setDrawnNumbers(prev => [...prev, newNumber]);
      
      setTimeout(() => {
        setCurrentExtraction(null);
        setIsExtracting(false);
      }, 1000);
    }, 2000);
  }, [drawnNumbers]);

  const resetLottery = () => {
    if (drawnNumbers.length > 0) {
      const newExtraction: Extraction = {
        id: Date.now(),
        numbers: [...drawnNumbers],
        timestamp: new Date()
      };
      setHistory(prev => [newExtraction, ...prev].slice(0, 10));
    }
    
    setDrawnNumbers([]);
    setCurrentExtraction(null);
    setIsExtracting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-yellow-600">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              LOTTERIA CLASSICA
            </h1>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-center text-white/80 mt-2">
            Estrazione dei Numeri Fortunati
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pannello principale di estrazione */}
          <div className="lg:col-span-2 space-y-6">
            {/* Numeri estratti */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/50">
              <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Shuffle className="w-6 h-6" />
                  Numeri Estratti
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex justify-center items-center gap-4 min-h-[120px]">
                  {drawnNumbers.map((number, index) => (
                    <NumberBall
                      key={`${number}-${index}`}
                      number={number}
                      isNew={false}
                      delay={index * 200}
                    />
                  ))}
                  
                  {currentExtraction && (
                    <NumberBall
                      number={currentExtraction}
                      isNew={true}
                      isExtracting={true}
                    />
                  )}
                  
                  {/* Placeholders per numeri non ancora estratti */}
                  {Array.from({ length: 5 - drawnNumbers.length - (currentExtraction ? 1 : 0) }).map((_, index) => (
                    <div
                      key={`placeholder-${index}`}
                      className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold text-lg"
                    >
                      ?
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4 mt-8">
                  <Button
                    onClick={extractNumber}
                    disabled={isExtracting || drawnNumbers.length >= 5}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-3 text-lg shadow-lg"
                  >
                    {isExtracting ? 'Estraendo...' : 'Estrai Numero'}
                  </Button>
                  
                  <Button
                    onClick={resetLottery}
                    variant="outline"
                    size="lg"
                    className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-bold px-8 py-3 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Nuova Estrazione
                  </Button>
                </div>
                
                {drawnNumbers.length === 5 && (
                  <div className="text-center mt-6">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-lg px-6 py-2 font-bold">
                      🎉 ESTRAZIONE COMPLETATA! 🎉
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Griglia dei numeri */}
            <LotteryGrid drawnNumbers={drawnNumbers} />
          </div>

          {/* Cronologia estrazioni */}
          <div className="lg:col-span-1">
            <ExtractionHistory history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
