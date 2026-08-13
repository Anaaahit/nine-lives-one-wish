import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGameStore } from "@/src/game/store";
import { clearSave, loadGame } from "@/src/game/save";

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
    <LinearGradient colors={["#05060f", "#0a1430", "#14203c"]} style={styles.root}>
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
    color: "rgba(238, 241, 250, 0.6)",
    fontSize: 16,
    marginBottom: 18,
  },
  heading: {
    color: "#eef1fa",
    fontSize: 28,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 16,
    backgroundColor: "rgba(42, 51, 72, 0.5)",
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
    backgroundColor: "rgba(238, 241, 250, 0.08)",
  },
  rowLabel: {
    color: "#eef1fa",
    fontSize: 17,
  },
  rowValue: {
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  on: {
    color: "#7fd4a2",
  },
  off: {
    color: "rgba(238, 241, 250, 0.4)",
  },
  danger: {
    color: "#e07a7a",
  },
});
