import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PachinkoSlot = () => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [coins, setCoins] = useState(1000);
  const [win, setWin] = useState(0);

  const symbols = ['🍒', '🎰', '💎', '７', '🔔', '⭐'];

  const spinReel = () => {
    if (coins < 100) return;

    setCoins(prev => prev - 100);
    setSpinning(true);
    setWin(0);

    // 各リールの停止タイミングをずらす
    const stopTimes = [1000, 1500, 2000];
    const newReels = [...reels];

    stopTimes.forEach((time, index) => {
      const spinInterval = setInterval(() => {
        newReels[index] = Math.floor(Math.random() * symbols.length);
        setReels([...newReels]);
      }, 50);

      setTimeout(() => {
        clearInterval(spinInterval);
        if (index === 2) {
          setSpinning(false);
          checkWin(newReels);
        }
      }, time);
    });
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
              <div
                key={index}
                className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-4xl"
                style={{
                  transition: 'transform 0.05s',
                  transform: spinning ? 'translateY(-2px)' : 'none'
                }}
              >
                {symbols[reelPos]}
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
            disabled={spinning || coins < 100}
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