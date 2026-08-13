import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initAudio } from "@/src/game/audio/sound";

export default function RootLayout() {
  useEffect(() => {
    initAudio();
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
