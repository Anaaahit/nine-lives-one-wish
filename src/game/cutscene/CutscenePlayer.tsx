import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useGameStore } from "../store";
import { saveGame } from "../save";
import { playSound } from "../audio/sound";
import DialoguePanel from "./DialoguePanel";
import PlaceholderArt from "./art/PlaceholderArt";
import type { Cutscene, PanelArtId } from "./types";

const FADE_MS = 900;
const SHIMMER_COLORS = ["#ff2d2d", "#ffa400", "#46ff8c", "#3cc9ff", "#b45cff", "#ff5cd4", "#ffffff"];

function findLastPanelArt(script: Cutscene, upto: number): PanelArtId | null {
  for (let i = upto; i >= 0; i--) {
    const b = script[i];
    if (b && b.type === "panel") return b.art;
    if (b && b.type === "fade") return null;
  }
  return null;
}

type Props = {
  script: Cutscene;
  startAt?: number;
  onEvent?: (id: string) => void;
  onComplete: () => void;
  autosave?: boolean;
};

export default function CutscenePlayer({
  script,
  startAt = 0,
  onEvent,
  onComplete,
  autosave = true,
}: Props) {
  const [index, setIndex] = useState(startAt);
  const [overlayColor, setOverlayColor] = useState<"black" | "white" | "transparent">("transparent");
  const [shimmerActive, setShimmerActive] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [artId, setArtId] = useState<PanelArtId | null>(() => findLastPanelArt(script, startAt));

  const overlayOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const shimmerColor = useSharedValue("#ffffff");
  const shimmerOpacity = useSharedValue(0);

  const overlayColorRef = useRef<"black" | "white" | "transparent">("transparent");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const clearTimeouts = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeouts.current = timeouts.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeouts.current.push(id);
  }, []);

  const advance = useCallback(() => {
    setIndex((i) => (i >= script.length - 1 ? i : i + 1));
  }, [script.length]);

  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearTimeouts();
    setShimmerActive(false);
    onComplete();
  }, [clearTimeouts, onComplete]);

  useEffect(() => clearTimeouts, [clearTimeouts]);

  useEffect(() => {
    if (autosave) {
      const store = useGameStore.getState();
      store.setCutsceneAt(index);
      saveGame({ game: { ...store.game, cutsceneAt: index }, settings: store.settings });
    }
  }, [autosave, index]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(timer);
  }, [index]);

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: overlayColor === "transparent" ? "#000" : overlayColor,
    opacity: overlayOpacity.value,
  }));

  const artStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    backgroundColor: shimmerColor.value,
    opacity: shimmerOpacity.value,
  }));

  useEffect(() => {
    const b = script[index];
    if (!b) return;
    clearTimeouts();
    setShimmerActive(false);

    switch (b.type) {
      case "panel": {
        setArtId(b.art);
        const hold = b.hold ?? 3200;
        if (overlayColorRef.current !== "transparent") {
          overlayColorRef.current = "transparent";
          setOverlayColor("transparent");
          overlayOpacity.value = 1;
          overlayOpacity.value = withTiming(0, { duration: FADE_MS, easing: Easing.inOut(Easing.cubic) });
        }
        const zoom = b.zoom ?? "none";
        if (zoom === "in") {
          scale.value = 1;
          scale.value = withTiming(1.18, { duration: hold, easing: Easing.inOut(Easing.cubic) });
        } else if (zoom === "out") {
          scale.value = 1.18;
          scale.value = withTiming(1, { duration: hold, easing: Easing.inOut(Easing.cubic) });
        } else {
          scale.value = 1;
        }
        later(advance, hold);
        break;
      }
      case "text":
        break;
      case "fade": {
        overlayColorRef.current = b.to;
        setOverlayColor(b.to);
        overlayOpacity.value = withTiming(1, {
          duration: b.duration ?? FADE_MS,
          easing: Easing.inOut(Easing.cubic),
        });
        later(advance, b.duration ?? FADE_MS);
        break;
      }
      case "sound":
        playSound(b.sfx);
        advance();
        break;
      case "wait":
        later(advance, b.duration);
        break;
      case "shimmer": {
        const dur = b.duration ?? 2600;
        const step = dur / SHIMMER_COLORS.length;
        shimmerColor.value = withSequence(...SHIMMER_COLORS.map((c) => withTiming(c, { duration: step })));
        shimmerOpacity.value = withRepeat(
          withSequence(withTiming(0.45, { duration: 700 }), withTiming(0.9, { duration: 700 })),
          -1,
          true,
        );
        setShimmerActive(true);
        later(() => {
          setShimmerActive(false);
          advance();
        }, dur);
        break;
      }
      case "event":
        onEventRef.current?.(b.id);
        advance();
        break;
    }
  }, [
    index,
    script,
    clearTimeouts,
    later,
    advance,
    overlayOpacity,
    scale,
    shimmerColor,
    shimmerOpacity,
  ]);

  const beat = script[index];
  const progress = Math.round(((index + 1) / script.length) * 100);

  return (
    <View style={styles.root}>
      <View style={styles.artFrame}>
        <Animated.View style={[StyleSheet.absoluteFillObject, artStyle]}>
          {artId ? <PlaceholderArt id={artId} /> : null}
        </Animated.View>
      </View>

      {shimmerActive ? (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, shimmerStyle]}
        />
      ) : null}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, overlayStyle]} />

      {beat && beat.type === "panel" ? (
        <Pressable style={StyleSheet.absoluteFill} onPress={advance} />
      ) : null}

      {beat && beat.type === "panel" && beat.sub ? (
        <View style={styles.sub} pointerEvents="none">
          <Text style={styles.subText}>{beat.sub}</Text>
        </View>
      ) : null}

      {beat && beat.type === "text" ? (
        <DialoguePanel key={index} speaker={beat.speaker} lines={beat.lines} onDone={advance} />
      ) : null}

      <View style={styles.progress} pointerEvents="none">
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {showSkip ? (
        <Pressable style={styles.skip} onPress={complete}>
          <Text style={styles.skipText}>skip</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  artFrame: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  sub: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  subText: {
    color: "rgba(238, 241, 250, 0.85)",
    fontSize: 15,
    fontStyle: "italic",
    textAlign: "center",
  },
  progress: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  progressFill: {
    height: 3,
    backgroundColor: "rgba(255, 217, 160, 0.7)",
  },
  skip: {
    position: "absolute",
    top: 14,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  skipText: {
    color: "rgba(238, 241, 250, 0.7)",
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
