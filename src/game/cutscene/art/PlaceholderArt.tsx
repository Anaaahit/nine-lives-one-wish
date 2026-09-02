import type { ComponentType } from "react";
import { StyleSheet, View, type DimensionValue } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { catArt, manArt } from "../../assets";
import type { PanelArtId } from "../types";

const CAT_ART_RATIO = 632 / 1018;
const MAN_ART_RATIO = 676 / 1632;

function RealCat({ size = 60, top, left }: { size?: number; top: DimensionValue; left: DimensionValue }) {
  const height = size * 2.2;
  return (
    <Image
      source={catArt}
      contentFit="contain"
      style={{ position: "absolute", top, left, height, width: height * CAT_ART_RATIO }}
    />
  );
}

function RealMan({
  height = 150,
  top,
  bottom,
  left,
  opacity = 1,
}: {
  height?: number;
  top?: DimensionValue;
  bottom?: DimensionValue;
  left: DimensionValue;
  opacity?: number;
}) {
  return (
    <Image
      source={manArt}
      contentFit="contain"
      style={{ position: "absolute", top, bottom, left, height, width: height * MAN_ART_RATIO, opacity }}
    />
  );
}

const CAT_FUR = "#e2e4e7";
const CAT_TAN = "#c98a4b";
const MAN_SKIN = "#c9a884";
const MAN_HAIR = "#2b2d31";

function Moon({
  size = 40,
  top = "8%",
  left = "16%",
  glow = false,
}: {
  size?: number;
  top?: DimensionValue;
  left?: DimensionValue;
  glow?: boolean;
}) {
  const glowSize = size * 2.6;
  return (
    <View style={{ position: "absolute", top, left, width: size, height: size }}>
      {glow ? (
        <View
          style={{
            position: "absolute",
            top: (size - glowSize) / 2,
            left: (size - glowSize) / 2,
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: "rgba(230, 238, 255, 0.14)",
          }}
        />
      ) : null}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#e6eefd",
        }}
      />
    </View>
  );
}

function Building({
  left,
  bottom,
  width,
  height,
  color = "#0c1322",
  windows = [],
}: {
  left: DimensionValue;
  bottom: DimensionValue;
  width: DimensionValue;
  height: DimensionValue;
  color?: string;
  windows?: number[][];
}) {
  return (
    <View
      style={{
        position: "absolute",
        left,
        bottom,
        width,
        height,
        backgroundColor: color,
      }}
    >
      {windows.map(([x, y, w, h], i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: w,
            height: h,
            backgroundColor: "rgba(255, 214, 148, 0.55)",
          }}
        />
      ))}
    </View>
  );
}

function Window({ top, left, width, height }: { top: number; left: number; width: number; height: number }) {
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        backgroundColor: "#0b1526",
        borderWidth: 6,
        borderColor: "#1c2333",
        overflow: "hidden",
      }}
    >
      <Moon size={22} top={height * 0.08} left="58%" glow />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: height * 0.45,
          backgroundColor: "#080d1a",
        }}
      >
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: width * 0.4,
            height: height * 0.3,
            backgroundColor: "#0d1424",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: width * 0.42,
            width: width * 0.32,
            height: height * 0.2,
            backgroundColor: "#0d1424",
          }}
        />
      </View>
    </View>
  );
}

function Glow({
  size,
  top,
  left,
  color = "rgba(255, 184, 107, 0.12)",
}: {
  size: number;
  top: DimensionValue;
  left: DimensionValue;
  color?: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

function Stars() {
  const dots: [number, number, number, number][] = [
    [8, 14, 2, 0.6],
    [22, 7, 3, 0.8],
    [34, 18, 2, 0.4],
    [48, 9, 2, 0.7],
    [62, 15, 3, 0.5],
    [74, 6, 2, 0.8],
    [88, 12, 2, 0.6],
    [14, 28, 2, 0.4],
    [82, 24, 2, 0.5],
  ];
  return (
    <View style={StyleSheet.absoluteFillObject}>
      {dots.map(([left, top, size, opacity], i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: "#dfe8f7",
            opacity,
          }}
        />
      ))}
    </View>
  );
}

function CityNight() {
  return (
    <LinearGradient colors={["#05060f", "#0a1430", "#14203c"]} style={StyleSheet.absoluteFillObject}>
      <Stars />
      <Moon top="8%" left="16%" size={40} glow />
      <Building
        left="4%"
        bottom={0}
        width="26%"
        height="46%"
        windows={[
          [10, 14, 6, 8],
          [10, 26, 6, 8],
          [10, 38, 6, 8],
          [26, 22, 6, 8],
          [26, 40, 6, 8],
        ]}
      />
      <Building
        left="32%"
        bottom={0}
        width="30%"
        height="58%"
        windows={[
          [12, 16, 6, 8],
          [12, 30, 6, 8],
          [12, 46, 6, 8],
          [30, 20, 6, 8],
          [30, 34, 6, 8],
          [30, 52, 6, 8],
        ]}
      />
      <Building
        left="64%"
        bottom={0}
        width="24%"
        height="38%"
        windows={[
          [8, 18, 6, 8],
          [22, 32, 6, 8],
        ]}
      />
      <Building
        left="88%"
        bottom={0}
        width="16%"
        height="52%"
        windows={[
          [4, 20, 5, 7],
          [4, 34, 5, 7],
        ]}
      />
    </LinearGradient>
  );
}

