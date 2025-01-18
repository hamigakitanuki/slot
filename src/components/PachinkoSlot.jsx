import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PachinkoSlot = () => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [coins, setCoins] = useState(1000);
  const [win, setWin] = useState(0);
  const [spinIntervals, setSpinIntervals] = useState([null, null, null]);

  const symbols = ['🍒', '🎰', '💎', '７', '🔔', '⭐'];

  const spinReel = () => {
    if (coins < 100) return;

    setCoins(prev => prev - 100);
    setSpinning([true, true, true]);
    setWin(0);

    const newIntervals = reels.map((_, index) => {
      return setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = Math.floor(Math.random() * symbols.length);
          return newReels;
        });
      }, 50);
    });

    setSpinIntervals(newIntervals);
  };

  const stopReel = (index) => {
    if (!spinning[index]) return;

    clearInterval(spinIntervals[index]);
    const newSpinning = [...spinning];
    newSpinning[index] = false;
    setSpinning(newSpinning);

    if (!newSpinning.some(s => s)) {
      checkWin(reels);
    }
  };

  const checkWin = (finalReels) => {
    const values = finalReels.map(index => symbols[index]);
    let prize = 0;

    if (values.every(val => val === '７')) {
      prize = 5000;
    } else if (values.every(val => val === '💎')) {
      prize = 2000;
    } else if (values.every(val => val === '🔔')) {
      prize = 1000;
    } else if (values.every(val => val === '⭐')) {
      prize = 500;
    } else if (values.every(val => val === '🍒')) {
      prize = 200;
    }

    if (prize > 0) {
      setCoins(prev => prev + prize);
      setWin(prize);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">パチスロゲーム</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl">コイン: {coins}</div>

          <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
            {reels.map((reelPos, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div
                  className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-4xl"
                  style={{
                    transition: 'transform 0.05s',
                    transform: spinning[index] ? 'translateY(-2px)' : 'none'
                  }}
                >
                  {symbols[reelPos]}
                </div>
                <Button
                  onClick={() => stopReel(index)}
                  disabled={!spinning[index]}
                  className="w-full"
                  size="sm"
                >
                  停止 {index + 1}
                </Button>
              </div>
            ))}
          </div>

          {win > 0 && (
            <div className="text-xl text-green-500">
              WIN! +{win}コイン
            </div>
          )}

          <Button
            onClick={spinReel}
            disabled={spinning.some(s => s) || coins < 100}
            className="w-full"
          >
            スピン (100コイン)
          </Button>

          <div className="text-sm text-gray-500">
            配当表:
            <br />
            777: 5000コイン
            <br />
            💎💎💎: 2000コイン
            <br />
            🔔🔔🔔: 1000コイン
            <br />
            ⭐⭐⭐: 500コイン
            <br />
            🍒🍒🍒: 200コイン
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PachinkoSlot;