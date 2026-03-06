import { useEffect, useState } from 'react';
import style from './ConfettiBurst.module.scss';

type Props = {
  pieces?: number;
  maxDurationMs?: number;
};

type Piece = {
  x: number;
  delayMs: number;
  durMs: number;
  rot: number;
  sizeW: number;
  sizeH: number;
  color: string;
};

export function ConfettiBurst({ pieces = 46, maxDurationMs = 2800 }: Props) {
  const [items, setItems] = useState<Piece[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const generated: Piece[] = Array.from({ length: pieces }, () => {
      const hue = Math.floor(Math.random() * 360);

      return {
        x: Math.random() * 100,
        delayMs: Math.floor(Math.random() * 250),
        durMs: 1700 + Math.floor(Math.random() * 900),
        rot: -90 + Math.random() * 180,
        sizeW: 6 + Math.floor(Math.random() * 6),
        sizeH: 10 + Math.floor(Math.random() * 10),
        color: `hsl(${hue} 85% 60%)`,
      };
    });

    setItems(generated);
  }, [pieces]);

  useEffect(() => {
    const t = setTimeout(() => setActive(false), maxDurationMs);
    return () => clearTimeout(t);
  }, [maxDurationMs]);

  if (!active) return null;

  return (
    <div className={style.wrap}>
      {items.map((p, i) => (
        <span
          key={i}
          className={style.piece}
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delayMs}ms`,
            animationDuration: `${p.durMs}ms`,
            transform: `translateX(-50%) rotate(${p.rot}deg)`,
            width: `${p.sizeW}px`,
            height: `${p.sizeH}px`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}