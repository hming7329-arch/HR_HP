
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, History, Settings, Play, RefreshCw, X, Gift } from 'lucide-react';
import { Person, DrawWinner } from '../types';
import { shuffleArray } from '../utils';

interface DrawViewProps {
  people: Person[];
  winners: DrawWinner[];
  setWinners: React.Dispatch<React.SetStateAction<DrawWinner[]>>;
}

const DrawView: React.FC<DrawViewProps> = ({ people, winners, setWinners }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Person | null>(null);
  const [prizeName, setPrizeName] = useState("頭獎");
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [drawPool, setDrawPool] = useState<Person[]>([]);
  const [animatingName, setAnimatingName] = useState("");
  const timerRef = useRef<number | null>(null);

  // Filter pool based on duplicate setting
  useEffect(() => {
    if (allowDuplicate) {
      setDrawPool(people);
    } else {
      const winnerIds = new Set(winners.map(w => w.id));
      setDrawPool(people.filter(p => !winnerIds.has(p.id)));
    }
  }, [people, winners, allowDuplicate]);

  const startDraw = () => {
    if (drawPool.length === 0) {
      alert("抽籤池已空！");
      return;
    }
    
    setIsDrawing(true);
    setCurrentWinner(null);
    let counter = 0;
    const duration = 2000; // 2 seconds animation
    const interval = 80;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const randomIndex = Math.floor(Math.random() * drawPool.length);
      setAnimatingName(drawPool[randomIndex].name);

      if (elapsed < duration) {
        timerRef.current = window.setTimeout(animate, interval);
      } else {
        const finalWinner = drawPool[randomIndex];
        setCurrentWinner(finalWinner);
        setIsDrawing(false);
        setWinners(prev => [
          {
            ...finalWinner,
            prize: prizeName,
            timestamp: new Date()
          },
          ...prev
        ]);
        // Simple confetti effect (using built-in browser-friendly approach if possible or just visual feedback)
      }
    };

    animate();
  };

  const removeWinner = (index: number) => {
    setWinners(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Configuration */}
      <div className="space-y-6 lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Settings className="text-indigo-600" size={20} />
            抽籤設定
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">獎品名稱</label>
              <input
                type="text"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700">允許重複抽中</p>
                <p className="text-xs text-slate-400">開啟後已中獎者仍可參與</p>
              </div>
              <button
                onClick={() => setAllowDuplicate(!allowDuplicate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${allowDuplicate ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowDuplicate ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">抽籤池狀態</p>
              <p className="text-2xl font-bold text-indigo-900">{drawPool.length} <span className="text-sm font-normal text-indigo-500">人</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <History className="text-indigo-600" size={20} />
            中獎紀錄
          </h2>
          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {winners.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm italic">尚無紀錄</p>
            ) : (
              winners.map((winner, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{winner.name}</p>
                    <p className="text-xs text-slate-500">{winner.prize} · {winner.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <button onClick={() => removeWinner(idx)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right: Main Draw Area */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-xl p-12 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center min-h-[400px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 translate-y-32 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {isDrawing ? (
              <div className="space-y-6">
                <div className="text-5xl md:text-7xl font-black text-white tracking-widest drop-shadow-lg">
                  {animatingName}
                </div>
                <div className="flex items-center justify-center gap-2 text-indigo-100 animate-pulse">
                  <RefreshCw className="animate-spin" size={20} />
                  正在抽取 {prizeName}...
                </div>
              </div>
            ) : currentWinner ? (
              <div className="animate-in fade-in zoom-in duration-500 space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-400 p-4 rounded-full shadow-lg animate-bounce">
                    <Trophy size={48} className="text-yellow-900" />
                  </div>
                </div>
                <h3 className="text-indigo-100 text-xl font-medium">恭喜獲獎！</h3>
                <div className="text-6xl md:text-8xl font-black text-white drop-shadow-xl my-4">
                  {currentWinner.name}
                </div>
                <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-semibold">
                  {prizeName}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/10 p-8 rounded-full">
                  <Gift size={80} className="text-white opacity-40" />
                </div>
                <h3 className="text-white text-3xl font-bold">準備好抽籤了嗎？</h3>
                <p className="text-indigo-100">點擊下方按鈕開始隨機抽取</p>
              </div>
            )}
          </div>

          {!isDrawing && (
            <button
              onClick={startDraw}
              disabled={drawPool.length === 0}
              className="mt-12 group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200 bg-yellow-500 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              <Play className="mr-2 fill-current" size={24} />
              開始抽籤
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawView;
