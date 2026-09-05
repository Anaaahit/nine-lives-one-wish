import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeIn, LinearTransition, runOnJS, ZoomOut } from "react-native-reanimated";
import { useMusic } from "@/src/game/audio/music";
import { song } from "@/src/bloom/assets";
import { colors, DOT_PALETTE } from "@/src/bloom/theme";
import { loadBest, saveBest } from "@/src/bloom/save";
import {
  applyClear,
  clearColor,
  colorAt,
  createBoard,
  isAdjacent,
  samePos,
  type Board,
  type DotColor,
  type Pos,
} from "@/src/bloom/board";

const COLS = 7;
const ROWS = 5;

export default function Bloom() {
  const router = useRouter();
  const { width: ww, height: wh } = useWindowDimensions();

  useMusic(song, 0.4);

  const cell = Math.floor(Math.min((ww - 48) / COLS, (wh - 220) / ROWS, 92));
  const boardWidth = cell * COLS;
  const boardHeight = cell * ROWS;

  const [board, setBoard] = useState<Board>(() => createBoard(COLS, ROWS));
  const [trail, setTrail] = useState<Pos[]>([]);
  const [loopClosed, setLoopClosed] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  const boardRef = useRef(board);
  boardRef.current = board;
  const trailRef = useRef<Pos[]>([]);
  const loopRef = useRef(false);
  const scoreRef = useRef(0);

  useEffect(() => {
    loadBest().then(setBest);
  }, []);

  const bumpScore = (delta: number) => {
    const next = scoreRef.current + delta;
    scoreRef.current = next;
    setScore(next);
    setBest((prevBest) => {
      if (next > prevBest) {
        saveBest(next);
        return next;
      }
      return prevBest;
    });
  };

  const posFromXY = (x: number, y: number): Pos | null => {
    if (x < 0 || y < 0 || x >= boardWidth || y >= boardHeight) return null;
    const col = Math.floor(x / cell);
    const rowFromTop = Math.floor(y / cell);
    const row = ROWS - 1 - rowFromTop;
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    return { col, row };
  };

  const handleDragTo = (x: number, y: number) => {
    const pos = posFromXY(x, y);
    if (!pos) return;
    const current = trailRef.current;
    const board = boardRef.current;

    if (current.length === 0) {
      if (colorAt(board, pos) === null) return;
      trailRef.current = [pos];
      setTrail([pos]);
      return;
    }

    const last = current[current.length - 1];
    if (samePos(last, pos)) return;

    if (current.length >= 2 && samePos(current[current.length - 2], pos)) {
      const next = current.slice(0, -1);
      trailRef.current = next;
      setTrail(next);
      loopRef.current = false;
      setLoopClosed(false);
      return;
    }

    const trailColor = colorAt(board, current[0]);
    const posColor = colorAt(board, pos);
    if (posColor === null || posColor !== trailColor || !isAdjacent(last, pos)) return;

    if (current.some((p) => samePos(p, pos))) {
      loopRef.current = true;
      setLoopClosed(true);
      return;
    }

    const next = [...current, pos];
    trailRef.current = next;
    setTrail(next);
  };

  const handleDragEnd = () => {
    const current = trailRef.current;
    const isLoop = loopRef.current;
    const board = boardRef.current;

    if (isLoop && current.length > 0) {
      const color = colorAt(board, current[0]);
      if (color !== null) {
        const { board: nextBoard, count } = clearColor(board, color as DotColor);
        setBoard(nextBoard);
        bumpScore(count * 20);
      }
    } else if (current.length >= 2) {
      setBoard(applyClear(board, current));
      bumpScore(current.length * 10);
    }

    trailRef.current = [];
    loopRef.current = false;
    setTrail([]);
    setLoopClosed(false);
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(handleDragTo)(e.x, e.y);
    })
    .onUpdate((e) => {
      runOnJS(handleDragTo)(e.x, e.y);
    })
    .onFinalize(() => {
      runOnJS(handleDragEnd)();
    });

  const trailColor = trail.length > 0 ? colorAt(board, trail[0]) : null;
  const lineSegments = useMemo(() => {
    const segments: { key: string; left: number; top: number; length: number; angle: number }[] = [];
    for (let i = 0; i < trail.length - 1; i++) {
      const a = trail[i];
      const b = trail[i + 1];
      const ax = a.col * cell + cell / 2;
      const ay = (ROWS - 1 - a.row) * cell + cell / 2;
      const bx = b.col * cell + cell / 2;
      const by = (ROWS - 1 - b.row) * cell + cell / 2;
      const dx = bx - ax;
      const dy = by - ay;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      segments.push({ key: `${a.col}-${a.row}-${b.col}-${b.row}`, left: ax, top: ay, length, angle });
    }
    return segments;
  }, [trail, cell]);

  return (
    <LinearGradient colors={[colors.bgTop, colors.bgBottom]} style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>‹ back</Text>
        </Pressable>
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.best}>best {best}</Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <GestureDetector gesture={pan}>
          <View style={{ width: boardWidth, height: boardHeight }}>
            {board.map((column, c) =>
              column.map((dot, r) => {
                const inTrail = trail.some((p) => p.col === c && p.row === r);
                const inLoopPreview = loopClosed && trailColor !== null && dot.color === trailColor;
                const palette = DOT_PALETTE[dot.color];
                const highlighted = inTrail || inLoopPreview;
                return (
                  <Animated.View
                    key={dot.id}
                    layout={LinearTransition.duration(240)}
                    entering={FadeIn.duration(260)}
                    exiting={ZoomOut.duration(160)}
                    style={[
                      styles.dot,
                      {
                        left: c * cell,
                        top: (ROWS - 1 - r) * cell,
                        width: cell,
                        height: cell,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <View
                      testID={`bloom-dot-${c}-${r}`}
                      style={[
                        styles.dotInner,
                        {
                          width: cell * 0.62,
                          height: cell * 0.62,
                          borderRadius: cell,
                          backgroundColor: highlighted ? palette.glow : palette.base,
                        },
                        highlighted && styles.dotHighlighted,
                      ]}
                    />
                  </Animated.View>
                );
              })
            )}

            {lineSegments.map((seg) => (
              <View
                key={seg.key}
                pointerEvents="none"
                style={{
                  position: "absolute",
                  left: seg.left,
                  top: seg.top - 3,
                  width: seg.length,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: colors.trail,
                  transform: [{ rotate: `${seg.angle}deg` }],
                  transformOrigin: "0 3px",
                }}
              />
            ))}
          </View>
        </GestureDetector>
      </View>

      <Text style={styles.hint}>Connect matching colors. Loop back on your own trail to clear the whole board of that color.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  back: {
    color: colors.textDim,
    fontSize: 15,
  },
  scoreRow: {
    alignItems: "flex-end",
  },
  score: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  best: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 2,
  },
  boardWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  dotInner: {
    opacity: 0.95,
  },
  dotHighlighted: {
    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.6)",
  },
  hint: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
    paddingBottom: 24,
  },
});
