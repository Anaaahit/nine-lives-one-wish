import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initAudio } from "@/src/game/audio/sound";
import { pauseMusic, resumeMusic } from "@/src/game/audio/music";
import { useGameStore } from "@/src/game/store";

export default function RootLayout() {
  useEffect(() => {
    initAudio();
    const unsubscribe = useGameStore.subscribe((state, prev) => {
      if (state.settings.sound !== prev.settings.sound) {
        if (state.settings.sound) resumeMusic();
        else pauseMusic();
      }
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="game" />
      </Stack>
    </>
  );
}
