
import { Person } from './types';

export const MOCK_NAMES = [
  "陳大文", "李小華", "張美麗", "王志明", "林志玲", 
  "周杰倫", "蔡依林", "郭台銘", "馬雲", "馬斯克",
  "賈伯斯", "比爾蓋茲", "泰勒絲", "庫克", "佩吉",
  "劉德華", "張學友", "郭富城", "黎明", "周星馳",
  "梁朝偉", "金城武", "林青霞", "王祖賢", "張曼玉"
];

export const parseNames = (input: string): Person[] => {
  return input
    .split(/[\n,，]+/) // 支援全型與半型逗號
    .map(name => name.trim())
    .filter(name => name !== "")
    .map((name, index) => ({
      id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name
    }));
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getDuplicateNames = (people: Person[]): Set<string> => {
  const nameCounts = new Map<string, number>();
  people.forEach(p => {
    nameCounts.set(p.name, (nameCounts.get(p.name) || 0) + 1);
  });
  
  const duplicates = new Set<string>();
  nameCounts.forEach((count, name) => {
    if (count > 1) duplicates.add(name);
  });
  return duplicates;
};

export const generateCSV = (data: any[][]): string => {
  // 加上 BOM 頭確保 Excel 開啟不掉碼
  const BOM = '\uFEFF';
  const content = data.map(row => 
    row.map(cell => {
      const stringValue = String(cell).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',')
  ).join('\n');
  return BOM + content;
};
