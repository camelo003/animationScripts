/*##########################################################################
 _______ _______ _     _ _______ ___     ______  _______
|       |       | | _ | |   _   |   |   |      ||       |
|   _   |  _____| || || |  |_|  |   |   |  _    |   _   |
|  | |  | |_____|       |       |   |   | | |   |  | |  |
|  |_|  |_____  |       |       |   |___| |_|   |  |_|  |
|       |_____| |   _   |   _   |       |       |       |         ___
|_______|_______|__| |__|__| |__|_______|______||_______|       /     \
 _______ _______ ______   ___ _______ _______ _______  __      | O _ O |
|       |       |    _ | |   |       |       |       ||  |     /  \_/  \
|  _____|       |   | || |   |    _  |_     _|  _____||  |   .' /     \ `.
| |_____|       |   |_||_|   |   |_| | |   | | |_____ |  |  / /|       |\ \
|_____  |      _|    __  |   |    ___| |   | |_____  ||__| (_/ |       | \_)
 _____| |     |_|   |  | |   |   |     |   |  _____| | __      \       /
|_______|_______|___|  |_|___|___|     |___| |_______||__|    __\_>-<_/__

---[ Animate CC 2018 18.0.1 ]---

"Command" que abre todos os arquivos *fla de uma pasta e exporta os *swf em
outra pasta pre definida.

1. Pede pro usuário indicar uma pasta 'source' e uma pasta 'destiny'
2. Faz uma lista com todos os arquivos *fla da pasta 'source'
3. Abre, exporta e fecha cada item da lista
4. Avisa que o processo terminou.

.gabriel camelo @ birdo, jul/2018

##########################################################################*/

﻿var sourceFolder = fl.browseForFolderURL("Selecione a pasta contendo os arquivos *fla:");
var destinationFolder = fl.browseForFolderURL("Selecione a pasta para salvar os *swf:");

var files = FLfile.listFolder(sourceFolder + "/*.fla", "files");

for (file in files) {

	var curFile = files[file];

	fl.openDocument(sourceFolder + "/" + curFile);
	var actualDocument = fl.getDocumentDOM();
	actualDocument.exportSWF(destinationFolder + "/" + actualDocument.name.replace(".fla",".swf"),true);
	actualDocument.close(false);
}

alert("Acabou!");
