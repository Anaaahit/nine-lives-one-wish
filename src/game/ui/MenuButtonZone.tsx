import { Pressable, StyleSheet, type DimensionValue } from "react-native";

type Props = {
  top: DimensionValue;
  onPress: () => void;
};

export default function MenuButtonZone({ top, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.zone, { top }, pressed && styles.pressed]}
      hitSlop={4}
    />
  );
}

const styles = StyleSheet.create({
  zone: {
    position: "absolute",
    left: "39%",
    width: "22%",
    height: "10%",
    borderRadius: 9999,
  },
  pressed: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