function ApartmentEntrance() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#04040a", "#0a0914", "#05050c"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", bottom: "22%", left: 0, right: 0, height: 2, backgroundColor: "rgba(255,255,255,0.06)" }} />
      <View
        style={{
          position: "absolute",
          top: "18%",
          left: "30%",
          width: "40%",
          height: "64%",
          backgroundColor: "#241a12",
          borderWidth: 3,
          borderColor: "#120d08",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: "48%",
            left: "46%",
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: "#000",
            borderWidth: 1,
            borderColor: "#5a4632",
          }}
        />
      </View>
      <View style={{ position: "absolute", bottom: "21.4%", left: "42%", width: "16%", height: 3, backgroundColor: "#ffb86b", opacity: 0.9 }} />
    </View>
  );
}

function CatWaiting() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#0a0c16", "#12172a"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "32%", backgroundColor: "#14101f" }} />
      <Window top={40} left={30} width={150} height={128} />
      <Glow size={180} top="38%" left="52%" />
      <RealCat size={54} top="46%" left="42%" />
      <RealMan height={220} bottom={160} left={8} opacity={0.7} />
    </View>
  );
}

function Feeding() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#171006", "#221a10"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28%", backgroundColor: "#1a1410" }} />
      <View style={{ position: "absolute", bottom: "28%", left: 0, right: 0, height: "16%", backgroundColor: "#241a12" }} />
      <View
        style={{
          position: "absolute",
          bottom: "29.5%",
          left: "38%",
          width: "20%",
          height: "6%",
          borderRadius: 40,
          backgroundColor: "#2a2018",
        }}
      />
      <View style={{ position: "absolute", bottom: "31%", left: "42%", width: 4, height: 4, borderRadius: 2, backgroundColor: "#8a6a3a" }} />
      <View style={{ position: "absolute", bottom: "32%", left: "48%", width: 4, height: 4, borderRadius: 2, backgroundColor: "#8a6a3a" }} />
      <View style={{ position: "absolute", bottom: "31%", left: "52%", width: 4, height: 4, borderRadius: 2, backgroundColor: "#8a6a3a" }} />
      <RealCat size={40} top="46%" left="26%" />
      <RealMan height={180} bottom={160} left={64} opacity={0.7} />
      <Glow size={200} top="12%" left="30%" color="rgba(255, 190, 120, 0.16)" />
    </View>
  );
}

function Bedroom() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#060609", "#0a0a12"]} style={StyleSheet.absoluteFillObject} />
      <Window top={40} left={300} width={100} height={118} />
      <View
        style={{
          position: "absolute",
          bottom: "18%",
          left: "4%",
          width: "92%",
          height: "26%",
          backgroundColor: "#1d1c26",
          borderRadius: 14,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -14,
            left: "6%",
            width: "28%",
            height: 34,
            borderRadius: 12,
            backgroundColor: "#2a2836",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: "8%",
            width: "26%",
            height: "58%",
            backgroundColor: "#26242f",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: "2%",
              left: "28%",
              width: "46%",
              height: 34,
              borderRadius: 17,
              backgroundColor: MAN_SKIN,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "-4%",
              left: "20%",
              width: "64%",
              height: 22,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              backgroundColor: MAN_HAIR,
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: "16%",
            left: "42%",
            width: "30%",
            height: 16,
            borderRadius: 30,
            backgroundColor: CAT_FUR,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: "16%",
            left: "56%",
            width: 10,
            height: 8,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: CAT_TAN,
          }}
        />
      </View>
      <Glow size={120} top="22%" left="12%" color="rgba(230, 238, 255, 0.05)" />
    </View>
  );
}

function Morning() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#3a2f4a", "#8a5a5a", "#e0995f"]} style={StyleSheet.absoluteFillObject} />
      <Window top={30} left={40} width={130} height={110} />
      <RealCat size={40} top="58%" left="60%" />
      <RealMan height={220} bottom={135} left="30%" />
      <View
        style={{
          position: "absolute",
          bottom: "10%",
          left: "4%",
          width: "92%",
          height: "22%",
          backgroundColor: "#2a2438",
          borderRadius: 14,
        }}
      />
    </View>
  );
}

