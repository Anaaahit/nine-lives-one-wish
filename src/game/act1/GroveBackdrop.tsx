import { StyleSheet, View, type DimensionValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function Canopy({
  size,
  top,
  left,
  color,
}: {
  size: number;
  top: DimensionValue;
  left: DimensionValue;
  color: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size * 0.7,
        borderRadius: size,
        backgroundColor: color,
      }}
    />
  );
}

export default function GroveBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={["#12203a", "#1c2f3f", "#233326"]} style={StyleSheet.absoluteFill} />

      <View style={styles.moon} />
      <View style={styles.moonGlow} />

      <Canopy size={420} top="-8%" left="-6%" color="rgba(8, 20, 18, 0.55)" />
      <Canopy size={360} top="2%" left="18%" color="rgba(10, 26, 20, 0.45)" />
      <Canopy size={460} top="-10%" left="46%" color="rgba(8, 22, 18, 0.5)" />
      <Canopy size={340} top="4%" left="74%" color="rgba(10, 26, 20, 0.4)" />
      <Canopy size={300} top="-4%" left="86%" color="rgba(8, 20, 18, 0.5)" />

      <LinearGradient
        colors={["transparent", "rgba(6, 12, 10, 0.9)"]}
        style={styles.groundFade}
      />
      <View style={styles.ground} />
    </View>
  );
}

const styles = StyleSheet.create({
  moon: {
    position: "absolute",
    top: "10%",
    right: "12%",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eef1e0",
  },
  moonGlow: {
    position: "absolute",
    top: "6%",
    right: "8%",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(238, 241, 224, 0.12)",
  },
  groundFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "22%",
    height: "20%",
  },
  ground: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "22%",
    backgroundColor: "#171f16",
  },
});
