export const colors = {
  bg: "#05060f",
  bgMid: "#0a1430",
  bgDeep: "#14203c",
  text: "#eef1fa",
  textDim: "rgba(238, 241, 250, 0.5)",
  textFaint: "rgba(238, 241, 250, 0.35)",
  surface: "#2a3348",
  surfaceGhost: "rgba(42, 51, 72, 0.4)",
  surfaceCard: "rgba(42, 51, 72, 0.5)",
  divider: "rgba(238, 241, 250, 0.08)",
  success: "#7fd4a2",
  danger: "#e07a7a",
  amber: "rgba(255, 217, 160, 0.8)",
} as const;

export const gradients = {
  background: [colors.bg, colors.bgMid, colors.bgDeep] as const,
  titleOverlay: ["rgba(5, 6, 15, 0.2)", "rgba(5, 6, 15, 0.85)"] as const,
};

export const typography = {
  kicker: {
    color: colors.textDim,
    fontSize: 14,
    fontStyle: "italic" as const,
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
};
