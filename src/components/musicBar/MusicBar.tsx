/// <reference types="youtube" />

import React, { useEffect, useRef, useState, useId, ChangeEvent } from "react";
import { musicData } from "../../data/musicData";

/* ─────────────── load IFrame API exactly once ────────────── */
let ytPromise: Promise<typeof YT> | null = null;

const loadYT = (): Promise<typeof YT> => {
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytPromise) return ytPromise;

  ytPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });

  return ytPromise;
};

/* ──────────────────────────────── MusicBar ───────────────── */
const MusicBar: React.FC = () => {
  /* unique *legal* id (strip “:” out of React’s useId output) */
  const uniqueId = `yt-audio-${useId().replace(/:/g, "")}`;

  const player = useRef<YT.Player | null>(null);

  /* guard so we DON’T re-create the player on Strict-Mode re-mount */
  const playerInitialised = useRef(false);

  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [pos, setPos] = useState(0);
  const [vol, setVol] = useState(50);

  /* ───── create the YouTube player ONCE ───── */
  useEffect(() => {
    if (playerInitialised.current) return; // skip 2-nd pass
    playerInitialised.current = true;

    loadYT().then((YT) => {
      player.current = new YT.Player(uniqueId, {
        height: "0",
        width: "0",
        videoId: musicData[0].id,
        playerVars: { controls: 0, modestbranding: 1 },
        events: {
          onReady: () => {
            setReady(true);
            setDur(player.current!.getDuration());
            player.current!.setVolume(vol);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) next();
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
          },
        },
      });
    });

    /* real unmount cleanup */
    return () => player.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* update progress every 500 ms while playing */
  useEffect(() => {
    if (!ready || !playing) return;
    const timer = window.setInterval(() => {
      if (player.current) setPos(player.current.getCurrentTime());
    }, 500);
    return () => clearInterval(timer);
  }, [ready, playing]);

  /* keep volume in sync */
  useEffect(() => {
    if (ready) player.current?.setVolume(vol);
  }, [vol, ready]);

  /* ───── helpers ───── */
  const load = (i: number, auto = false) => {
    if (!player.current || !ready) return;
    const vid = musicData[i].id;
    auto ? player.current.loadVideoById(vid) : player.current.cueVideoById(vid);
    setIndex(i);
    setTimeout(() => setDur(player.current!.getDuration()), 250);
  };

  const playPause = () =>
    playing ? player.current?.pauseVideo() : player.current?.playVideo();

  const stop = () => {
    player.current?.stopVideo();
    setPlaying(false);
    setPos(0);
  };

  const next = () => load((index + 1) % musicData.length, true);

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    const s = +e.target.value;
    player.current?.seekTo(s, true);
    setPos(s);
  };

  /* ───── render ───── */
  return (
    <div
      className="flex items-center gap-4 px-4 h-[72px] border-t
                    border-gray-300 dark:border-gray-600 backdrop-blur-sm"
    >
      {/* hidden iframe */}
      <div
        id={uniqueId}
        style={{ position: "absolute", width: 0, height: 0 }}
      />

      {/* track selector */}
      <select
        value={index}
        onChange={(e) => load(+e.target.value)}
        className="bg-transparent border px-2 py-1 rounded shadow
                   text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
      >
        {musicData.map((t, i) => (
          <option key={t.id} value={i} className="dark:bg-gray-800">
            {t.title}
          </option>
        ))}
      </select>

      {/* progress bar */}
      <div className="flex flex-col flex-1 justify-center items-center mt-4">
        <input
          type="range"
          min={0}
          max={dur || 0}
          step={0.5}
          value={pos}
          onChange={seek}
          disabled={!ready}
          className="w-full accent-blue-600 disabled:opacity-50"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{format(pos)}</span>
        </div>
      </div>

      {/* controls */}
      <button
        onClick={playPause}
        disabled={!ready}
        className="btn text-gray-800 dark:text-gray-300 font-semibold"
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button
        onClick={stop}
        disabled={!ready}
        className="btn text-gray-800 dark:text-gray-300 font-semibold"
      >
        Stop
      </button>
      <button
        onClick={next}
        disabled={!ready}
        className="btn text-gray-800 dark:text-gray-300 font-semibold"
      >
        Next
      </button>

      {/* volume */}
      <input
        type="range"
        min={0}
        max={100}
        value={vol}
        onChange={(e) => setVol(+e.target.value)}
        className="w-[110px] accent-blue-600"
      />
    </div>
  );
};

/* util to format seconds → m:ss */
const format = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

/* Tailwind helper (optional put in global CSS) */
export const styles = `
.btn{
  @apply px-3 py-1 rounded border shadow hover:shadow-md
         text-gray-900 dark:text-gray-100
         border-gray-300 dark:border-gray-600 disabled:opacity-50;
}`;

export default MusicBar;
