import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMusic } from "@/src/game/audio/music";
import { song } from "@/src/game/assets";
import { colors, gradients } from "@/src/game/theme";
import Button from "@/src/game/ui/Button";
import { Sparkles } from "@/src/game/ui/Atmosphere";

export default function Act2() {
  const router = useRouter();
  useMusic(song, 0.45);

  return (
    <LinearGradient colors={gradients.background} style={styles.root}>
      <Sparkles />

      <View style={styles.body}>
        <Text style={styles.kicker}>ACT TWO</Text>
        <Text style={styles.title}>The Door</Text>
        <Text style={styles.hook}>
          It opens onto somewhere else entirely. Whatever&rsquo;s through there is the next
          milestone.
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button label="Replay the grove" onPress={() => router.replace("/game/act1")} />
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
    color: colors.textDim,
    fontSize: 17,
    lineHeight: 26,
  },
  buttons: {
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
});
