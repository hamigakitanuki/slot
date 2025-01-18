import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PachinkoSlot = () => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [coins, setCoins] = useState(1000);
  const [win, setWin] = useState(0);
  const [spinIntervals, setSpinIntervals] = useState([null, null, null]);
  const [positions, setPositions] = useState([0, 0, 0]);

  const symbols = ['🍒', '🎰', '💎', '７', '🔔', '⭐'];
  const symbolsExtended = [...symbols, ...symbols, ...symbols, ...symbols]; // 4倍の長さの配列を作成

  const spinReel = () => {
    if (coins < 100) return;

    setCoins(prev => prev - 100);
    setSpinning([true, true, true]);
    setWin(0);

    const newIntervals = reels.map((_, index) => {
      let pos = 0;
      return setInterval(() => {
        pos = (pos + 1) % (symbols.length * 3);
        setPositions(prev => {
          const newPos = [...prev];
          newPos[index] = pos;
          return newPos;
        });
      }, 50);
    });

    setSpinIntervals(newIntervals);
  };

  const stopReel = (index) => {
    if (!spinning[index]) return;

    clearInterval(spinIntervals[index]);
    const finalPosition = Math.floor(Math.random() * symbols.length);
    const newReels = [...reels];
    newReels[index] = finalPosition;
    setReels(newReels);

    const newSpinning = [...spinning];
    newSpinning[index] = false;
    setSpinning(newSpinning);

    setPositions(prev => {
      const newPos = [...prev];
      newPos[index] = finalPosition;
      return newPos;
    });

    if (!newSpinning.some(s => s)) {
      checkWin(newReels);
    }
  };

  const checkWin = (finalReels) => {
    let totalPrize = 0;

    // 中央ラインのチェック
    const centerValues = finalReels.map(index => symbols[index]);
    // 上ラインのチェック
    const topValues = finalReels.map(index => symbols[(index - 1 + symbols.length) % symbols.length]);
    // 下ラインのチェック
    const bottomValues = finalReels.map(index => symbols[(index + 1) % symbols.length]);

    [topValues, centerValues, bottomValues].forEach(line => {
      if (line.every(val => val === '７')) {
        totalPrize += 5000;
      } else if (line.every(val => val === '💎')) {
        totalPrize += 2000;
      } else if (line.every(val => val === '🔔')) {
        totalPrize += 1000;
      } else if (line.every(val => val === '⭐')) {
        totalPrize += 500;
      } else if (line.every(val => val === '🍒')) {
        totalPrize += 200;
      }
    });

    if (totalPrize > 0) {
      setCoins(prev => prev + totalPrize);
      setWin(totalPrize);
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
            {reels.map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="reel-container h-48">
                  <div className="absolute top-1/3 left-0 right-0 h-16 border-y-2 border-yellow-400 pointer-events-none" />
                  <div
                    className={`reel-symbols ${spinning[index] ? 'spinning' : ''}`}
                    style={{
                      transform: `translateY(-${positions[index] * 64}px)`
                    }}
                  >
                    {symbolsExtended.map((symbol, symIndex) => (
                      <div key={symIndex} className="symbol">
                        {symbol}
                      </div>
                    ))}
                  </div>
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