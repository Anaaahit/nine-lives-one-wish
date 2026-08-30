import { Alert, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useGameStore } from "@/src/game/store";
import { loadGame, saveGame } from "@/src/game/save";
import { useMusic } from "@/src/game/audio/music";
import { menuArt, song } from "@/src/game/assets";
import MenuButtonZone from "@/src/game/ui/MenuButtonZone";

const ART_ASPECT = 1920 / 1080;

export default function Title() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);
  const loadState = useGameStore((s) => s.loadState);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useMusic(song, 0.45);

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
      <Image
        source={menuArt}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        blurRadius={60}
      />
      <View style={styles.scrim} />

      <View style={[styles.artBox, { width: boxWidth, height: boxHeight }]}>
        <Image source={menuArt} style={StyleSheet.absoluteFillObject} contentFit="contain" />

        <MenuButtonZone top="49%" onPress={onNewGame} />
        <MenuButtonZone top="62%" onPress={onContinue} />
        <MenuButtonZone top="75.5%" onPress={onSettings} />
      </View>
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
