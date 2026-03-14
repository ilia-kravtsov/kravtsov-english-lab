import { createGStore } from 'create-gstore';
import { useState } from 'react';

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

export const useLexicalUnitEditorStore = createGStore<LexicalUnitEditorState>(() => {
  const [activeTab, setActiveTab] = useState<WordsBankTab>('add');
  const [mode, setMode] = useState<EditorMode>('add');
  const [prefillValue, setPrefillValue] = useState('');
  const [editingUnit, setEditingUnit] = useState<LexicalUnit | null>(null);

  return {
    activeTab,
    mode,
    prefillValue,
    editingUnit,

    openSearch: () => {
      setMode('add');
      setEditingUnit(null);
      setPrefillValue('');
      setActiveTab('search');
    },

    openAdd: () => {
      setMode('add');
      setEditingUnit(null);
      setActiveTab('add');
    },

    openAddWithValue: (value) => {
      setMode('add');
      setEditingUnit(null);
      setPrefillValue(value);
      setActiveTab('add');
    },

    openUpdate: (unit) => {
      setMode('update');
      setEditingUnit(unit);
      setPrefillValue('');
      setActiveTab('add');
    },

    resetEditor: () => {
      setMode('add');
      setEditingUnit(null);
      setPrefillValue('');
    },
  };
});
