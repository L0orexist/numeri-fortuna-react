import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@renderer/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Badge } from '@renderer/components/ui/badge';
import { LotteryGrid } from '@renderer/components/LotteryGrid';
import { NumberBall } from '@renderer/components/NumberBall';
import { useToast } from '@renderer/hooks/use-toast';
import { Shuffle, Trash2, Cog } from 'lucide-react';
import "./App.css"

interface Extraction {
  id: number;
  numbers: number[];
  timestamp: Date;
}

const STORAGE_KEY = 'lottery-drawn-numbers';
const HISTORY_KEY = 'lottery-history';

function App(): React.JSX.Element {
  const [desiredExtraction, setDesiredExtraction] = useState<number>(90);
  const [estrazione, setEstrazione] = useState<number>(90);

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<Extraction[]>([]);
  const [currentExtraction, setCurrentExtraction] = useState<number | null>(null);
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
    if (desiredExtraction < 1 || desiredExtraction > 200) {
      toast({
        title: "Numero non valido",
        description: "Inserisci un numero tra 1 e 200",
        variant: "destructive"
      });
      setDesiredExtraction(90);
      return;
    }
    setEstrazione(desiredExtraction);
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

  const clearAllData = () => {
    setDrawnNumbers([]);
    setHistory([]);
    setCurrentExtraction(null);
    setIsExtracting(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HISTORY_KEY);
    setEstrazione(90);
    setDesiredExtraction(90);
    toast({
      title: "Dati cancellati",
      description: "Tutti i dati sono stati rimossi dal dispositivo",
      variant: "default"
    });
  };

  const isComplete = drawnNumbers.length === estrazione;


  return (
    <div className="w-full">
       <div className="min-h-screen p-8 m-0 w-[100vw] bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-600 font-sans">
            <main className="px-4 mx-auto pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Colonna sinistra: Ultimo Numero */}
                <section className="lg:col-span-3 mt-2">
                  <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-yellow-400/50">
                    <CardHeader className="text-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-t-lg p-8">
                      <CardTitle className="text-4xl flex items-center justify-center gap-3">
                        <Shuffle className="w-10 h-10" />
                        Ultimo Numero
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div>
                        <div className="flex justify-center items-center m-6 min-h-[100px]">
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
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-extrabold text-4xl">
                              ?
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-5xl transition-all xl:text-6xl px-6 xl:px-8 py-3 font-extrabold max-xl:scale-90">
                            {drawnNumbers.length}/{estrazione}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5 mt-8">
                        <Button
                          onClick={extractNumber}
                          disabled={isExtracting || isComplete}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-extrabold text-2xl py-6"
                        >
                          {isExtracting ? 'Estraendo...' : isComplete ? 'Completata' : 'Estrai'}
                        </Button>
                        <Button
                          onClick={clearAllData}
                          className="font-extrabold text-2xl py-6"
                        >
                          <Trash2 className="w-7 h-7 mr-3" />
                          Reset
                        </Button>
                      </div>
                      {isComplete && (
                        <div className="text-center mt-8">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-2xl px-8 py-3 font-extrabold">
                            🎉 COMPLETATA! 🎉
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* quantita' di numeri da giocare */}
                  {drawnNumbers.length === 0 && (
                    <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-gray-400/50 mt-5">
                      <CardHeader className="text-center bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg p-8">
                        <CardTitle className="text-4xl flex items-center justify-center gap-3">
                          <Cog className="w-10 h-10" />
                          Seleziona numeri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">Numeri da estrarre:</span>
                            <input
                              type="number"
                              min={1}
                              max={200}
                              value={desiredExtraction}
                              onChange={e => setDesiredExtraction(Number(e.target.value))}
                              className="w-24 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg p-2"
                            />
                          </div>
                          <Button
                            onClick={handleConfirmExtraction}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl py-4"
                          >
                            Conferma
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </section>
      
                {/* Colonna destra: Tabellone numeri */}
                <section className="lg:col-span-9 flex items-center justify-center mt-2">
                  <div className="w-full text-2xl">
                    <LotteryGrid drawnNumbers={drawnNumbers} maxNumber={estrazione} />
                  </div>
                </section>
              </div>
            </main>
          </div>
    </div>
  )
}

export default App
