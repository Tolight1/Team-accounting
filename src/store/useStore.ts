import { create } from 'zustand';
import type { Member, Project, Category, Expense, TabKey } from '../types';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

interface AppState {
  members: Member[];
  projects: Project[];
  categories: Category[];
  expenses: Expense[];
  currentProjectId: string | null;
  activeTab: TabKey;

  addMember: (name: string) => void;
  removeMember: (id: string) => void;

  addProject: (name: string, description?: string) => void;
  removeProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;

  addCategory: (name: string) => void;
  removeCategory: (id: string) => void;

  addExpense: (data: Omit<Expense, 'id' | 'date'>) => void;
  removeExpense: (id: string) => void;
  setActiveTab: (tab: TabKey) => void;
}

const defaultCategories: Category[] = [
  { id: 'cat-1', name: '餐饮' },
  { id: 'cat-2', name: '交通' },
  { id: 'cat-3', name: '住宿' },
  { id: 'cat-4', name: '门票' },
  { id: 'cat-5', name: '购物' },
  { id: 'cat-6', name: '其他' },
];

export const useStore = create<AppState>((set) => ({
  members: [],
  projects: [],
  categories: defaultCategories,
  expenses: [],
  currentProjectId: null,
  activeTab: 'expenses',

  addMember: (name) =>
    set((s) => ({ members: [...s.members, { id: uid(), name }] })),

  removeMember: (id) =>
    set((s) => ({
      members: s.members.filter((m) => m.id !== id),
      expenses: s.expenses.map((e) => ({
        ...e,
        participantIds: e.participantIds.filter((pid) => pid !== id),
      })),
    })),

  addProject: (name, description) => {
    const id = uid();
    set((s) => ({
      projects: [...s.projects, { id, name, description }],
      currentProjectId: s.currentProjectId ?? id,
    }));
  },

  removeProject: (id) =>
    set((s) => {
      const filtered = s.projects.filter((p) => p.id !== id);
      return {
        projects: filtered,
        expenses: s.expenses.filter((e) => e.projectId !== id),
        currentProjectId:
          s.currentProjectId === id
            ? filtered.length > 0
              ? filtered[0].id
              : null
            : s.currentProjectId,
      };
    }),

  setCurrentProject: (id) =>
    set({ currentProjectId: id, activeTab: 'expenses' }),

  addCategory: (name) =>
    set((s) => ({ categories: [...s.categories, { id: uid(), name }] })),

  removeCategory: (id) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      expenses: s.expenses.filter((e) => e.categoryId !== id),
    })),

  addExpense: (data) =>
    set((s) => ({
      expenses: [
        ...s.expenses,
        {
          ...data,
          id: uid(),
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    })),

  removeExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
