import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import PuzzleShell from "@/src/game/ui/PuzzleShell";
import { colors, radius } from "@/src/game/theme";
import { useGameStore } from "@/src/game/store";
import { saveGame } from "@/src/game/save";
import {
  SIZE,
  findConflicts,
  generatePuzzle,
  isComplete,
  type Grid,
} from "@/src/game/puzzles/sudoku";

export default function PuzzleSudoku() {
  const router = useRouter();
  const puzzle = useMemo(() => generatePuzzle(9), []);
  const [grid, setGrid] = useState<Grid>(() => puzzle.givens.map((row) => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [solved, setSolved] = useState(false);

  const conflicts = useMemo(() => findConflicts(grid), [grid]);

  const onBack = () => router.replace("/game/act1");

  const onPick = (value: number) => {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (puzzle.givens[r][c] !== 0) return;
    const next = grid.map((row) => [...row]);
    next[r][c] = value;
    setGrid(next);
    if (isComplete(next)) {
      setSolved(true);
      useGameStore.getState().setFlag("puzzle_sudoku_solved", true);
      const store = useGameStore.getState();
      saveGame({ game: store.game, settings: store.settings });
    }
  };

  return (
    <PuzzleShell
      title="The Roots Puzzle"
      subtitle="Every row, column, and 2×2 patch holds 1–4, once each."
      onBack={onBack}
      solved={solved}
      onContinue={onBack}
    >
      <View style={styles.board}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((value, c) => {
              const isGiven = puzzle.givens[r][c] !== 0;
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const hasConflict = conflicts.has(`${r},${c}`);
              return (
                <Pressable
                  key={c}
                  testID={`sudoku-cell-${r}-${c}`}
                  onPress={() => !isGiven && setSelected([r, c])}
                  style={[
                    styles.cell,
                    (c === SIZE / 2 - 1 ? styles.boxRight : null) as object,
                    (r === SIZE / 2 - 1 ? styles.boxBottom : null) as object,
                    isSelected && styles.cellSelected,
                    hasConflict && styles.cellConflict,
                  ]}
                >
                  <Text style={[styles.cellText, isGiven && styles.cellTextGiven]}>
                    {value === 0 ? "" : value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.palette}>
        {[1, 2, 3, 4].map((n) => (
          <Pressable key={n} testID={`sudoku-key-${n}`} style={styles.paletteKey} onPress={() => onPick(n)}>
            <Text style={styles.paletteKeyText}>{n}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.paletteKey} onPress={() => onPick(0)}>
          <Text style={styles.paletteKeyText}>×</Text>
        </Pressable>
      </View>
    </PuzzleShell>
  );
}

const CELL = 62;

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginBottom: 28,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL,
    height: CELL,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "rgba(245, 240, 230, 0.12)",
    backgroundColor: "rgba(245, 240, 230, 0.03)",
  },
  boxRight: {
    borderRightWidth: 2,
    borderRightColor: colors.border,
  },
  boxBottom: {
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  cellSelected: {
    backgroundColor: "rgba(217, 183, 121, 0.22)",
  },
  cellConflict: {
    backgroundColor: "rgba(224, 122, 122, 0.28)",
  },
  cellText: {
    color: colors.amber,
    fontSize: 26,
    fontWeight: "600",
  },
  cellTextGiven: {
    color: colors.text,
  },
  palette: {
    flexDirection: "row",
    gap: 12,
  },
  paletteKey: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteKeyText: {
    color: colors.text,
    fontSize: 20,
  },
});
