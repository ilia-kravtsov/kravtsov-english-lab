import type { PracticeMode } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import { Button } from '@/shared/ui';
import { ConfettiBurstPetard } from '@/shared/ui/ConfettiBurstPetard/ConfettiBurstPetard.tsx';

import style from './PracticeResults.module.scss';

export type PracticeStats = {
  recognition?: PracticeModeStats;
  typing?: PracticeModeStats;
  listening?: PracticeModeStats;
  context?: PracticeModeStats;
};

export type PracticeModeStats = {
  totalCards: number;
  completedCards: number;
  firstTryCorrectCards: number;
  wrongAnswers: number;
  skippedCards: number;
  totalAnswers: number;
  correctAnswers: number;
  avgTimeMs: number;
};

type Props = {
  cardSetId: string;
  restart: () => void;
  restartTitle: string;
};

const MODE_LABEL: Record<PracticeMode, string> = {
  recognition: 'Recognition',
  typing: 'Typing',
  listening: 'Listening',
  context: 'Context',
  standard: 'Standard',
};

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function format(stat?: PracticeModeStats) {
  if (!stat) return 'Not started';

  const parts: string[] = [];

  parts.push(`${stat.completedCards}/${stat.totalCards} completed`);

  if (stat.firstTryCorrectCards !== undefined && stat.totalCards > 0) {
    const firstTry = Math.round((stat.firstTryCorrectCards / stat.totalCards) * 100);
    parts.push(`first try ${firstTry}%`);
  }

  if (stat.wrongAnswers) {
    parts.push(plural(stat.wrongAnswers, 'mistake'));
  }

  if (stat.skippedCards) {
    parts.push(plural(stat.skippedCards, 'skip'));
  }

  if (stat.avgTimeMs) {
    parts.push(`avg ${stat.avgTimeMs}ms`);
  }

  return parts.join(' · ');
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={style.resultRow}>
      <div className={style.resultLabel}>{label}</div>
      <div className={style.resultValue}>{value}</div>
    </div>
  );
}

export function PracticeResults({ cardSetId, restart, restartTitle }: Props) {
  const stats = readPracticeStats(cardSetId) as PracticeStats;

  return (
    <div className={style.result}>
      <ConfettiBurstPetard />

      <h3 className={style.sectionTitle}>Results</h3>

      <div className={style.resultBlock}>
        <Row label={MODE_LABEL.recognition} value={format(stats.recognition)} />

        <Row label={MODE_LABEL.typing} value={format(stats.typing)} />

        <Row label={MODE_LABEL.listening} value={format(stats.listening)} />

        <Row label={MODE_LABEL.context} value={format(stats.context)} />
      </div>

      <div className={style.controlsRow}>
        <Button title={restartTitle} onClick={restart} style={{ width: '200px' }} />
      </div>
    </div>
  );
}
