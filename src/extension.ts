// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mantistodo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mantistodo.newmantistodo', () => {
		// The code you place here will be executed every time your command is executed
		
		let baseFolderPath = vscode.workspace.getConfiguration().get("conf.mantistodo.baseFolderPath");
		if (!baseFolderPath || baseFolderPath === "") {
			vscode.window.showErrorMessage(`Empty base folder path defined in conf.mantistodo.baseFolderPath`);
			//vscode.window.showErrorMessage(`Invalid base folder path defined in conf.mantistodo.baseFolderPath \"{baseFolderPath}\"`);
			return;
        }

		let baseFolderPathStr = baseFolderPath as string;
		// Display a message box to the user
		vscode.window.showInformationMessage(baseFolderPathStr);

		//fs.writeFile()
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
