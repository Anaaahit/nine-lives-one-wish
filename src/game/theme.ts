// Palette sampled directly from assets/game/ninelivesonewish.png so every
// screen reads as part of the same painted night sky as the title art.
export const colors = {
  bg: "#1c1b34",
  bgMid: "#2d2c52",
  bgDeep: "#37355d",
  text: "#f5f0e6",
  textDim: "rgba(245, 240, 230, 0.55)",
  textFaint: "rgba(245, 240, 230, 0.35)",
  surface: "#28254a",
  surfaceGhost: "rgba(40, 37, 74, 0.4)",
  surfaceCard: "rgba(40, 37, 74, 0.55)",
  border: "rgba(217, 183, 121, 0.5)",
  divider: "rgba(245, 240, 230, 0.08)",
  success: "#7fd4a2",
  danger: "#e07a7a",
  amber: "#d9b779",
} as const;

export const gradients = {
  background: [colors.bgDeep, colors.bgMid, colors.bg] as const,
  titleOverlay: ["rgba(28, 27, 52, 0.15)", "rgba(28, 27, 52, 0.85)"] as const,
};

export const typography = {
  kicker: {
    color: colors.amber,
    fontSize: 14,
    letterSpacing: 3,
    lineHeight: 22,
  },
  title: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
  heading: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700" as const,
  },
  body: {
    color: colors.text,
    fontSize: 17,
  },
};

export const spacing = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 28,
};

export const radius = {
  sm: 12,
  md: 16,
  pill: 9999,
};
