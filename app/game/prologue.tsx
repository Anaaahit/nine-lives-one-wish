import { useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import CutscenePlayer from "@/src/game/cutscene/CutscenePlayer";
import { prologue } from "@/src/game/data/prologue";
import { useGameStore } from "@/src/game/store";
import { saveGame } from "@/src/game/save";

export default function Prologue() {
  const router = useRouter();
  const { at } = useLocalSearchParams<{ at?: string }>();
  const startAt = Math.min(Number(at ?? 0) || 0, prologue.length - 1);

  const finishAndGo = useCallback(() => {
    const store = useGameStore.getState();
    store.finishPrologue();
    const after = useGameStore.getState();
    saveGame({ game: after.game, settings: after.settings });
    router.replace("/game/act1");
  }, [router]);

  return (
    <CutscenePlayer
      script={prologue}
      startAt={startAt}
      onEvent={finishAndGo}
      onComplete={finishAndGo}
    />
  );
}
