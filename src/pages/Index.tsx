
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Trophy, Trash2, ChevronDown, ChevronUp, Cog } from 'lucide-react';
import { ExtractedNumbersGrid } from '@/components/ExtractedNumbersGrid';
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
  // Stato per la quantità desiderata di numeri da estrarre
  const [desiredExtraction, setDesiredExtraction] = useState<number>(90);
  const [estrazione, setEstrazione] = useState<number>(90);

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<Extraction[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  // Gestione cambio quantità numeri da estrarre
  const handleConfirmExtraction = () => {
    if (desiredExtraction < 1 || desiredExtraction > 5000) {
      toast({
        title: "Numero non valido",
        description: "Inserisci un numero tra 1 e 5000",
        variant: "destructive"
      });
      setDesiredExtraction(90);
      return;
    }
    setEstrazione(desiredExtraction);
    setShowSettings(false);
    toast({
      title: "Impostazione confermata",
      description: `Verranno estratti ${desiredExtraction} numeri.`,
      variant: "default"
    });
  };

  const extractNumber = useCallback(async () => {
    if (drawnNumbers.length >= estrazione) {
      toast({
        title: "Estrazione completata!",
        description: `Tutti i ${estrazione} numeri sono stati estratti.`,
        variant: "default"
      });
      return;
    }
    setIsExtracting(true);
    const extractionAnimation = setInterval(() => {
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * estrazione) + 1;
      } while (drawnNumbers.includes(randomNum));
      setCurrentExtraction(randomNum);
    }, 50);
    setTimeout(() => {
      clearInterval(extractionAnimation);
      let newNumber: number;
      do {
        newNumber = Math.floor(Math.random() * estrazione) + 1;
      } while (drawnNumbers.includes(newNumber));
      setCurrentExtraction(newNumber);
      setDrawnNumbers(prev => [...prev, newNumber]);
      toast({
        title: `Numero estratto: ${newNumber}`,
        description: `${estrazione - drawnNumbers.length - 1} numeri rimanenti`,
        variant: "default"
      });
      setTimeout(() => {
        setCurrentExtraction(null);
        setIsExtracting(false);
      }, 1000);
    }, 2000);
  }, [drawnNumbers, estrazione, toast]);

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
    setEstrazione(90);
    setDesiredExtraction(90);
  };

  const clearAllData = () => {
    setDrawnNumbers([]);
    setHistory([]);
    setCurrentExtraction(null);
    setIsExtracting(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    setEstrazione(90);
    setDesiredExtraction(90);
    setShowSettings(false);
    toast({
      title: "Dati cancellati",
      description: "Tutti i dati sono stati rimossi dal dispositivo",
      variant: "default"
    });
  };

  const remainingNumbers = estrazione - drawnNumbers.length;
  const isComplete = drawnNumbers.length === estrazione;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-600 font-sans">
      <main className="px-4 mx-auto pb-8">
        <div className="flex flex-col gap-8">
          {/* Sezione superiore: Ultimo Numero e Configurazione */}
          <section className="flex flex-col lg:flex-row gap-8 items-start mt-2">
            {/* Ultimo Numero - Più grande */}
            <div className="flex-1">
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/50">
                <CardHeader className="text-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-t-lg p-8">
                  <CardTitle className="text-5xl flex items-center justify-center gap-3">
                    <Shuffle className="w-12 h-12" />
                    Ultimo Numero
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-12">
                  <div className="flex justify-center items-center mb-8 min-h-[150px]">
                    {currentExtraction && (
                      <NumberBall
                        number={currentExtraction}
                        isNew={true}
                        isExtracting={isExtracting}
                        size="huge"
                      />
                    )}
                    {!currentExtraction && drawnNumbers.length > 0 && (
                      <NumberBall
                        number={drawnNumbers[drawnNumbers.length - 1]}
                        isNew={false}
                        size="huge"
                      />
                    )}
                    {!currentExtraction && drawnNumbers.length === 0 && (
                      <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-extrabold text-5xl">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-8">
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-7xl px-12 py-4 font-extrabold">
                      {drawnNumbers.length}/{estrazione}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-6">
                    <Button
                      onClick={extractNumber}
                      disabled={isExtracting || isComplete}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-extrabold text-3xl py-8"
                    >
                      {isExtracting ? 'Estraendo...' : isComplete ? 'Completata' : 'Estrai'}
                    </Button>
                    <Button
                      onClick={clearAllData}
                      variant="destructive"
                      size="lg"
                      className="font-extrabold text-3xl py-8"
                    >
                      <Trash2 className="w-8 h-8 mr-3" />
                      Reset
                    </Button>
                  </div>
                  {isComplete && (
                    <div className="text-center mt-8">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-3xl px-12 py-4 font-extrabold">
                        🎉 COMPLETATA! 🎉
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Configurazione - Solo all'inizio */}
            {(drawnNumbers.length === 0 || showSettings) && (
              <div className="lg:w-96">
                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-gray-400/50">
                  <CardHeader className="text-center bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg p-6">
                    <CardTitle className="text-3xl flex items-center justify-center gap-3">
                      <Cog className="w-8 h-8" />
                      Seleziona numeri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">Range 1 -</span>
                        <input
                          type="number"
                          min={1}
                          max={5000}
                          value={desiredExtraction}
                          onChange={e => setDesiredExtraction(Number(e.target.value))}
                          className="w-32 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <Button
                        onClick={handleConfirmExtraction}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl py-4"
                      >
                        Conferma
                      </Button>
                      {drawnNumbers.length > 0 && (
                        <Button
                          onClick={() => setShowSettings(false)}
                          variant="outline"
                          className="font-bold text-lg py-3"
                        >
                          Chiudi
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Pulsante Impostazioni quando non mostrato */}
            {drawnNumbers.length > 0 && !showSettings && (
              <div className="lg:w-20">
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="lg"
                  className="w-full h-20"
                >
                  <Cog className="w-8 h-8" />
                </Button>
              </div>
            )}
          </section>

          {/* Sezione inferiore: Griglia numeri estratti */}
          {drawnNumbers.length > 0 && (
            <section className="w-full">
              <ExtractedNumbersGrid drawnNumbers={drawnNumbers} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
