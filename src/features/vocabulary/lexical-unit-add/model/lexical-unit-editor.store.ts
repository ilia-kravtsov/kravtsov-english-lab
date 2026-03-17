import { create } from 'zustand/react';

import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types';

export type WordsBankTab = 'add' | 'search';
export type EditorMode = 'add' | 'update';

interface LexicalUnitEditorState {
  activeTab: WordsBankTab;
  mode: EditorMode;
  prefillValue: string;
  editingUnit: LexicalUnit | null;

  openSearch: () => void;
  openAdd: () => void;
  openAddWithValue: (value: string) => void;
  openUpdate: (unit: LexicalUnit) => void;
  resetEditor: () => void;
}

export const useLexicalUnitEditorStore = create<LexicalUnitEditorState>((set) => ({
  activeTab: 'add',
  mode: 'add',
  prefillValue: '',
  editingUnit: null,

  openSearch: () =>
    set({
      mode: 'add',
      editingUnit: null,
      prefillValue: '',
      activeTab: 'search',
    }),

  openAdd: () =>
    set({
      mode: 'add',
      editingUnit: null,
      activeTab: 'add',
    }),

  openAddWithValue: (value) =>
    set({
      mode: 'add',
      editingUnit: null,
      prefillValue: value,
      activeTab: 'add',
    }),

  openUpdate: (unit) =>
    set({
      mode: 'update',
      editingUnit: unit,
      prefillValue: '',
      activeTab: 'add',
    }),

  resetEditor: () =>
    set({
      mode: 'add',
      editingUnit: null,
      prefillValue: '',
    }),
}));
