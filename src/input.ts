import * as vscode from "vscode";
import { getArithmeticPreview, evalExpr, tryEval } from "./eval";

export class ArithmeticInput {
  private readonly inputBox: vscode.InputBox = vscode.window.createInputBox();

  constructor(
    private readonly textEditor: vscode.TextEditor,
    private readonly previewCount: number
  ) {
    this.inputBox.prompt = "Arithmetic";
    this.inputBox.placeholder = "Expression";
    this.inputBox.title = getArithmeticPreview(
      textEditor,
      (this.inputBox.value = this.getInitialValue()),
      this.previewCount
    );

    this.inputBox.onDidChangeValue(this.onDidChangeValue);
    this.inputBox.onDidAccept(this.onDidAccept);
    this.inputBox.onDidHide(this.onDidHide);
  }

  public show() {
    this.inputBox.show();
  }

  private onDidChangeValue = (input: string) => {
    this.inputBox.title = getArithmeticPreview(
      this.textEditor,
      input,
      this.previewCount
    );
  };

  private onDidHide = () => {
    this.inputBox.dispose();
  };

  private onDidAccept = () => {
    const { selections, document } = this.textEditor;
    this.textEditor.edit((editBuilder) => {
      for (let i = 0; i < selections.length; ++i) {
        editBuilder.replace(
          selections[i],
          evalExpr(document.getText(selections[i]), i, this.inputBox.value)
        );
      }
    });

    this.inputBox.dispose();
  };

  private getInitialValue() {
    const { selections } = this.textEditor;
    if (selections.length === 1) {
      return this.textEditor.document.getText(selections[0]);
    } else if (selections[0].isEmpty) {
      return "i + 1";
    } else if (tryEval(this.textEditor.document.getText(selections[0]))) {
      return "x";
    } else {
      return "s";
    }
  }
}
