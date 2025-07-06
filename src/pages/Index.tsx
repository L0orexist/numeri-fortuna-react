import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Trophy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LotteryGrid } from '@/components/LotteryGrid';
import { NumberBall } from '@/components/NumberBall';
import { ExtractionHistory } from '@/components/ExtractionHistory';
import { useToast } from '@/hooks/use-toast';

interface Extraction {
  id: number;
  numbers: number[];
  timestamp: Date;
}

const STORAGE_KEY = 'lottery-drawn-numbers';
const HISTORY_KEY = 'lottery-history';

const Index = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<Extraction[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedNumbers = localStorage.getItem(STORAGE_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedNumbers) {
      try {
        const numbers = JSON.parse(savedNumbers);
        setDrawnNumbers(numbers);
      } catch (error) {
        console.error('Errore nel caricamento dei numeri salvati:', error);
      }
    }
    if (savedHistory) {
      try {
        const historyData = JSON.parse(savedHistory);
        const parsedHistory = historyData.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Errore nel caricamento della cronologia:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (drawnNumbers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drawnNumbers));
    }
  }, [drawnNumbers]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history]);

  const extractNumber = useCallback(async () => {
    if (drawnNumbers.length >= 90) {
      toast({
        title: "Estrazione completata!",
        description: "Tutti i 90 numeri sono stati estratti.",
        variant: "default"
      });
      return;
    }
    setIsExtracting(true);
    const extractionAnimation = setInterval(() => {
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * 90) + 1;
      } while (drawnNumbers.includes(randomNum));
      setCurrentExtraction(randomNum);
    }, 50);
    setTimeout(() => {
      clearInterval(extractionAnimation);
      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * 90) + 1;
      } while (drawnNumbers.includes(newNumber));
      setCurrentExtraction(newNumber);
      setDrawnNumbers(prev => [...prev, newNumber]);
      toast({
        title: `Numero estratto: ${newNumber}`,
        description: `${90 - drawnNumbers.length - 1} numeri rimanenti`,
        variant: "default"
      });
      setTimeout(() => {
        setCurrentExtraction(null);
        setIsExtracting(false);
      }, 1000);
    }, 2000);
  }, [drawnNumbers, toast]);

  const resetCurrentExtraction = () => {
    if (drawnNumbers.length > 0) {
      const newExtraction: Extraction = {
        id: Date.now(),
        numbers: [...drawnNumbers],
        timestamp: new Date()
      };
      setHistory(prev => [newExtraction, ...prev].slice(0, 10));
      toast({
        title: "Estrazione salvata",
        description: `${drawnNumbers.length} numeri salvati nella cronologia`,
        variant: "default"
      });
    }
    setDrawnNumbers([]);
    setCurrentExtraction(null);
    setIsExtracting(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const clearAllData = () => {
    setDrawnNumbers([]);
    setHistory([]);
    setCurrentExtraction(null);
    setIsExtracting(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    toast({
      title: "Dati cancellati",
      description: "Tutti i dati sono stati rimossi dal dispositivo",
      variant: "default"
    });
  };

  const remainingNumbers = 90 - drawnNumbers.length;
  const isComplete = drawnNumbers.length === 90;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-600">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 mb-6">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-2">
            <Trophy className="w-9 h-9 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              LOTTERIA CLASSICA
            </h1>
            <Trophy className="w-9 h-9 text-yellow-400" />
          </div>
          <p className="text-center text-white/80 text-lg">
            Estrazione dei Numeri Fortunati — <span className="font-bold">{remainingNumbers}</span> numeri rimanenti
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Colonna sinistra: Ultimo Numero */}
          <section className="lg:col-span-3 flex flex-col">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/50 flex-1 flex flex-col">
              <CardHeader className="text-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-t-lg p-5">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Shuffle className="w-6 h-6" />
                  Ultimo Numero
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <div className="flex justify-center items-center mb-6 min-h-[70px]">
                    {currentExtraction && (
                      <NumberBall
                        number={currentExtraction}
                        isNew={true}
                        isExtracting={isExtracting}
                      />
                    )}
                    {!currentExtraction && drawnNumbers.length > 0 && (
                      <NumberBall
                        number={drawnNumbers[drawnNumbers.length - 1]}
                        isNew={false}
                      />
                    )}
                    {!currentExtraction && drawnNumbers.length === 0 && (
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold text-lg">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-6">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base px-6 py-2 font-bold">
                      {drawnNumbers.length}/90
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={extractNumber}
                    disabled={isExtracting || isComplete}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                  >
                    {isExtracting ? 'Estraendo...' : isComplete ? 'Completata' : 'Estrai'}
                  </Button>
                  <Button
                    onClick={resetCurrentExtraction}
                    variant="outline"
                    size="lg"
                    className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Nuova
                  </Button>
                  <Button
                    onClick={clearAllData}
                    variant="destructive"
                    size="lg"
                    className="font-bold"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Reset
                  </Button>
                </div>
                {isComplete && (
                  <div className="text-center mt-6">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-base px-6 py-2 font-bold">
                      🎉 COMPLETATA! 🎉
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Colonna destra: Tabellone numeri */}
          <section className="lg:col-span-9 flex items-center justify-center">
            <div className="w-full">
              <LotteryGrid drawnNumbers={drawnNumbers} />
            </div>
          </section>
        </div>

        {/* Cronologia estrazioni */}
        <div className="mt-10">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-purple-400/50">
            <CardHeader
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg"
              onClick={() => setShowHistory(!showHistory)}
            >
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                Cronologia Estrazioni
                {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
            {showHistory && (
              <CardContent className="p-6">
                <ExtractionHistory history={history} />
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
