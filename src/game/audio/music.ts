import { useEffect } from "react";
import { createAudioPlayer } from "expo-audio";
import { useGameStore } from "../store";

let player: ReturnType<typeof createAudioPlayer> | null = null;
let currentSource: number | null = null;

function safe(fn: () => void): void {
  try {
    fn();
  } catch (e) {
    console.warn("[music] audio unavailable", e);
  }
}

export function playMusic(source: number, volume = 0.8): void {
  if (!useGameStore.getState().settings.sound) return;
  safe(() => {
    if (player && currentSource === source) {
      player.play();
      return;
    }
    if (player) {
      player.pause();
      player.remove();
    }
    player = createAudioPlayer(source);
    currentSource = source;
    player.loop = true;
    player.volume = volume;
    player.play();
  });
}

export function pauseMusic(): void {
  safe(() => player?.pause());
}

export function resumeMusic(): void {
  if (!useGameStore.getState().settings.sound) return;
  safe(() => player?.play());
}

export function stopMusic(): void {
  safe(() => {
    if (player) {
      player.pause();
      player.remove();
    }
    player = null;
  });
  currentSource = null;
}

export function useMusic(source: number | null, volume = 0.8): void {
  useEffect(() => {
    if (source) playMusic(source, volume);
  }, [source, volume]);
}
