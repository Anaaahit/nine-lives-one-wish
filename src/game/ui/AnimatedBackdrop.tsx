import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Image, type ImageSource } from "expo-image";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  source: ImageSource | number;
};

export default function AnimatedBackdrop({ source }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 16000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1.08, 1.16]) },
      { translateX: interpolate(progress.value, [0, 1], [-10, 10]) },
    ],
  }));

  return (
    <AnimatedImage
      source={source}
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
      contentFit="cover"
      blurRadius={60}
    />
  );
}
