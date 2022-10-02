// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const baseFolderPathConf = "conf.mantistodo.baseFolderPath";
const emptyPatchSuffixConf = "conf.mantistodo.emptyPatchSuffix";

const todoBoilerplateText = `Notes:
    
    
To look at:
    
    
TODO:
    
    
Bugs:
    
    
Questions:
    
    
Steps to reproduce:
    
    
To debug with:
    
    `;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mantistodo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mantistodo.newmantistodo', async () => {
		// The code you place here will be executed every time your command is executed
		let baseFolderPath = vscode.workspace.getConfiguration().get<string>(baseFolderPathConf) as string;
		if (!fs.existsSync(baseFolderPath)) {		
			const newBaseFolderPath = (await vscode.window.showOpenDialog({
				canSelectMany: false,
				openLabel: 'Select TODO base folder',
				canSelectFiles: false,
				canSelectFolders: true
			}))?.at(0)?.fsPath as string;

			if (!fs.existsSync(newBaseFolderPath)) {
				//vscode.window.showErrorMessage(newBaseFolderPath + " is not a valid path");
				return;
			}
			await vscode.workspace.getConfiguration().update(baseFolderPathConf, newBaseFolderPath, vscode.ConfigurationTarget.Global);			
			baseFolderPath = newBaseFolderPath;
		}

		const todoName = await vscode.window.showInputBox({
			placeHolder: "My Task",
			prompt: "Mantis TODO name"
		});
		if (todoName === undefined) { return; } 
			
		//vscode.window.showInformationMessage(todoName);
		
		const folderPath = path.join(baseFolderPath, todoName);
		if (!fs.existsSync(folderPath)) {
			try {
				await fs.promises.mkdir(folderPath, { recursive: true });
			} catch (err) {
				vscode.window.showErrorMessage("Couldn't create folder " + folderPath);
				return;
			}
		}

		const filePath = path.join(folderPath, todoName + " TODO.txt");
		await fs.promises.writeFile(filePath, todoBoilerplateText);

		let emptyPatchSuffix = vscode.workspace.getConfiguration().get<string>(emptyPatchSuffixConf);

		if (emptyPatchSuffix !== undefined && emptyPatchSuffix !== "") {
			const emptyPatchPath = path.join(folderPath, todoName + " " + emptyPatchSuffix + ".patch");
			try {
				await fs.promises.open(emptyPatchPath, fs.constants.O_CREAT);
			} catch (err) {
				vscode.window.showErrorMessage("Couldn't create empty .patch file with suffix " + emptyPatchSuffix);
			}
		}
		//vscode.window.showInformationMessage("Wrote to " + filePath);
		
		const document = await vscode.workspace.openTextDocument(filePath);
		vscode.window.showTextDocument(document);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
