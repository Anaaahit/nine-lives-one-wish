import { Pressable, StyleSheet, type DimensionValue } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
  top: DimensionValue;
  onPress: () => void;
};

export default function MenuButtonZone({ top, onPress }: Props) {
  const scale = useSharedValue(1);
  const highlight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: highlight.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.96, { duration: 100 });
        highlight.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
        highlight.value = withTiming(0, { duration: 150 });
      }}
      style={[styles.wrapper, { top }]}
      hitSlop={4}
    >
      <Animated.View style={[styles.zone, animatedStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: "39%",
    width: "22%",
    height: "10%",
  },
  zone: {
    flex: 1,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
});
