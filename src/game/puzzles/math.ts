export type Operator = "+" | "−" | "×";
export type BlankPosition = "a" | "b" | "result";

export type MathEquation = {
  a: number;
  b: number;
  op: Operator;
  result: number;
  blank: BlankPosition;
  answer: number;
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEquation(): MathEquation {
  const opRoll = Math.random();
  let a: number;
  let b: number;
  let op: Operator;
  let result: number;

  if (opRoll < 0.4) {
    op = "+";
    a = randInt(2, 16);
    b = randInt(2, 16);
    result = a + b;
  } else if (opRoll < 0.75) {
    op = "−";
    a = randInt(6, 20);
    b = randInt(1, a - 1);
    result = a - b;
  } else {
    op = "×";
    a = randInt(2, 9);
    b = randInt(2, 9);
    result = a * b;
  }

  const positions: BlankPosition[] = ["a", "b", "result"];
  const blank = positions[randInt(0, positions.length - 1)];
  const answer = blank === "a" ? a : blank === "b" ? b : result;

  return { a, b, op, result, blank, answer };
}

export function equationParts(eq: MathEquation): { left: string; op: string; right: string; equals: string } {
  return {
    left: eq.blank === "a" ? "?" : String(eq.a),
    op: eq.op,
    right: eq.blank === "b" ? "?" : String(eq.b),
    equals: eq.blank === "result" ? "?" : String(eq.result),
  };
}
