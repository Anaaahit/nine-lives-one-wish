import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, type DimensionValue } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/src/game/theme";

type Props = {
  top: DimensionValue;
  left: DimensionValue;
  label: string;
  caption: string;
  solved: boolean;
  onPress: () => void;
  testID?: string;
};

export default function GroveMarker({ top, left, label, caption, solved, onPress, testID }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (solved) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [pulse, solved]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: solved ? 0.25 : 0.25 + pulse.value * 0.35,
    transform: [{ scale: 1 + (solved ? 0 : pulse.value * 0.12) }],
  }));

  return (
    <Pressable testID={testID} onPress={onPress} style={[styles.wrap, { top, left }]} hitSlop={10}>
      <Animated.View style={[styles.glow, solved && styles.glowSolved, glowStyle]} />
      <View style={[styles.rune, solved && styles.runeSolved]}>
        <Text style={styles.runeText}>{solved ? "✓" : label}</Text>
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignItems: "center",
    width: 90,
    marginLeft: -45,
  },
  glow: {
    position: "absolute",
    top: -10,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(217, 183, 121, 0.5)",
  },
  glowSolved: {
    backgroundColor: "rgba(127, 212, 162, 0.5)",
  },
  rune: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  runeSolved: {
    borderColor: colors.success,
  },
  runeText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  caption: {
    marginTop: 6,
    color: colors.textDim,
    fontSize: 12,
    textAlign: "center",
  },
});
