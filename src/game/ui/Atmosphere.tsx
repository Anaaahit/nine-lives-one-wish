import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Dot = { left: number; top: number; size: number; delay: number; duration: number; max: number };

const DOTS: Dot[] = [
  { left: 8, top: 6, size: 2, delay: 0, duration: 2600, max: 0.9 },
  { left: 18, top: 14, size: 3, delay: 400, duration: 3200, max: 0.7 },
  { left: 30, top: 5, size: 2, delay: 900, duration: 2800, max: 0.85 },
  { left: 45, top: 10, size: 2, delay: 1300, duration: 3000, max: 0.6 },
  { left: 55, top: 4, size: 3, delay: 200, duration: 2400, max: 0.9 },
  { left: 66, top: 12, size: 2, delay: 1600, duration: 3400, max: 0.7 },
  { left: 78, top: 7, size: 2, delay: 700, duration: 2900, max: 0.8 },
  { left: 88, top: 15, size: 3, delay: 1100, duration: 3100, max: 0.65 },
  { left: 12, top: 24, size: 2, delay: 1900, duration: 2700, max: 0.6 },
  { left: 60, top: 22, size: 2, delay: 500, duration: 3300, max: 0.55 },
];

function Sparkle({ dot }: { dot: Dot }) {
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    opacity.value = withDelay(
      dot.delay,
      withRepeat(
        withSequence(
          withTiming(dot.max, { duration: dot.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.15, { duration: dot.duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [dot, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        {
          left: `${dot.left}%`,
          top: `${dot.top}%`,
          width: dot.size,
          height: dot.size,
          borderRadius: dot.size / 2,
        },
      ]}
    />
  );
}

function Glow() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 4200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse]);

  const outerStyle = useAnimatedStyle(() => ({ opacity: 0.05 + pulse.value * 0.05 }));
  const midStyle = useAnimatedStyle(() => ({ opacity: 0.08 + pulse.value * 0.07 }));
  const innerStyle = useAnimatedStyle(() => ({ opacity: 0.1 + pulse.value * 0.09 }));

  return (
    <View style={styles.glowWrap} pointerEvents="none">
      <Animated.View style={[styles.glowOuter, outerStyle]} />
      <Animated.View style={[styles.glowMid, midStyle]} />
      <Animated.View style={[styles.glowInner, innerStyle]} />
    </View>
  );
}

export function Sparkles() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {DOTS.map((dot, i) => (
        <Sparkle key={i} dot={dot} />
      ))}
    </View>
  );
}

export default function Atmosphere() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Glow />
      <Sparkles />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    backgroundColor: "#fff8e6",
  },
  glowWrap: {
    position: "absolute",
    top: "-8%",
    left: "36%",
    width: "28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowOuter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#fff3d6",
  },
  glowMid: {
    position: "absolute",
    width: "68%",
    height: "68%",
    borderRadius: 9999,
    backgroundColor: "#fff3d6",
  },
  glowInner: {
    position: "absolute",
    width: "38%",
    height: "38%",
    borderRadius: 9999,
    backgroundColor: "#fffaf0",
  },
});
