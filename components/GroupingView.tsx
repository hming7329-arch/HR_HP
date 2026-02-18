
import React, { useState } from 'react';
import { Users, Download, RefreshCcw, LayoutGrid, List, FileSpreadsheet, FileText } from 'lucide-react';
import { Person, Group } from '../types';
import { shuffleArray, chunkArray, generateCSV } from '../utils';

interface GroupingViewProps {
  people: Person[];
  lastGroups: Group[];
  setLastGroups: React.Dispatch<React.SetStateAction<Group[]>>;
}

const GroupingView: React.FC<GroupingViewProps> = ({ people, lastGroups, setLastGroups }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [mode, setMode] = useState<'size' | 'count'>('size');
  const [targetCount, setTargetCount] = useState(3);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleGroup = () => {
    if (people.length === 0) {
      alert("請先匯入人員名單！");
      return;
    }
    
    const shuffled = shuffleArray<Person>(people);
    let chunks: Person[][];

    if (mode === 'size') {
      chunks = chunkArray<Person>(shuffled, Math.max(1, groupSize));
    } else {
      const actualTargetCount = Math.max(1, Math.min(targetCount, people.length));
      const sizePerGroup = Math.ceil(people.length / actualTargetCount);
      chunks = chunkArray<Person>(shuffled, sizePerGroup);
    }

    const newGroups = chunks.map((members, idx) => ({
      id: idx + 1,
      members
    }));

    setLastGroups(newGroups);
  };

  const exportAsTxt = () => {
    const text = lastGroups.map(g => `第 ${g.id} 組: ${g.members.map(m => m.name).join(', ')}`).join('\n');
    downloadFile(text, 'txt', 'text/plain');
    setShowExportMenu(false);
  };

  const exportAsCsv = () => {
    const header = ['組別', '人員姓名', '唯一標識碼'];
    const rows = lastGroups.flatMap(g => 
      g.members.map(m => [`第 ${g.id} 組`, m.name, m.id])
    );
    const csvContent = generateCSV([header, ...rows]);
    downloadFile(csvContent, 'csv', 'text/csv;charset=utf-8');
    setShowExportMenu(false);
  };

  const downloadFile = (content: string, ext: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `分組結果_${new Date().toISOString().split('T')[0]}_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 分組控制區 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="text-indigo-600" size={20} />
              分組邏輯設定
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setMode('size')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium ${mode === 'size' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
              >
                <LayoutGrid size={18} />
                依每組人數
              </button>
              <button 
                onClick={() => setMode('count')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium ${mode === 'count' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
              >
                <List size={18} />
                依目標組數
              </button>
            </div>
          </div>

          <div className="w-full md:w-48 space-y-2">
            <label className="text-sm font-semibold text-slate-600">
              {mode === 'size' ? '每組期望人數' : '總共劃分組數'}
            </label>
            <input
              type="number"
              min="1"
              max={people.length || 1}
              value={mode === 'size' ? groupSize : targetCount}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                mode === 'size' ? setGroupSize(val) : setTargetCount(val);
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
            />
          </div>

          <div className="flex gap-2 relative">
            <button
              onClick={handleGroup}
              disabled={people.length === 0}
              className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCcw size={20} />
              立即自動分組
            </button>
            
            {lastGroups.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 p-3 rounded-xl transition-all shadow-sm flex items-center gap-2 font-semibold"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">匯出</span>
                </button>
                
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-2 animate-in zoom-in-95 duration-200 origin-top-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">選擇匯出格式</div>
                      <button 
                        onClick={exportAsCsv}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 text-slate-700 text-sm font-bold rounded-xl transition-colors group"
                      >
                        <FileSpreadsheet className="text-emerald-500 group-hover:scale-110 transition-transform" size={20} />
                        下載 Excel (CSV)
                      </button>
                      <button 
                        onClick={exportAsTxt}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-blue-50 text-slate-700 text-sm font-bold rounded-xl transition-colors group"
                      >
                        <FileText className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                        下載 TXT 純文字
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 分組視覺化顯示區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lastGroups.length === 0 ? (
          <div className="col-span-full py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
            <Users size={80} strokeWidth={1} />
            <div className="text-center">
              <p className="text-xl font-bold">尚未產生分組</p>
              <p className="text-sm mt-1">請設定好參數後點擊「立即自動分組」</p>
            </div>
          </div>
        ) : (
          lastGroups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${group.id * 50}ms` }}
            >
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-black">
                    {group.id}
                  </div>
                  <h3 className="font-black text-slate-800 tracking-tight">第 {group.id} 組</h3>
                </div>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-5">
                <ul className="space-y-3">
                  {group.members.map((member, i) => (
                    <li key={member.id} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 group-hover:bg-indigo-500 group-hover:scale-150 transition-all" />
                      <span className="text-slate-700 font-bold group-hover:text-indigo-600 transition-colors">
                        {member.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupingView;
