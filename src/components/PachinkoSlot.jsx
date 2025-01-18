import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FloatingText from './FloatingText';

const PachinkoSlot = () => {
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [coins, setCoins] = useState(1000);
  const [win, setWin] = useState(0);
  const [spinIntervals, setSpinIntervals] = useState([null, null, null]);
  const [positions, setPositions] = useState([0, 0, 0]);
  const [audioContext, setAudioContext] = useState(null);
  const [floatingPrizes, setFloatingPrizes] = useState([]);
  const [floatingWin, setFloatingWin] = useState(null);
  const [winningLines, setWinningLines] = useState([]);
  const [targetPositions, setTargetPositions] = useState([0, 0, 0]);

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

  const playSevenSound = () => {
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

  const playBarSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    setTimeout(() => oscillator.stop(), 200);
  };

  const playBellSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 1760;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    setTimeout(() => oscillator.stop(), 100);
  };

  const playWatermelonSound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 523.25;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    setTimeout(() => oscillator.stop(), 150);
  };

  const playCherry = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 659.25;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    setTimeout(() => oscillator.stop(), 80);
  };

  const playReplaySound = () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    setTimeout(() => oscillator.stop(), 50);
  };

  // シンボル定義
  const SYMBOLS = {
    SEVEN: {
      icon: '㊗️',
      prize: 300,
      probability: 1/200,
      sound: playSevenSound,
      message: '㊗️㊗️㊗️ (+300)'
    },
    BAR: {
      icon: '📼',
      prize: 100,
      probability: 1/100,
      sound: playBarSound,
      message: '📼📼📼 (+100)'
    },
    BELL: {
      icon: '🔔',
      prize: 15,
      probability: 1/60,
      sound: playBellSound,
      message: '🔔🔔🔔 (+15)'
    },
    WATERMELON: {
      icon: '🍉',
      prize: 8,
      probability: 1/50,
      sound: playWatermelonSound,
      message: '🍉🍉🍉 (+8)'
    },
    CHERRY: {
      icon: '🍒',
      prize: 4,
      probability: 1/50,
      sound: playCherry,
      message: '🍒 (+4)',
      singleReel: true  // 1リール目のみの特殊条件
    },
    REPLAY: {
      icon: '🔵',
      prize: 3,
      probability: 1/6,
      sound: playReplaySound,
      message: '🔵🔵🔵 (リプレイ)',
      isReplay: true
    },
    BLANK: {
      icon: '➖',
      prize: 0,
      probability: 0,  // 残りの確率
      sound: null,
      message: null
    }
  };

  // リールの配列を定義
  const symbols = [
    [SYMBOLS.CHERRY.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BELL.icon, SYMBOLS.BAR.icon, SYMBOLS.SEVEN.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BELL.icon, SYMBOLS.BAR.icon, SYMBOLS.REPLAY.icon, SYMBOLS.CHERRY.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BELL.icon, SYMBOLS.BAR.icon, SYMBOLS.BLANK.icon, SYMBOLS.BLANK.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BELL.icon, SYMBOLS.BAR.icon, SYMBOLS.BLANK.icon],
    [SYMBOLS.BLANK.icon, SYMBOLS.CHERRY.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.SEVEN.icon, SYMBOLS.CHERRY.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.CHERRY.icon, SYMBOLS.BLANK.icon, SYMBOLS.CHERRY.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.REPLAY.icon, SYMBOLS.CHERRY.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon],
    [SYMBOLS.WATERMELON.icon, SYMBOLS.BLANK.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.REPLAY.icon, SYMBOLS.SEVEN.icon, SYMBOLS.BLANK.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.CHERRY.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BLANK.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon, SYMBOLS.CHERRY.icon, SYMBOLS.WATERMELON.icon, SYMBOLS.BLANK.icon, SYMBOLS.BAR.icon, SYMBOLS.BELL.icon]
  ];
  const symbolsExtended = symbols.map(reel => [...reel, ...reel, ...reel]); // 各リールを3倍の長さにする

  const spinReel = () => {
    if (coins < 3) return;

    playSpinSound();
    setCoins(prev => prev - 3);
    setSpinning([true, true, true]);
    setWin(0);
    setPositions([0, 0, 0]);

    // 乱数を生成して当選役を決定
    const random = Math.random();
    let targetSymbols;
    let currentProb = 0;

    for (const symbol of Object.values(SYMBOLS)) {
      currentProb += symbol.probability;
      if (random < currentProb) {
        if (symbol.singleReel) {
          targetSymbols = [symbol.icon, symbols[1][0], symbols[2][0]];
        } else {
          targetSymbols = [symbol.icon, symbol.icon, symbol.icon];
        }
        break;
      }
    }

    // はずれの場合
    if (!targetSymbols) {
      targetSymbols = [SYMBOLS.BLANK.icon, SYMBOLS.BLANK.icon, SYMBOLS.BLANK.icon];
    }

    // 各リールで目標のシンボルの位置を探す
    const newTargetPositions = symbols.map((reel, i) => {
      const targetIndex = reel.findIndex(symbol => symbol === targetSymbols[i]);
      return targetIndex >= 0 ? targetIndex : Math.floor(Math.random() * reel.length);
    });

    setTargetPositions(newTargetPositions);

    const newIntervals = reels.map((_, index) => {
      let pos = 0;
      return setInterval(() => {
        const speed = index === 0 ? 1 : 0.5;
        pos = (pos + speed) % (symbols.length * 3);
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

    // 現在の位置から最も近い目標位置を計算
    const currentPos = positions[index] % symbols[index].length;
    const targetPos = targetPositions[index];

    // 目標位置までの距離を計算
    let finalPosition = targetPos;

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
    const newWinningLines = [];

    // 中央ラインのチェック
    const centerValues = finalReels.map((index, reelIndex) => symbols[reelIndex][index]);
    // 上ラインのチェック
    const topValues = finalReels.map((index, reelIndex) =>
      symbols[reelIndex][(index - 1 + symbols[reelIndex].length) % symbols[reelIndex].length]
    );
    // 下ラインのチェック
    const bottomValues = finalReels.map((index, reelIndex) =>
      symbols[reelIndex][(index + 1) % symbols[reelIndex].length]
    );

    [topValues, centerValues, bottomValues].forEach((line, index) => {
      const position = index === 0 ? '上段' : index === 1 ? '中段' : '下段';

      for (const symbol of Object.values(SYMBOLS)) {
        if (symbol === SYMBOLS.CHERRY) {
          // チェリーの特殊処理
          if (line[0] === symbol.icon) {
            totalPrize += symbol.prize;
            symbol.sound?.();
            newWinningLines.push(`${position}: ${symbol.message}`);
          }
        } else if (line.every(val => val === symbol.icon)) {
          if (symbol.isReplay) {
            setCoins(prev => prev + symbol.prize);
          } else {
            totalPrize += symbol.prize;
          }
          symbol.sound?.();
          newWinningLines.push(`${position}: ${symbol.message}`);
        }
      }
    });

    if (totalPrize > 0 || newWinningLines.length > 0) {
      setWinningLines(newWinningLines);
      setCoins(prev => prev + totalPrize);
      setWin(totalPrize);
      setFloatingWin(totalPrize);
      setTimeout(() => {
        setFloatingWin(null);
      }, 2000);
    } else {
      setWinningLines([]);
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
          {floatingWin && (
            <div className="floating-win">
              当たり！ +{floatingWin}コイン
            </div>
          )}

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
                    {symbolsExtended[index].map((symbol, symIndex) => (
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
            disabled={spinning.some(s => s) || coins < 3}
            className="w-full"
          >
            スピン (3コイン)
          </Button>

          <div className="text-sm text-gray-500">
            配当表:
            <br />
            ㊗️㊗️㊗️: 300コイン
            <br />
            📼 📼 📼: 100コイン
            <br />
            🔔🔔🔔: 15コイン
            <br />
            🍉🍉🍉: 8コイン
            <br />
            🍒: 4コイン（1リール目のみ）
            <br />
            🔵🔵🔵: リプレイ
          </div>

          {floatingPrizes.map(prize => (
            <FloatingText
              key={prize.id}
              text={prize.amount}
              onComplete={() => {
                setFloatingPrizes(prev => prev.filter(p => p.id !== prize.id));
              }}
            />
          ))}

          <div className="fixed right-4 top-4 w-64 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">当選履歴</h3>
            {winningLines.length > 0 ? (
              <ul className="text-left">
                {winningLines.map((line, index) => (
                  <li key={index} className="mb-1">{line}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">はずれ</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PachinkoSlot;