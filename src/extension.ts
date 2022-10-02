import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const todoTextConf         = "conf.todogenerator.todoText";
const baseFolderPathConf   = "conf.todogenerator.baseFolderPath";
const emptyPatchSuffixConf = "conf.todogenerator.emptyPatchSuffix";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('todogenerator.generate_todo', async () => {
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
			prompt: "Enter TODO Name"
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
		const todoText = vscode.workspace.getConfiguration().get<string>(todoTextConf) as string;
		await fs.promises.writeFile(filePath, todoText);

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

export function deactivate() {}
