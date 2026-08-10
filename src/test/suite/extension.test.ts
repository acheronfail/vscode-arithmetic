import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getArithmeticPreview, sortSelections } from '../../eval';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

	test('sorts selections by their start position', () => {
		const selections = [
			new vscode.Selection(1, 0, 1, 1),
			new vscode.Selection(2, 0, 2, 1),
			new vscode.Selection(0, 0, 0, 1),
		];

		const sorted = sortSelections(selections);

		assert.deepEqual(sorted.map(selection => selection.start.line), [0, 1, 2]);
		assert.deepEqual(selections.map(selection => selection.start.line), [1, 2, 0]);
	});

	test('previews arithmetic in document order', () => {
		const selections = [
			new vscode.Selection(1, 0, 1, 1),
			new vscode.Selection(2, 0, 2, 1),
			new vscode.Selection(0, 0, 0, 1),
		];
		const textEditor = {
			selections,
			document: {
				getText: (selection: vscode.Selection) => `${selection.start.line + 1}0`,
			},
		} as vscode.TextEditor;

		assert.equal(
			getArithmeticPreview(textEditor, 's + ":" + i', 3),
			'10:0, 20:1, 30:2'
		);
	});
});
