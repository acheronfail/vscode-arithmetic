import { TextEditor } from "vscode";

export function tryEval(expr: string) {
  try {
    return eval(expr);
  } catch (_) {
    return 0;
  }
}

export function evalExpr(s: string, i: number, expression: string): string {
  // This is used by `eval` and thus is actually used.
  const x = tryEval(s);
  const result = eval(expression);
  if (result === undefined || result === null) {
    throw new Error("No Result!");
  }

  return `${result}`;
}

export function getArithmeticPreview(
  textEditor: TextEditor,
  input: string,
  count: number
): string | undefined {
  const selections = textEditor.selections.slice(0, count);
  try {
    const results = selections.map((sel, i) =>
      evalExpr(textEditor.document.getText(sel), i, input)
    );
    if (count !== textEditor.selections.length) {
      results.push("...");
    }

    return results.join(", ");
  } catch (_) {
    return undefined;
  }
}
