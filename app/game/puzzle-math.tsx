import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import PuzzleShell from "@/src/game/ui/PuzzleShell";
import { colors, radius } from "@/src/game/theme";
import { useGameStore } from "@/src/game/store";
import { saveGame } from "@/src/game/save";
import { equationParts, generateEquation, type MathEquation } from "@/src/game/puzzles/math";

const ROUNDS = 3;

export default function PuzzleMath() {
  const router = useRouter();
  const [equations] = useState<MathEquation[]>(() =>
    Array.from({ length: ROUNDS }, () => generateEquation())
  );
  const [round, setRound] = useState(0);
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);

  const onBack = () => router.replace("/game/act1");
  const eq = equations[round];
  const parts = equationParts(eq);

  const onDigit = (d: string) => {
    if (wrong) setWrong(false);
    setInput((s) => (s.length >= 3 ? s : s + d));
  };

  const onBackspace = () => setInput((s) => s.slice(0, -1));

  const onSubmit = () => {
    if (input === "") return;
    if (Number(input) === eq.answer) {
      setInput("");
      setWrong(false);
      if (round === ROUNDS - 1) {
        setSolved(true);
        useGameStore.getState().setFlag("puzzle_math_solved", true);
        const store = useGameStore.getState();
        saveGame({ game: store.game, settings: store.settings });
      } else {
        setRound((r) => r + 1);
      }
    } else {
      setWrong(true);
    }
  };

  return (
    <PuzzleShell
      title="The Grove's Reckoning"
      subtitle={`Trial ${round + 1} of ${ROUNDS} — find the missing number.`}
      onBack={onBack}
      solved={solved}
      onContinue={onBack}
    >
      <View style={styles.equationRow}>
        <Text style={styles.equationText}>{parts.left}</Text>
        <Text style={styles.equationOp}>{parts.op}</Text>
        <Text style={styles.equationText}>{parts.right}</Text>
        <Text style={styles.equationOp}>=</Text>
        <Text style={styles.equationText}>{parts.equals}</Text>
      </View>

      <View style={[styles.display, wrong && styles.displayWrong]}>
        <Text style={styles.displayText}>{input || " "}</Text>
      </View>
      {wrong ? <Text style={styles.wrongHint}>Not quite. Try again.</Text> : null}

      <View style={styles.keypad}>
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((k) => (
          <Pressable
            key={k}
            testID={`math-key-${k === "⌫" ? "back" : k === "OK" ? "ok" : k}`}
            style={[styles.key, k === "OK" && styles.keyOk]}
            onPress={() => (k === "⌫" ? onBackspace() : k === "OK" ? onSubmit() : onDigit(k))}
          >
            <Text style={[styles.keyText, k === "OK" && styles.keyOkText]}>{k}</Text>
          </Pressable>
        ))}
      </View>
    </PuzzleShell>
  );
}

const styles = StyleSheet.create({
  equationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  equationText: {
    color: colors.text,
    fontSize: 40,
    fontWeight: "700",
    minWidth: 52,
    textAlign: "center",
  },
  equationOp: {
    color: colors.amber,
    fontSize: 32,
  },
  display: {
    width: 160,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  displayWrong: {
    borderColor: colors.danger,
  },
  displayText: {
    color: colors.text,
    fontSize: 26,
  },
  wrongHint: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 12,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 3 * 60 + 2 * 10,
    gap: 10,
    justifyContent: "center",
    marginTop: 16,
  },
  key: {
    width: 60,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  keyOk: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  keyText: {
    color: colors.text,
    fontSize: 18,
  },
  keyOkText: {
    color: colors.bg,
    fontWeight: "700",
  },
});
