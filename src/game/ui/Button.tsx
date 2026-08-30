import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, spacing } from "@/src/game/theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  dim?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ label, onPress, variant = "solid", dim = false, style }: Props) {
  return (
    <Pressable
      style={[styles.button, variant === "ghost" && styles.ghost, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, dim && styles.textDim]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  ghost: {
    backgroundColor: colors.surfaceGhost,
  },
  text: {
    color: colors.text,
    fontSize: 17,
    letterSpacing: 0.5,
  },
  textDim: {
    color: colors.textFaint,
  },
});
