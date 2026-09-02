import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import PuzzleShell from "@/src/game/ui/PuzzleShell";
import { colors, radius } from "@/src/game/theme";
import { useGameStore } from "@/src/game/store";
import { saveGame } from "@/src/game/save";
import { catArt } from "@/src/game/assets";

const COLS = 3;
const ROWS = 3;
const CAT_RATIO = 632 / 1018;
const IMG_H = 390;
const IMG_W = IMG_H * CAT_RATIO;
const TILE_W = IMG_W / COLS;
const TILE_H = IMG_H / ROWS;

function shufflePieces(): number[] {
  const order = Array.from({ length: COLS * ROWS }, (_, i) => i);
  do {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, i) => v === i));
  return order;
}

function isSolved(order: number[]): boolean {
  return order.every((v, i) => v === i);
}

export default function PuzzleJigsaw() {
  const router = useRouter();
  const [order, setOrder] = useState<number[]>(() => shufflePieces());
  console.log("__TEST_JIGSAW_ORDER__", JSON.stringify(order));
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const onBack = () => router.replace("/game/act1");

  const onTapSlot = (slot: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(slot);
      return;
    }
    if (selected === slot) {
      setSelected(null);
      return;
    }
    const next = [...order];
    [next[selected], next[slot]] = [next[slot], next[selected]];
    setOrder(next);
    setSelected(null);
    if (isSolved(next)) {
      setSolved(true);
      useGameStore.getState().setFlag("puzzle_jigsaw_solved", true);
      const store = useGameStore.getState();
      saveGame({ game: store.game, settings: store.settings });
    }
  };

  const grid = useMemo(
    () =>
      Array.from({ length: ROWS }, (_, r) => order.slice(r * COLS, r * COLS + COLS)),
    [order]
  );

  return (
    <PuzzleShell
      title="The Grove's Reflection"
      subtitle="Tap two pieces to swap them. Rebuild what's yours."
      onBack={onBack}
      solved={solved}
      onContinue={onBack}
    >
      <View style={styles.board}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((piece, c) => {
              const slot = r * COLS + c;
              const srcRow = Math.floor(piece / COLS);
              const srcCol = piece % COLS;
              return (
                <Pressable
                  key={slot}
                  testID={`jigsaw-slot-${slot}`}
                  onPress={() => onTapSlot(slot)}
                  style={[styles.tile, selected === slot && styles.tileSelected]}
                >
                  <Image
                    source={catArt}
                    contentFit="cover"
                    style={{
                      position: "absolute",
                      width: IMG_W,
                      height: IMG_H,
                      left: -srcCol * TILE_W,
                      top: -srcRow * TILE_H,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.hint}>{selected === null ? "Pick a piece" : "Pick where it goes"}</Text>
    </PuzzleShell>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: "hidden",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    width: TILE_W,
    height: TILE_H,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "rgba(245, 240, 230, 0.15)",
  },
  tileSelected: {
    borderWidth: 2,
    borderColor: colors.amber,
  },
  hint: {
    color: colors.textDim,
    fontSize: 14,
  },
});
