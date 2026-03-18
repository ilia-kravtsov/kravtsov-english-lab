import type { ProfilerOnRenderCallback } from 'react';

type ProfilerPhase = 'mount' | 'update' | 'nested-update';

interface ProfilerLogEntry {
  id: string;
  phase: ProfilerPhase;
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

declare global {
  interface Window {
    __APP_PROFILER_LOGS__?: ProfilerLogEntry[];
  }
}

function round(value: number) {
  return Number(value.toFixed(2));
}

export const appProfilerOnRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  const entry: ProfilerLogEntry = {
    id,
    phase,
    actualDuration: round(actualDuration),
    baseDuration: round(baseDuration),
    startTime: round(startTime),
    commitTime: round(commitTime),
  };

  if (!window.__APP_PROFILER_LOGS__) {
    window.__APP_PROFILER_LOGS__ = [];
  }

  window.__APP_PROFILER_LOGS__.push(entry);

  if (phase === 'mount') {
    console.log(
      `[Profiler:${id}] mount | actual=${entry.actualDuration}ms | base=${entry.baseDuration}ms | start=${entry.startTime} | commit=${entry.commitTime}`,
    );
    return;
  }

  if (phase === 'update') {
    console.log(
      `[Profiler:${id}] update | actual=${entry.actualDuration}ms | base=${entry.baseDuration}ms | start=${entry.startTime} | commit=${entry.commitTime}`,
    );
    return;
  }

  console.log(
    `[Profiler:${id}] nested-update | actual=${entry.actualDuration}ms | base=${entry.baseDuration}ms | start=${entry.startTime} | commit=${entry.commitTime}`,
  );
};

export function clearProfilerLogs() {
  window.__APP_PROFILER_LOGS__ = [];
}

export function getProfilerLogs() {
  return window.__APP_PROFILER_LOGS__ ?? [];
}