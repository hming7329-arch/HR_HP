
import React, { useState, useMemo } from 'react';
import { Upload, FileText, UserPlus, X, List, Users, Sparkles, AlertTriangle } from 'lucide-react';
import { Person } from '../types';
import { parseNames, MOCK_NAMES, getDuplicateNames } from '../utils';

interface InputViewProps {
  people: Person[];
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
}

const InputView: React.FC<InputViewProps> = ({ people, setPeople }) => {
  const [textInput, setTextInput] = useState("");

  const duplicateNames = useMemo(() => getDuplicateNames(people), [people]);

  const handleTextSubmit = () => {
    const newPeople = parseNames(textInput);
    if (newPeople.length > 0) {
      setPeople(prev => [...prev, ...newPeople]);
      setTextInput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newPeople = parseNames(content);
      setPeople(prev => [...prev, ...newPeople]);
    };
    reader.readAsText(file);
    e.target.value = ""; 
  };

  const loadMockData = () => {
    const mockPeople = MOCK_NAMES.map((name, index) => ({
      id: `mock-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name
    }));
    setPeople(prev => [...prev, ...mockPeople]);
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const clearDuplicates = () => {
    const seen = new Set<string>();
    const uniquePeople: Person[] = [];
    people.forEach(p => {
      if (!seen.has(p.name)) {
        uniquePeople.push(p);
        seen.add(p.name);
      }
    });
    setPeople(uniquePeople);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 左側：匯入區域 */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="text-indigo-600" size={20} />
              手動輸入名單
            </h2>
            <button
              onClick={loadMockData}
              className="text-xs flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors font-medium border border-indigo-100"
            >
              <Sparkles size={14} /> 載入模擬名單
            </button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="請輸入姓名，可用換行或逗號隔開..."
            className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 resize-none"
          />
          <button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            新增至名單
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Upload className="text-indigo-600" size={20} />
            匯入檔案 (CSV / TXT)
          </h2>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileText className="mx-auto text-slate-300 group-hover:text-indigo-500 mb-3 transition-colors" size={40} />
            <p className="text-slate-600 text-sm font-semibold">拖拽檔案或點擊上傳</p>
            <p className="text-slate-400 text-xs mt-1">支援 UTF-8 編碼之 .csv, .txt</p>
          </div>
        </div>
      </div>

      {/* 右側：名單預覽與重複管理 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <List className="text-indigo-600" size={20} />
            名單預覽 ({people.length})
          </h2>
          {duplicateNames.size > 0 && (
            <button
              onClick={clearDuplicates}
              className="text-xs flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors font-bold shadow-sm animate-bounce"
            >
              <AlertTriangle size={14} /> 移除所有重複
            </button>
          )}
        </div>

        {duplicateNames.size > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-amber-800 leading-relaxed">
              <strong>偵測到重複姓名：</strong>
              <span className="ml-1">{Array.from(duplicateNames).join(', ')}</span>。
              <br />
              系統已為您標記，您可以手動刪除或使用上方按鈕快速清理。
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {people.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
              <Users size={64} strokeWidth={1} />
              <div className="text-center">
                <p className="font-medium">名單空空如也</p>
                <p className="text-xs">請從左側匯入或輸入人員名單</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-4">
              {people.map((person) => {
                const isDuplicate = duplicateNames.has(person.name);
                return (
                  <div 
                    key={person.id}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all group ${
                      isDuplicate 
                        ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200 shadow-sm' 
                        : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`text-sm font-semibold truncate ${isDuplicate ? 'text-amber-700' : 'text-slate-700'}`}>
                        {person.name}
                      </span>
                      {isDuplicate && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                    </div>
                    <button 
                      onClick={() => removePerson(person.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors ml-1 p-0.5 hover:bg-red-50 rounded"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputView;
