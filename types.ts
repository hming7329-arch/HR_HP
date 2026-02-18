
export interface Person {
  id: string;
  name: string;
}

export interface Group {
  id: number;
  members: Person[];
}

export interface DrawWinner {
  id: string;
  name: string;
  prize: string;
  timestamp: Date;
}

export enum AppTab {
  INPUT = 'input',
  LUCKY_DRAW = 'draw',
  GROUPING = 'grouping'
}
