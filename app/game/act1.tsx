import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMusic } from "@/src/game/audio/music";
import { song } from "@/src/game/assets";

export default function Act1() {
  const router = useRouter();
  useMusic(song, 0.45);

  return (
    <LinearGradient colors={["#05060f", "#0a1430", "#14203c"]} style={styles.root}>
      <View style={styles.body}>
        <Text style={styles.kicker}>ACT ONE</Text>
        <Text style={styles.title}>The Apartment</Text>
        <Text style={styles.hook}>
          The door is still moving. Somewhere out there, in a world he has never
          seen from this height, his body is running.
        </Text>
        <Text style={styles.note}>
          Gameplay — moving, tapping, and the first key-and-door puzzle — arrives
          in the next milestone.
        </Text>
      </View>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.replace("/game/prologue")}>
          <Text style={styles.buttonText}>Replay prologue</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.ghost]} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>Back to title</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  kicker: {
    color: "rgba(255, 217, 160, 0.8)",
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 12,
  },
  title: {
    color: "#eef1fa",
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 20,
  },
  hook: {
    color: "rgba(238, 241, 250, 0.85)",
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
  },
  note: {
    color: "rgba(238, 241, 250, 0.45)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 24,
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
});
