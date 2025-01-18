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
  const [audioContext, setAudioContext] = useState(null);

  // 効果音の初期化
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);
  }, []);

  const playSpinSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 200;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    setTimeout(() => oscillator.stop(), 100);
  };

  const playStopSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.05;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    setTimeout(() => oscillator.stop(), 50);
  };

  const playWinSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    setTimeout(() => oscillator.stop(), 300);
  };

  const symbols = ['🍒', '🎰', '💎', '７', '🔔', '⭐'];
  const symbolsExtended = [...symbols, ...symbols, ...symbols, ...symbols]; // 4倍の長さの配列を作成

  const spinReel = () => {
    if (coins < 100) return;

    playSpinSound();
    setCoins(prev => prev - 100);
    setSpinning([true, true, true]);
    setWin(0);
    setPositions([0, 0, 0]);

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

  /**
   * スピンを停止する
   *
   * スピンを停止したときに、シンボルの位置をランダムに設定する
   * @param {*} index
   * @returns
   */
  const stopReel = (index) => {
    if (!spinning[index]) return;

    playStopSound();

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
      playWinSound();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault(); // スクロール防止
        if (!spinning.some(s => s)) {
          spinReel();
        }
      } else if (event.key >= '1' && event.key <= '3') {
        const index = parseInt(event.key) - 1;
        if (spinning[index]) {
          stopReel(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spinning]); // spinning の状態を依存配列に追加

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="text-center">パチスロゲーム</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl">コイン: {coins}</div>
          {win > 0 && <div className="text-xl text-yellow-500">当たり！ +{win}コイン</div>}

          <div className="text-sm text-gray-500 mb-2">
            スペースキー: スピン開始<br/>
            1,2,3キー: 各リール停止
          </div>

          <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
            {reels.map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="reel-container h-48">
                  <div className="absolute top-1/3 left-0 right-0 h-16 border-y-2 border-yellow-400 pointer-events-none" />
                  <div
                    className={`reel-symbols ${spinning[index] ? 'spinning' : ''}`}
                    style={{
                      transform: spinning[index] ? undefined : `translateY(-${positions[index] * 64}px)`
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