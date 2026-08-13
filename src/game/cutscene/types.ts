export type PanelArtId =
  | "city_night"
  | "apartment_entrance"
  | "cat_waiting"
  | "feeding"
  | "bedroom"
  | "morning"
  | "sun"
  | "letter"
  | "cat_floor"
  | "door_ajar";

export type CutsceneBeat =
  | { type: "panel"; art: PanelArtId; zoom?: "none" | "in" | "out"; hold?: number; sub?: string }
  | { type: "text"; speaker?: string; lines: string[] }
  | { type: "fade"; to: "black" | "white"; duration?: number }
  | { type: "sound"; sfx: string }
  | { type: "wait"; duration: number }
  | { type: "shimmer"; duration?: number }
  | { type: "event"; id: string };

export type Cutscene = CutsceneBeat[];
