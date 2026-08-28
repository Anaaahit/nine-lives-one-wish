import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "../store";
import { saveGame } from "../save";
import { playSound } from "../audio/sound";
import DialoguePanel from "./DialoguePanel";
import PlaceholderArt from "./art/PlaceholderArt";
import type { Cutscene, PanelArtId } from "./types";

const FADE_MS = 900;
const SHIMMER_COLORS = ["#ff2d2d", "#ffa400", "#46ff8c", "#3cc9ff", "#b45cff", "#ff5cd4", "#ffffff"];

function findLastPanel(script: Cutscene, upto: number): PanelArt | null {
  for (let i = upto; i >= 0; i--) {
    const b = script[i];
    if (b && b.type === "panel") return { art: b.art, image: b.image };
    if (b && b.type === "fade") return null;
  }
  return null;
}

type PanelArt = { art: PanelArtId; image?: number };

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
  const [shimmerColorIndex, setShimmerColorIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [panelArt, setPanelArt] = useState<PanelArt | null>(() => findLastPanel(script, startAt));

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shimmerOpacity = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const b = script[index];
    if (!b) return;
    clearTimeouts();
    setShimmerActive(false);
    shimmerOpacity.stopAnimation();
    shimmerOpacity.setValue(0);

    switch (b.type) {
      case "panel": {
        setPanelArt({ art: b.art, image: b.image });
        const hold = b.hold ?? 3200;
        if (overlayColorRef.current !== "transparent") {
          overlayColorRef.current = "transparent";
          setOverlayColor("transparent");
          overlayOpacity.setValue(1);
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: FADE_MS,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
        const zoom = b.zoom ?? "none";
        scale.stopAnimation();
        if (zoom === "in") {
          scale.setValue(1);
          Animated.timing(scale, { toValue: 1.18, duration: hold, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start();
        } else if (zoom === "out") {
          scale.setValue(1.18);
          Animated.timing(scale, { toValue: 1, duration: hold, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }).start();
        } else {
          scale.setValue(1);
        }
        later(advance, hold);
        break;
      }
      case "text":
        break;
      case "fade": {
        overlayColorRef.current = b.to;
        setOverlayColor(b.to);
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: b.duration ?? FADE_MS,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start();
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
        setShimmerColorIndex(0);
        setShimmerActive(true);
        shimmerOpacity.setValue(1);
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerOpacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
            Animated.timing(shimmerOpacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
          ]),
        ).start();
        const colorInterval = setInterval(
          () => setShimmerColorIndex((c) => (c + 1) % SHIMMER_COLORS.length),
          step,
        );
        timeouts.current.push(colorInterval as unknown as ReturnType<typeof setTimeout>);
        later(() => {
          clearInterval(colorInterval);
          setShimmerActive(false);
          shimmerOpacity.stopAnimation();
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
    shimmerOpacity,
  ]);

  const beat = script[index];
  const progress = Math.round(((index + 1) / script.length) * 100);
  const shimmerColor = SHIMMER_COLORS[shimmerColorIndex] ?? "#ffffff";

  return (
    <View style={styles.root}>
      <View style={styles.artFrame}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ scale }] }]}>
          {panelArt ? (
            panelArt.image ? (
              <Image source={panelArt.image} style={styles.panelImage} resizeMode="contain" />
            ) : (
              <PlaceholderArt id={panelArt.art} />
            )
          ) : null}
        </Animated.View>
      </View>

      {shimmerActive ? (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: shimmerColor, opacity: shimmerOpacity }]}
        />
      ) : null}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { backgroundColor: overlayColor === "transparent" ? "#000" : overlayColor, opacity: overlayOpacity }]}
      />

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
  panelImage: {
    ...StyleSheet.absoluteFillObject,
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
