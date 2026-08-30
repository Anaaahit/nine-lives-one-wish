import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMusic } from "@/src/game/audio/music";
import { song } from "@/src/game/assets";
import { colors, gradients } from "@/src/game/theme";
import Button from "@/src/game/ui/Button";

export default function Act1() {
  const router = useRouter();
  useMusic(song, 0.45);

  return (
    <LinearGradient colors={gradients.background} style={styles.root}>
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
        <Button label="Replay prologue" onPress={() => router.replace("/game/prologue")} />
        <Button label="Back to title" variant="ghost" onPress={() => router.replace("/")} />
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
    color: colors.amber,
    fontSize: 14,
    letterSpacing: 4,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
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
    color: colors.textFaint,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 24,
  },
  buttons: {
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
});
