import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGameStore } from "@/src/game/store";
import { loadGame, saveGame } from "@/src/game/save";
import PlaceholderArt from "@/src/game/cutscene/art/PlaceholderArt";

export default function Title() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);
  const loadState = useGameStore((s) => s.loadState);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    loadGame().then((data) => setHasSave(Boolean(data?.game)));
  }, []);

  const onNewGame = async () => {
    newGame();
    const store = useGameStore.getState();
    await saveGame({ game: store.game, settings: store.settings });
    router.replace("/game/prologue");
  };

  const onContinue = async () => {
    const data = await loadGame();
    if (!data) return;
    loadState(data.game);
    if (data.game.prologueDone) {
      router.replace("/game/act1");
    } else {
      router.replace({ pathname: "/game/prologue", params: { at: String(data.game.cutsceneAt ?? 0) } });
    }
  };

  return (
    <View style={styles.root}>
      <PlaceholderArt id="city_night" />
      <LinearGradient
        colors={["rgba(5, 6, 15, 0.2)", "rgba(5, 6, 15, 0.85)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.body}>
        <Text style={styles.kicker}>a small story about a tired man, a cat, and a wish made in anger</Text>
        <Text style={styles.title}>Nine Lives,{`\n`}One Wish</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={onNewGame}>
          <Text style={styles.buttonText}>New game</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.ghost]} onPress={onContinue}>
          <Text style={[styles.buttonText, hasSave ? styles.buttonTextActive : styles.buttonTextDim]}>
            Continue
          </Text>
        </Pressable>
        <Pressable
          style={styles.link}
          onPress={() => {
            if (!hasSave) {
              Alert.alert("No saved game", "Start a new game first.");
              return;
            }
            router.push("/settings");
          }}
        >
          <Text style={styles.linkText}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#05060f",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  kicker: {
    color: "rgba(238, 241, 250, 0.6)",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
    maxWidth: 260,
    marginBottom: 18,
  },
  title: {
    color: "#eef1fa",
    fontSize: 44,
    fontWeight: "700",
    letterSpacing: 1,
  },
  buttons: {
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#2a3348",
    alignItems: "center",
    marginBottom: 12,
  },
  ghost: {
    backgroundColor: "rgba(42, 51, 72, 0.4)",
  },
  buttonText: {
    color: "#eef1fa",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  buttonTextActive: {
    color: "#eef1fa",
  },
  buttonTextDim: {
    color: "rgba(238, 241, 250, 0.35)",
  },
  link: {
    alignItems: "center",
    paddingVertical: 12,
  },
  linkText: {
    color: "rgba(238, 241, 250, 0.5)",
    fontSize: 15,
  },
});
