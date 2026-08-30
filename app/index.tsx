import { useEffect } from "react";
import { Alert, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useGameStore } from "@/src/game/store";
import { loadGame, saveGame } from "@/src/game/save";
import { useMusic } from "@/src/game/audio/music";
import { menuArt, song } from "@/src/game/assets";
import MenuButtonZone from "@/src/game/ui/MenuButtonZone";
import AnimatedBackdrop from "@/src/game/ui/AnimatedBackdrop";
import Atmosphere from "@/src/game/ui/Atmosphere";

const ART_ASPECT = 1920 / 1080;

export default function Title() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);
  const loadState = useGameStore((s) => s.loadState);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const contentOpacity = useSharedValue(0);

  useMusic(song, 0.45);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) });
  }, [contentOpacity]);

  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  const onNewGame = async () => {
    newGame();
    const store = useGameStore.getState();
    await saveGame({ game: store.game, settings: store.settings });
    router.replace("/game/prologue");
  };

  const onContinue = async () => {
    const data = await loadGame();
    if (!data) {
      Alert.alert("No saved game", "Start a new game first.");
      return;
    }
    loadState(data.game);
    if (data.game.prologueDone) {
      router.replace("/game/act1");
    } else {
      router.replace({ pathname: "/game/prologue", params: { at: String(data.game.cutsceneAt ?? 0) } });
    }
  };

  const onSettings = () => router.push("/settings");

  const windowAspect = windowWidth / windowHeight;
  const boxWidth = windowAspect > ART_ASPECT ? windowHeight * ART_ASPECT : windowWidth;
  const boxHeight = windowAspect > ART_ASPECT ? windowHeight : windowWidth / ART_ASPECT;

  return (
    <View style={styles.root}>
      <AnimatedBackdrop source={menuArt} />
      <View style={styles.scrim} />

      <Animated.View style={[styles.artBox, { width: boxWidth, height: boxHeight }, contentStyle]}>
        <Image source={menuArt} style={StyleSheet.absoluteFillObject} contentFit="contain" />
        <Atmosphere />

        <MenuButtonZone top="49%" onPress={onNewGame} />
        <MenuButtonZone top="62%" onPress={onContinue} />
        <MenuButtonZone top="75.5%" onPress={onSettings} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  artBox: {
    position: "relative",
  },
});
