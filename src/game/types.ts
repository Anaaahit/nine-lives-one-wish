export type SoulId = "human" | "cat";
export type BodyId = "catBody" | "humanBody";

export type ItemId = string;
export type FlagId = string;

export interface GameState {
  chapterId: string;
  roomId: string;
  souls: Record<BodyId, SoulId>;
  controlled: BodyId;
  inventory: ItemId[];
  flags: Record<FlagId, boolean>;
  cutsceneAt: number | null;
  prologueDone: boolean;
}

export interface Settings {
  sound: boolean;
}

export interface SaveData {
  game: GameState;
  settings: Settings;
}

export function createInitialState(): GameState {
  return {
    chapterId: "prologue",
    roomId: "apartment",
    souls: { catBody: "cat", humanBody: "human" },
    controlled: "humanBody",
    inventory: [],
    flags: {},
    cutsceneAt: null,
    prologueDone: false,
  };
}
