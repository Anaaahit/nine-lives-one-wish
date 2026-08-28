import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";

const TICK_MS = 26;

type Props = {
  speaker?: string;
  lines: string[];
  onDone: () => void;
};

export default function DialoguePanel({ speaker, lines, onDone }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const line = lines[lineIndex] ?? "";
  const fullyTyped = chars >= line.length;

  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(30);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  }, [lineIndex, opacity, translateY]);

  useEffect(() => {
    if (fullyTyped) return;
    const interval = setInterval(() => {
      setChars((c) => {
        if (c >= line.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [line, fullyTyped]);

  const onPress = () => {
    if (!fullyTyped) {
      setChars(line.length);
      return;
    }
    if (lineIndex < lines.length - 1) {
      setLineIndex(lineIndex + 1);
      setChars(0);
    } else {
      onDone();
    }
  };

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress}>
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateY }], opacity },
        ]}
      >
        {speaker ? <Text style={styles.speaker}>{speaker}</Text> : null}
        <Text style={styles.line}>{line.slice(0, chars)}</Text>
        <Text style={styles.hint}>{fullyTyped && lineIndex === lines.length - 1 ? "tap to continue" : ""}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 24,
    minHeight: 110,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderRadius: 14,
    backgroundColor: "rgba(8, 10, 20, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  speaker: {
    position: "absolute",
    top: -11,
    left: 18,
    color: "#ffd9a0",
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    backgroundColor: "rgba(8, 10, 20, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  line: {
    color: "#eef1fa",
    fontSize: 18,
    lineHeight: 26,
    fontStyle: "italic",
  },
  hint: {
    marginTop: 10,
    color: "rgba(238, 241, 250, 0.4)",
    fontSize: 12,
    textAlign: "right",
    letterSpacing: 0.5,
  },
});
