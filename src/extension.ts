// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ArithmeticInput } from "./input";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerTextEditorCommand(
    "arithmetic.performArithmetic",
    () => {
      const textEditor = vscode.window.activeTextEditor;
      if (!textEditor) {
        vscode.window.showErrorMessage("Command must be run in a text editor!");
        return;
      }

      const previewCount = vscode.workspace
        .getConfiguration("arithmetic")
        .get<number>("numberOfItemsInPreview")!;

      new ArithmeticInput(textEditor, previewCount).show();
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