function Sun() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#ff9a5c", "#7a2d5e", "#2d1b4e"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "26%", backgroundColor: "#241338" }} />
      <View
        style={{
          position: "absolute",
          top: "18%",
          left: "18%",
          width: "64%",
          aspectRatio: 1,
          borderRadius: 9999,
          backgroundColor: "rgba(255, 220, 150, 0.12)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: "24%",
          left: "24%",
          width: "52%",
          aspectRatio: 1,
          borderRadius: 9999,
          backgroundColor: "rgba(255, 230, 170, 0.22)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: "31%",
          left: "31%",
          width: "38%",
          aspectRatio: 1,
          borderRadius: 9999,
          backgroundColor: "#fff3c4",
        }}
      />
      <RealCat size={44} top="64%" left="26%" />
      <RealMan height={190} bottom={170} left="50%" />
    </View>
  );
}

function Letter() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#0a0f1a", "#101a2e"]} style={StyleSheet.absoluteFillObject} />
      <Glow size={220} top="-8%" left="62%" color="rgba(255, 214, 148, 0.1)" />
      <View style={{ position: "absolute", bottom: "28%", left: 0, right: 0, height: "14%", backgroundColor: "#2a1f16" }} />
      <View
        style={{
          position: "absolute",
          bottom: "38%",
          left: "26%",
          width: "48%",
          height: "30%",
          backgroundColor: "#efe6d2",
          borderWidth: 1,
          borderColor: "#d8cdb4",
          transform: [{ rotate: "-3deg" }],
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            marginLeft: -60,
            width: 0,
            height: 0,
            borderLeftWidth: 60,
            borderRightWidth: 60,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomWidth: 36,
            borderBottomColor: "#d9cbaa",
          }}
        />
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              top: `${52 + i * 12}%`,
              left: "14%",
              width: `${i === 3 ? 38 : 72 - i * 6}%`,
              height: 3,
              borderRadius: 1.5,
              backgroundColor: "rgba(60, 48, 30, 0.35)",
            }}
          />
        ))}
        <View
          style={{
            position: "absolute",
            top: 4,
            left: "50%",
            marginLeft: -16,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#a02b2b",
            borderWidth: 2,
            borderColor: "#7a1f1f",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ width: 16, height: 2, backgroundColor: "#c96b6b" }} />
          <View style={{ position: "absolute", width: 2, height: 16, backgroundColor: "#c96b6b" }} />
        </View>
      </View>
    </View>
  );
}

function CatFloor() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#1c2038", "#262c4a"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", backgroundColor: "#20233c" }} />
      <Glow size={260} top="6%" left="30%" color="rgba(200, 210, 255, 0.08)" />
      <View
        style={{
          position: "absolute",
          top: "18%",
          left: "78%",
          width: "20%",
          height: "64%",
          backgroundColor: "#1d130c",
          borderWidth: 2,
          borderColor: "#0d0a06",
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, width: 6, height: "100%", backgroundColor: "rgba(255, 184, 107, 0.85)" }} />
      </View>
      <RealCat size={46} top="40%" left="40%" />
      <RealMan height={200} bottom={170} left="60%" />
      <View
        style={{
          position: "absolute",
          top: "44%",
          left: "62%",
          width: 8,
          height: "30%",
          backgroundColor: "#1a1410",
          transform: [{ rotate: "30deg" }],
        }}
      />
      <View
        style={{
          position: "absolute",
          top: "40%",
          left: "58%",
          width: 26,
          height: 10,
          borderRadius: 10,
          backgroundColor: "#241a12",
          transform: [{ rotate: "30deg" }],
        }}
      />
    </View>
  );
}

function DoorAjar() {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <LinearGradient colors={["#04060d", "#0a0c16"]} style={StyleSheet.absoluteFillObject} />
      <View
        style={{
          position: "absolute",
          top: "12%",
          left: "36%",
          width: "28%",
          height: "70%",
          backgroundColor: "#181009",
          borderWidth: 2,
          borderColor: "#0d0a06",
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, width: 8, height: "100%", backgroundColor: "rgba(255, 184, 107, 0.9)" }} />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: "16%",
          left: "32%",
          width: "36%",
          height: 10,
          backgroundColor: "rgba(255, 184, 107, 0.12)",
          borderRadius: 5,
        }}
      />
    </View>
  );
}

const SCENES: Record<PanelArtId, ComponentType> = {
  city_night: CityNight,
  apartment_entrance: ApartmentEntrance,
  cat_waiting: CatWaiting,
  feeding: Feeding,
  bedroom: Bedroom,
  morning: Morning,
  sun: Sun,
  letter: Letter,
  cat_floor: CatFloor,
  door_ajar: DoorAjar,
};

export default function PlaceholderArt({ id }: { id: PanelArtId }) {
  const Scene = SCENES[id] ?? CityNight;
  return <Scene />;
}
