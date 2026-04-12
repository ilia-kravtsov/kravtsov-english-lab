import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toAbsoluteMediaUrl } from '@/shared/lib/url/to-absolute-media-url.ts';

import { useListeningAudio } from './use-listening-audio';

vi.mock('@/shared/lib/url/to-absolute-media-url.ts', () => ({
  toAbsoluteMediaUrl: vi.fn(),
}));

type AudioListener = () => void;

type MockAudio = {
  currentTime: number;
  readyState: number;
  play: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  emitLoadedData: () => void;
};

function createAudioMock(readyState = 0): MockAudio {
  let loadedDataListener: AudioListener | null = null;

  return {
    currentTime: 123,
    readyState,
    play: vi.fn().mockResolvedValue(undefined),
    addEventListener: vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
      if (event === 'loadeddata') {
        loadedDataListener = cb as AudioListener;
      }
    }),
    removeEventListener: vi.fn((event: string, cb: EventListenerOrEventListenerObject) => {
      if (event === 'loadeddata' && loadedDataListener === cb) {
        loadedDataListener = null;
      }
    }),
    emitLoadedData: () => {
      loadedDataListener?.();
    },
  };
}

function createProps(overrides?: Partial<{ cardId?: string; audioUrl?: string | null }>) {
  return {
    cardId: undefined,
    audioUrl: '/audio.mp3',
    ...overrides,
  };
}

describe('useListeningAudio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns audioSrc from toAbsoluteMediaUrl', () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const { result } = renderHook(() =>
      useListeningAudio({
        cardId: '1',
        audioUrl: '/audio.mp3',
      }),
    );

    expect(toAbsoluteMediaUrl).toHaveBeenCalledWith('/audio.mp3');
    expect(result.current.audioSrc).toBe('https://cdn.test/audio.mp3');
  });

  it('does not autoplay when cardId is missing', () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(3);

    const { result } = renderHook(() =>
      useListeningAudio({
        audioUrl: '/audio.mp3',
      }),
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    expect(audio.play).not.toHaveBeenCalled();
  });

  it('does not autoplay when audioSrc is null', () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue(null);

    const audio = createAudioMock(3);

    const { result } = renderHook(() =>
      useListeningAudio({
        cardId: '1',
        audioUrl: null,
      }),
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    expect(audio.play).not.toHaveBeenCalled();
  });

  it('autoplays immediately when audio is ready', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(3);

    const { result, rerender } = renderHook(
      (props) => useListeningAudio(props),
      {
        initialProps: createProps(),
      },
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(1);
    expect(audio.addEventListener).not.toHaveBeenCalled();
  });

  it('autoplays after loadeddata when audio is not ready', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(0);

    const { result, rerender } = renderHook(
      (props) => useListeningAudio(props),
      {
        initialProps: createProps(),
      },
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.addEventListener).toHaveBeenCalledTimes(1);
    expect(audio.addEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function),
    );
    expect(audio.play).not.toHaveBeenCalled();

    await act(async () => {
      audio.emitLoadedData();
    });

    expect(audio.removeEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function),
    );
    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it('removes loadeddata listener on cleanup', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(0);

    const { result, rerender, unmount } = renderHook(
      (props) => useListeningAudio(props),
      {
        initialProps: createProps(),
      },
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.addEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function),
    );

    unmount();

    expect(audio.removeEventListener).toHaveBeenCalledWith(
      'loadeddata',
      expect.any(Function),
    );
  });

  it('does not autoplay same card and src twice after successful play', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(3);

    const { result, rerender } = renderHook(
      (props) => useListeningAudio(props),
      {
        initialProps: createProps(),
      },
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.play).toHaveBeenCalledTimes(1);

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it('retries autoplay after previous play failure', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(3);
    audio.play = vi
      .fn()
      .mockRejectedValueOnce(new Error('Autoplay blocked'))
      .mockResolvedValueOnce(undefined);

    const { result, rerender } = renderHook(
      (props) => useListeningAudio(props),
      {
        initialProps: createProps(),
      },
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.play).toHaveBeenCalledTimes(1);

    await act(async () => {
      rerender(createProps({ cardId: undefined }));
    });

    await act(async () => {
      rerender(createProps({ cardId: '1' }));
    });

    expect(audio.play).toHaveBeenCalledTimes(2);
  });

  it('playAudio resets currentTime and plays audio manually', async () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const audio = createAudioMock(0);

    const { result } = renderHook(() =>
      useListeningAudio({
        cardId: '1',
        audioUrl: '/audio.mp3',
      }),
    );

    result.current.audioRef.current = audio as unknown as HTMLAudioElement;

    await act(async () => {
      result.current.playAudio();
    });

    expect(audio.currentTime).toBe(0);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it('playAudio does nothing when audio ref is empty', () => {
    vi.mocked(toAbsoluteMediaUrl).mockReturnValue('https://cdn.test/audio.mp3');

    const { result } = renderHook(() =>
      useListeningAudio({
        cardId: '1',
        audioUrl: '/audio.mp3',
      }),
    );

    expect(() => result.current.playAudio()).not.toThrow();
  });
});