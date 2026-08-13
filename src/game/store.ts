import { create } from "zustand";
import type { BodyId, FlagId, GameState, ItemId, Settings } from "./types";
import { createInitialState } from "./types";

interface GameStore {
  game: GameState;
  settings: Settings;
  newGame: () => void;
  loadState: (game: GameState) => void;
  setControlled: (body: BodyId) => void;
  toggleControlled: () => void;
  setRoom: (roomId: string) => void;
  setChapter: (chapterId: string) => void;
  setCutsceneAt: (index: number | null) => void;
  addItem: (item: ItemId) => void;
  removeItem: (item: ItemId) => void;
  setFlag: (flag: FlagId, value?: boolean) => void;
  finishPrologue: () => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: createInitialState(),
  settings: { sound: true },

  newGame: () => set({ game: createInitialState() }),

  loadState: (game) => set({ game }),

  setControlled: (controlled) =>
    set((s) => ({ game: { ...s.game, controlled } })),

  toggleControlled: () =>
    set((s) => ({
      game: {
        ...s.game,
        controlled: s.game.controlled === "catBody" ? "humanBody" : "catBody",
      },
    })),

  setRoom: (roomId) => set((s) => ({ game: { ...s.game, roomId } })),

  setChapter: (chapterId) => set((s) => ({ game: { ...s.game, chapterId } })),

  setCutsceneAt: (cutsceneAt) => set((s) => ({ game: { ...s.game, cutsceneAt } })),

  addItem: (item) =>
    set((s) => ({ game: { ...s.game, inventory: [...s.game.inventory, item] } })),

  removeItem: (item) =>
    set((s) => ({
      game: {
        ...s.game,
        inventory: s.game.inventory.filter((i) => i !== item),
      },
    })),

  setFlag: (flag, value = true) =>
    set((s) => ({ game: { ...s.game, flags: { ...s.game.flags, [flag]: value } } })),

  finishPrologue: () =>
    set((s) => ({
      game: {
        ...s.game,
        chapterId: "act1",
        roomId: "apartment",
        souls: { catBody: "human", humanBody: "cat" },
        controlled: "catBody",
        cutsceneAt: null,
        prologueDone: true,
      },
    })),

  toggleSound: () =>
    set((s) => ({ settings: { ...s.settings, sound: !s.settings.sound } })),
}));
