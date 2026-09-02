import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useGameStore } from "@/src/game/store";
import { saveGame } from "@/src/game/save";
import { useMusic } from "@/src/game/audio/music";
import { catArt, song } from "@/src/game/assets";
import { colors } from "@/src/game/theme";
import { Sparkles } from "@/src/game/ui/Atmosphere";
import GroveBackdrop from "@/src/game/act1/GroveBackdrop";
import GroveMarker from "@/src/game/act1/GroveMarker";

type Spot = { x: number; y: number };

const START: Spot = { x: 8, y: 68 };
const DOOR: Spot = { x: 90, y: 62 };

const MARKERS = [
  {
    key: "sudoku",
    flag: "puzzle_sudoku_solved",
    route: "/game/puzzle-sudoku",
    top: 38,
    left: 28,
    label: "I",
    caption: "Roots",
  },
  {
    key: "math",
    flag: "puzzle_math_solved",
    route: "/game/puzzle-math",
    top: 24,
    left: 52,
    label: "II",
    caption: "Reckoning",
  },
  {
    key: "jigsaw",
    flag: "puzzle_jigsaw_solved",
    route: "/game/puzzle-jigsaw",
    top: 15,
    left: 74,
    label: "III",
    caption: "Reflection",
  },
] as const;

export default function Act1() {
  const router = useRouter();
  const flags = useGameStore((s) => s.game.flags);
  const [doorMessage, setDoorMessage] = useState<string | null>(null);
  const introVisible = !flags.grove_intro_seen;

  const dismissIntro = () => {
    const store = useGameStore.getState();
    store.setFlag("grove_intro_seen", true);
    saveGame({ game: store.game, settings: store.settings });
  };

  useMusic(song, 0.4);

  const catX = useSharedValue(START.x);
  const catY = useSharedValue(START.y);

  const catStyle = useAnimatedStyle(() => ({
    left: `${catX.value}%`,
    top: `${catY.value}%`,
  }));

  const moveTo = (spot: Spot) => {
    catX.value = withTiming(spot.x, { duration: 550, easing: Easing.inOut(Easing.cubic) });
    catY.value = withTiming(spot.y, { duration: 550, easing: Easing.inOut(Easing.cubic) });
  };

  const onMarkerPress = (marker: (typeof MARKERS)[number]) => {
    moveTo({ x: marker.left, y: marker.top + 10 });
    setTimeout(() => router.push(marker.route), 480);
  };

  const solvedCount = MARKERS.filter((m) => flags[m.flag]).length;
  const allSolved = solvedCount === MARKERS.length;

  const onDoorPress = () => {
    moveTo(DOOR);
    if (!allSolved) {
      setDoorMessage("Locked. The grove wants all three trials first.");
      setTimeout(() => setDoorMessage(null), 2200);
      return;
    }
    const store = useGameStore.getState();
    store.setFlag("act1_complete", true);
    store.setChapter("act2");
    store.setRoom("act2_threshold");
    saveGame({ game: store.game, settings: store.settings });
    setTimeout(() => router.replace("/game/act2"), 500);
  };

  return (
    <View style={styles.root}>
      <GroveBackdrop />
      <Sparkles />

      <View style={styles.progress}>
        <Text testID="grove-progress" style={styles.progressText}>
          {solvedCount} / {MARKERS.length} trials
        </Text>
      </View>

      {MARKERS.map((m) => (
        <GroveMarker
          key={m.key}
          testID={`grove-marker-${m.key}`}
          top={`${m.top}%`}
          left={`${m.left}%`}
          label={m.label}
          caption={m.caption}
          solved={Boolean(flags[m.flag])}
          onPress={() => onMarkerPress(m)}
        />
      ))}

      <Pressable
        testID="grove-door"
        onPress={onDoorPress}
        style={[styles.door, { top: `${DOOR.y - 22}%`, left: `${DOOR.x - 5}%` }]}
        hitSlop={10}
      >
        <View style={[styles.doorShape, allSolved && styles.doorShapeUnlocked]} />
        <Text style={styles.doorLabel}>{allSolved ? "The door" : "the door"}</Text>
      </Pressable>

      <Animated.View style={[styles.cat, catStyle]}>
        <Image source={catArt} contentFit="contain" style={styles.catImage} />
      </Animated.View>

      {doorMessage ? (
        <View testID="grove-door-toast" style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{doorMessage}</Text>
        </View>
      ) : null}

      {introVisible ? (
        <Pressable testID="grove-intro" style={styles.introWrap} onPress={dismissIntro}>
          <View style={styles.introCard}>
            <Text style={styles.introText}>
              The hallway didn&rsquo;t lead outside. It led here — a grove that shouldn&rsquo;t
              exist, between him and wherever his own body just ran. Three old shapes bar the way
              forward.
            </Text>
            <Text style={styles.introHint}>Tap to begin</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const CAT_W = 70;
const CAT_H = CAT_W / (632 / 1018);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#12203a",
  },
  progress: {
    position: "absolute",
    top: 48,
    left: 20,
  },
  progressText: {
    color: colors.textDim,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  door: {
    position: "absolute",
    alignItems: "center",
    width: 70,
    marginLeft: -35,
  },
  doorShape: {
    width: 40,
    height: 64,
    borderRadius: 6,
    backgroundColor: "#1a1310",
    borderWidth: 2,
    borderColor: "#0d0a06",
  },
  doorShapeUnlocked: {
    borderColor: colors.amber,
    backgroundColor: "#2a2010",
  },
  doorLabel: {
    marginTop: 6,
    color: colors.textFaint,
    fontSize: 11,
    fontStyle: "italic",
  },
  cat: {
    position: "absolute",
    width: CAT_W,
    height: CAT_H,
    marginLeft: -CAT_W / 2,
    marginTop: -CAT_H,
  },
  catImage: {
    width: "100%",
    height: "100%",
  },
  toast: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  toastText: {
    backgroundColor: "rgba(8, 10, 20, 0.9)",
    color: colors.text,
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
  },
  introWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 12, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  introCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 28,
    maxWidth: 480,
  },
  introText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 14,
  },
  introHint: {
    color: colors.textFaint,
    fontSize: 12,
    textAlign: "right",
  },
});
