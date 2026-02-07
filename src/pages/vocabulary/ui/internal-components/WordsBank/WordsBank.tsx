import style from './WordsBank.module.scss';
import { AddLexicalUnitForm } from '@/features/vocabulary/lexical-unit-add';
import { useState } from 'react';
import { SearchLexicalUnit } from '@/features/vocabulary/lexical-unit-add/ui/SearchLexicalUnit/SearchLexicalUnit.tsx';

type Tab = 'add' | 'search';

export function WordsBank() {
  const [activeTab, setActiveTab] = useState<Tab>('add');

  return (
    <div className={style.container}>
      <div className={style.tabsHeader}>
        <button
          className={`${style.tab} ${activeTab === 'add' ? style.active : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add
        </button>

        <button
          className={`${style.tab} ${activeTab === 'search' ? style.active : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
      </div>

      <div className={style.tabsContent}>
        {activeTab === 'add' && <AddLexicalUnitForm />}
        {activeTab === 'search' && <SearchLexicalUnit />}
      </div>
    </div>
  );
}
