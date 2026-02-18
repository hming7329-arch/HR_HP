
import React, { useState, useEffect } from 'react';
import { Layout, Users, Trophy, ClipboardList, PlusCircle, Trash2, Download } from 'lucide-react';
import { Person, AppTab, DrawWinner, Group } from './types';
import { parseNames } from './utils';
import InputView from './components/InputView';
import DrawView from './components/DrawView';
import GroupingView from './components/GroupingView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  const [people, setPeople] = useState<Person[]>([]);
  const [winners, setWinners] = useState<DrawWinner[]>([]);
  const [lastGroups, setLastGroups] = useState<Group[]>([]);

  // Local Storage Persistence
  useEffect(() => {
    const saved = localStorage.getItem('hr_tools_people');
    if (saved) {
      try {
        setPeople(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved names");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hr_tools_people', JSON.stringify(people));
  }, [people]);

  const handleClearAll = () => {
    if (confirm("確定要清空所有名單嗎？")) {
      setPeople([]);
      setWinners([]);
      setLastGroups([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Layout size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">HR Tools Pro</h1>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-500">
              <span>已載入: <strong className="text-indigo-600">{people.length}</strong> 人</span>
              <button 
                onClick={handleClearAll}
                className="hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 size={16} /> 清空名單
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: AppTab.INPUT, name: '名單匯入', icon: ClipboardList },
              { id: AppTab.LUCKY_DRAW, name: '獎品抽籤', icon: Trophy },
              { id: AppTab.GROUPING, name: '自動分組', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all
                  ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === AppTab.INPUT && (
          <InputView 
            people={people} 
            setPeople={setPeople} 
          />
        )}
        
        {activeTab === AppTab.LUCKY_DRAW && (
          <DrawView 
            people={people} 
            winners={winners} 
            setWinners={setWinners} 
          />
        )}

        {activeTab === AppTab.GROUPING && (
          <GroupingView 
            people={people} 
            lastGroups={lastGroups}
            setLastGroups={setLastGroups}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          © 2024 HR Tools Pro. Designed for professional corporate administration.
        </div>
      </footer>
    </div>
  );
};

export default App;
