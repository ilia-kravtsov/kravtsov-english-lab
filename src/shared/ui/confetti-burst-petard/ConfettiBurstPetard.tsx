import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import style from './ConfettiBurstPetard.module.scss';

type Props = {
  pieces?: number;
  maxDurationMs?: number;
};

type Piece = {
  dx: number;
  dy: number;
  delayMs: number;
  durMs: number;
  rot: number;
  rot2: number;
  sizeW: number;
  sizeH: number;
  color: string;
};

type PieceStyle = CSSProperties & {
  '--dx'?: string;
  '--dy'?: string;
  '--rot'?: string;
  '--rot2'?: string;
};

function genPieces(pieces: number): Piece[] {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;

  const minR = Math.min(w, h) * 0.18;
  const maxR = Math.min(w, h) * 0.42;

  return Array.from({ length: pieces }, () => {
    const hue = Math.floor(Math.random() * 360);

    const angle = Math.random() * Math.PI * 2;
    const r = minR + Math.random() * (maxR - minR);

    const upBias = 0.65 + Math.random() * 0.35;

    const dx = Math.cos(angle) * r;
    const dy = Math.sin(angle) * r * -upBias;

    const rot = -180 + Math.random() * 360;
    const rot2 = rot * (2.2 + Math.random() * 0.6);

    return {
      dx,
      dy,
      delayMs: Math.floor(Math.random() * 120),
      durMs: 1400 + Math.floor(Math.random() * 800),
      rot,
      rot2,
      sizeW: 6 + Math.floor(Math.random() * 8),
      sizeH: 10 + Math.floor(Math.random() * 14),
      color: `hsl(${hue} 85% 60%)`,
    };
  });
}

export function ConfettiBurstPetard({ pieces = 70, maxDurationMs = 2200 }: Props) {
  const [active, setActive] = useState(true);

  const items = useMemo(() => genPieces(pieces), [pieces]);

  useEffect(() => {
    const t = window.setTimeout(() => setActive(false), maxDurationMs);
    return () => window.clearTimeout(t);
  }, [maxDurationMs]);

  if (!active || typeof document === 'undefined') return null;

  return createPortal(
    <div className={style.wrap} aria-hidden>
      <div className={style.origin}>
        {items.map((p, i) => {
          const s: PieceStyle = {
            width: `${p.sizeW}px`,
            height: `${p.sizeH}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delayMs}ms`,
            animationDuration: `${p.durMs}ms`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
            '--rot2': `${p.rot2}deg`,
          };

          return <span key={i} className={style.piece} style={s} />;
        })}
      </div>
    </div>,
    document.body,
  );
}
