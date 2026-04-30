export interface Member {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  projectId: string;
  amount: number;
  categoryId: string;
  participantIds: string[];
  description?: string;
  date: string;
}

export interface CategoryStat {
  categoryName: string;
  total: number;
  count: number;
}

export interface PersonStat {
  memberName: string;
  total: number;
  count: number;
}

export type TabKey = 'expenses' | 'statistics' | 'manage';
