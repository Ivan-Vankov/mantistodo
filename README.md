# README

Creates a boilerplate TODO.txt file and an optional .patch file.

## Features

* Create TODO (`Ctrl + Alt + M`), also under (`File\New File...`)

## Extension Settings

* `conf.todogenerator.todoText`: The boilerplate TODO text that will be written in the TODO .txt file.
* `conf.todogenerator.baseFolderPath`: Folder path under which the TODOs will be created. If invalid a folder selection window will pop-up during TODO creation and the selected folder will be set as the base folder.
* `conf.todogenerator.emptyPatchSuffix`: If non-empty will also create an empty .patch file with the specified suffix.

## Setup - Development

1. Open the [source](https://github.com/Ivan-Vankov/mantistodo) in VS Code.
2. Run `npm install`
3. Press `F5` or `Debug > Start debugging`

> Ensure typescript is installed in global scope. Else run >  `npm install -g typescript`
