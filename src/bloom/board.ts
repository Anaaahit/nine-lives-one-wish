export const COLOR_COUNT = 5;
export type DotColor = 0 | 1 | 2 | 3 | 4;

export type Dot = { id: number; color: DotColor };
// board[col][row], row 0 = bottom of the board, growing upward
export type Board = Dot[][];

export type Pos = { col: number; row: number };

let nextId = 1;

function freshDot(): Dot {
  return { id: nextId++, color: Math.floor(Math.random() * COLOR_COUNT) as DotColor };
}

export function createBoard(cols: number, rows: number): Board {
  return Array.from({ length: cols }, () => Array.from({ length: rows }, () => freshDot()));
}

export function isAdjacent(a: Pos, b: Pos): boolean {
  const dc = Math.abs(a.col - b.col);
  const dr = Math.abs(a.row - b.row);
  return (dc === 1 && dr === 0) || (dc === 0 && dr === 1);
}

export function samePos(a: Pos, b: Pos): boolean {
  return a.col === b.col && a.row === b.row;
}

export function colorAt(board: Board, pos: Pos): DotColor | null {
  const column = board[pos.col];
  const dot = column?.[pos.row];
  return dot ? dot.color : null;
}

export function inBounds(board: Board, pos: Pos): boolean {
  return pos.col >= 0 && pos.col < board.length && pos.row >= 0 && pos.row < (board[pos.col]?.length ?? 0);
}

export function applyClear(board: Board, positions: Pos[]): Board {
  const rows = board[0]?.length ?? 0;
  const toRemove = new Map<number, Set<number>>();
  for (const p of positions) {
    if (!toRemove.has(p.col)) toRemove.set(p.col, new Set());
    toRemove.get(p.col)!.add(p.row);
  }
  return board.map((column, c) => {
    const removeRows = toRemove.get(c);
    const kept = removeRows ? column.filter((_, r) => !removeRows.has(r)) : [...column];
    while (kept.length < rows) kept.push(freshDot());
    return kept;
  });
}

export function clearColor(board: Board, color: DotColor): { board: Board; count: number } {
  const positions: Pos[] = [];
  board.forEach((column, c) => {
    column.forEach((dot, r) => {
      if (dot.color === color) positions.push({ col: c, row: r });
    });
  });
  return { board: applyClear(board, positions), count: positions.length };
}
