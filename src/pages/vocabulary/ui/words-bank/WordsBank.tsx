import { AddLexicalUnitForm } from '@/features/vocabulary/lexical-unit-add';
import { useLexicalUnitEditorStore } from '@/features/vocabulary/lexical-unit-add/model/lexical-unit-editor.store.ts';
import { SearchLexicalUnit } from '@/features/vocabulary/lexical-unit-add/ui/search-lexical-unit/SearchLexicalUnit.tsx';

import style from './WordsBank.module.scss';

export function WordsBank() {
  const activeTab = useLexicalUnitEditorStore((s) => s.activeTab);
  const mode = useLexicalUnitEditorStore((s) => s.mode);
  const openAdd = useLexicalUnitEditorStore((s) => s.openAdd);
  const openSearch = useLexicalUnitEditorStore((s) => s.openSearch);

  return (
    <div className={style.container}>
      <div className={style.tabsHeader}>
        <button
          className={`${style.tab} ${activeTab === 'add' ? style.active : ''}`}
          onClick={openAdd}
          type={"button"}
        >
          {mode === 'update' ? 'Update' : 'Add'}
        </button>

        <button
          className={`${style.tab} ${activeTab === 'search' ? style.active : ''}`}
          onClick={openSearch}
          type={"button"}
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
