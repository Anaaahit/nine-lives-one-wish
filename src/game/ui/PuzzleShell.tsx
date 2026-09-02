import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Sparkles } from "@/src/game/ui/Atmosphere";
import { colors, gradients, typography } from "@/src/game/theme";
import Button from "@/src/game/ui/Button";

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
  solved?: boolean;
  onContinue?: () => void;
};

export default function PuzzleShell({ title, subtitle, onBack, children, solved = false, onContinue }: Props) {
  return (
    <LinearGradient colors={gradients.background} style={styles.root}>
      <Sparkles />

      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ back to the grove</Text>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.content}>{children}</View>

      {solved ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.solvedOverlay}>
          <View style={styles.solvedCard}>
            <Text style={styles.solvedTitle}>Solved</Text>
            <Text style={styles.solvedBody}>The trial accepts you.</Text>
            <Button label="Continue" onPress={onContinue ?? onBack} style={styles.solvedButton} />
          </View>
        </Animated.View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  back: {
    color: colors.textDim,
    fontSize: 15,
    marginBottom: 14,
  },
  title: {
    ...typography.heading,
    fontSize: 24,
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  solvedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 9, 20, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  solvedCard: {
    width: "76%",
    maxWidth: 360,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  solvedTitle: {
    ...typography.heading,
    fontSize: 26,
    marginBottom: 8,
  },
  solvedBody: {
    color: colors.textDim,
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  solvedButton: {
    width: "100%",
    marginBottom: 0,
  },
});
