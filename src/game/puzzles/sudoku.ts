export const SIZE = 4;
const BOX = 2;

export type Grid = number[][]; // 0 = empty

function shuffledDigits(): number[] {
  const digits = [1, 2, 3, 4];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits;
}

function baseGrid(): Grid {
  const grid: Grid = [];
  for (let r = 0; r < SIZE; r++) {
    const row: number[] = [];
    for (let c = 0; c < SIZE; c++) {
      row.push((BOX * (r % BOX) + Math.floor(r / BOX) + c) % SIZE);
    }
    grid.push(row);
  }
  return grid;
}

function swapRows(grid: Grid, a: number, b: number) {
  [grid[a], grid[b]] = [grid[b], grid[a]];
}

function swapCols(grid: Grid, a: number, b: number) {
  for (const row of grid) [row[a], row[b]] = [row[b], row[a]];
}

function transpose(grid: Grid): Grid {
  return grid[0].map((_, c) => grid.map((row) => row[c]));
}

export function generateSolvedGrid(): Grid {
  let grid = baseGrid();

  // swap the two rows inside each band, and swap the two bands
  if (Math.random() < 0.5) swapRows(grid, 0, 1);
  if (Math.random() < 0.5) swapRows(grid, 2, 3);
  if (Math.random() < 0.5) {
    const band0 = [grid[0], grid[1]];
    const band1 = [grid[2], grid[3]];
    grid = [...band1, ...band0];
  }

  // same for columns
  if (Math.random() < 0.5) swapCols(grid, 0, 1);
  if (Math.random() < 0.5) swapCols(grid, 2, 3);
  if (Math.random() < 0.5) {
    for (const row of grid) {
      const stack0 = [row[0], row[1]];
      const stack1 = [row[2], row[3]];
      row.splice(0, 4, ...stack1, ...stack0);
    }
  }

  if (Math.random() < 0.5) grid = transpose(grid);

  const digits = shuffledDigits();
  return grid.map((row) => row.map((v) => digits[v]));
}

export type SudokuPuzzle = {
  solution: Grid;
  givens: Grid; // 0 = blank cell the player must fill
};

export function generatePuzzle(clueCount = 9): SudokuPuzzle {
  const solution = generateSolvedGrid();
  const givens = solution.map((row) => [...row]);
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) cells.push([r, c]);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const blanksNeeded = SIZE * SIZE - clueCount;
  for (let i = 0; i < blanksNeeded; i++) {
    const [r, c] = cells[i];
    givens[r][c] = 0;
  }
  return { solution, givens };
}

export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  const markDupes = (cells: [number, number][]) => {
    const seen = new Map<number, [number, number][]>();
    for (const [r, c] of cells) {
      const v = grid[r][c];
      if (v === 0) continue;
      const list = seen.get(v) ?? [];
      list.push([r, c]);
      seen.set(v, list);
    }
    for (const list of seen.values()) {
      if (list.length > 1) for (const [r, c] of list) conflicts.add(`${r},${c}`);
    }
  };

  for (let r = 0; r < SIZE; r++) markDupes(Array.from({ length: SIZE }, (_, c) => [r, c]));
  for (let c = 0; c < SIZE; c++) markDupes(Array.from({ length: SIZE }, (_, r) => [r, c]));
  for (let br = 0; br < SIZE; br += BOX) {
    for (let bc = 0; bc < SIZE; bc += BOX) {
      const cells: [number, number][] = [];
      for (let r = br; r < br + BOX; r++) for (let c = bc; c < bc + BOX; c++) cells.push([r, c]);
      markDupes(cells);
    }
  }

  return conflicts;
}

export function isComplete(grid: Grid): boolean {
  return grid.every((row) => row.every((v) => v !== 0)) && findConflicts(grid).size === 0;
}
