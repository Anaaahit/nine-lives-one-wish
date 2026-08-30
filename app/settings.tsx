import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGameStore } from "@/src/game/store";
import { clearSave, loadGame } from "@/src/game/save";
import { colors, gradients, radius, typography } from "@/src/game/theme";
import { Sparkles } from "@/src/game/ui/Atmosphere";

export default function Settings() {
  const router = useRouter();
  const sound = useGameStore((s) => s.settings.sound);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    loadGame().then((data) => setHasSave(Boolean(data?.game)));
  }, []);

  const onClearSave = async () => {
    await clearSave();
    setHasSave(false);
  };

  return (
    <LinearGradient colors={gradients.background} style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ back</Text>
        </Pressable>
        <Text style={styles.heading}>Settings</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sound</Text>
          <Pressable onPress={toggleSound}>
            <Text style={[styles.rowValue, sound ? styles.on : styles.off]}>
              {sound ? "on" : "off"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Saved game</Text>
          {hasSave ? (
            <Pressable onPress={onClearSave}>
              <Text style={[styles.rowValue, styles.danger]}>delete</Text>
            </Pressable>
          ) : (
            <Text style={[styles.rowValue, styles.off]}>none</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 68,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  back: {
    color: colors.textDim,
    fontSize: 16,
    marginBottom: 18,
  },
  heading: {
    ...typography.heading,
  },
  card: {
    marginHorizontal: 24,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceCard,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  divider: {
    height: 1,
    marginLeft: 20,
    backgroundColor: colors.divider,
  },
  rowLabel: {
    ...typography.body,
  },
  rowValue: {
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  on: {
    color: colors.success,
  },
  off: {
    color: colors.textFaint,
  },
  danger: {
    color: colors.danger,
  },
});
