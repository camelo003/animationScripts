/*
                ______________________________________
       ________|   TOON BOOM HARMONY PREMIUM 14.0.0   |_______
       \       |         ANIM. COPIER SCRIPT          |      /
        \      |   gabriel camelo, mai 2019  @Birdo   |     /
        /      |______________________________________|     \
       /__________)                                (_________\

[PTBR] Esse script é uma interface para facilitar o processo de buscar e aplicar
animações de bancos, filtrando automaticamente baseado no grupo selecionado
e com a vantagem de se aplicar os templates à rigs contendo elementos adicionais
como props. FUNÇÃO -> animCopier()

              - - - I M P O R T A N T E ! - - -

	Para adaptar esse script para outros projetos basta fazer o seguinte:

	1. Editar os trechos entre aspas das linhas abaixo dos comentários que
	contenham 'FIXME', da seguinte forma:

		a) 'propsNode' -> nome do composite node que recebe todos os props do
		personagem em todos os rigs;

		b) 'this.ui = UiLoader.load' -> caminho para arquivo .ui da interface
		criada no QT Designer

		c) 'file = new File' -> caminho para arquivo .txt contendo a relação dos
		personagens/grupos (nome idêntico ao grupo que receberá o template) com
		o endereço do respectivo banco.

	2. Garantir que o rig siga as regras sagradas dos props:

               #######################################
               ###    REGRAS SAGRADAS DOS PROPS    ###
               #######################################
               ##   1. TODOS os props devem estar   ##
               ##   conectados ao composite         ##
               ##   'PROPS_COMPOSITE';              ##
               ##                                   ##
               ##   2. o composite final de TODOS   ##
               ##   os personagens devem se chamar  ##
               ##   'PERSONAGEM_COMPOSITE' onde     ##
               ##   PERSONAGEM recebe o nome do     ##
               ##   respectivo personagem;          ##
               ##                                   ##
               ##   3. o node 'PROPS_COMPOSITE'     ##
               ##   precisa estar ligado ao node    ##
               ##   'PERSONAGEM_COMPOSITE' pela     ##
               ##   última conexão (node mais à     ##
               ##   esquerda);                      ##
               #####################################*/


function AnimCopierDialog(destinyNode,bancoAddr,funcTemplates,funcThumbsSeqs){

// ##### C A L L   B A C K   F U N C T I O N S ##### //

	this.clickHome = function(){
		if(selectedTemplate != -1){
			this.ui.progressBar.value = 0;
			this.ui.progressBar.minimum = 0;
		}
	}

	this.clickPlay = function(){
		if(selectedTemplate != -1 && !playing){
			playing = true;
			this.ui.progressBar.value = 0;
			var i=0;
			var timeBefore = Date.now();
			while(i<=this.ui.progressBar.maximum*3){
				var timeNow = Date.now();
				if(timeNow-timeBefore>(1000/24)){
					this.ui.progressBar.value = i % this.ui.progressBar.maximum;
					i=i+1;
					timeBefore = timeNow;
				}
				if(i == this.ui.progressBar.maximum*3){
					playing = false;
				}
			}
		}
	}

	this.clickAplicar = function(){
		if(selectedTemplate == -1){
			MessageBox.information("Selecione algum template para aplicar.");
			return;
		}

		// FIXME composite que recebe TODOS os props
		var propsNode = "/PROPS_COMPOSITE";

		var nodePath = selection.selectedNodes()[0];
		var nodePathDivided = nodePath.split("/");

		var srcNode = nodePathDivided[0] + nodePathDivided[1] + propsNode;
		var srcPort = 0;
		var dstNode = nodePathDivided[0] + nodePathDivided[1] + "/" + nodePathDivided[1] + "_COMPOSITE";
		var dstPort = node.numberOfInputPorts(dstNode);
		var mayAddOutputPort = false;
		var mayAddInputPort = true;

		node.unlink(dstNode,dstPort-1);

		var actionTemplatePath = bancoAddr + "/" + funcTemplates[selectedTemplate];
		var rootNode = selection.selectedNode(0);
		var frameToPaste = Timeline.firstFrameSel;

		if(!copyPaste.pasteActionTemplateIntoNode(actionTemplatePath,rootNode,frameToPaste)){
			MessageBox.information("Não foi possível colar o template.");
		}

		node.link(srcNode,srcPort,dstNode,dstPort,mayAddOutputPort,mayAddInputPort);

		this.ui.close();
	}

	this.changeList = function(){
		selectedTemplate = this.ui.listView.currentIndex().row();
		this.updateScroll();
	}

	this.mudaSlider = function(){
		if(this.ui.label.pixmap != null){
			this.ui.label.pixmap = funcThumbsSeqs[selectedTemplate][this.ui.progressBar.value];
		}
	}

	this.updateScroll = function(){
		this.ui.label.pixmap = funcThumbsSeqs[selectedTemplate][0];
		this.ui.label.text = null;

		this.ui.progressBar.value = 0;
		this.ui.progressBar.maximum = funcThumbsSeqs[selectedTemplate].length - 1;
	}

// ########### fim das CALL BACK FUNCTIONS ########### //

	var selectedTemplate = -1;
	var playing = false;

	// FIXME caminho da interface
	this.ui = UiLoader.load("C:/Users/gabriel.camelo/Desktop/bancosTeste/animCopierInterface.ui");

	var templatesList = new QStringListModel;
	templatesList.setStringList(funcTemplates);
	this.ui.listView.setModel(templatesList);

	//this.ui.label.pixmap = pix;
	this.ui.label.text = "Selecione um template ao lado";

	this.ui.btHome.clicked.connect(this,this.clickHome);
	this.ui.btPlay.clicked.connect(this,this.clickPlay);
	this.ui.listView.clicked.connect(this,this.changeList);
	this.ui.btAplicar.clicked.connect(this,this.clickAplicar);
	this.ui.progressBar.valueChanged.connect(this,this.mudaSlider);

}

function animCopier(){

//1. identifica o personagem/grupo e determinaa o endereço do banco

	if(selection.selectedNodes().length != 1){
		MessageBox.information("Selecione um único grupo que irá receber o template.");
		return;
	}

	if(node.type(selection.selectedNodes()) != "GROUP"){
		MessageBox.information("O node selecionado precisa ser um grupo.");
		return;
	}

	// FIXME Relaçao dos endereços dos bancos!!!
	file = new File("C:/Users/gabriel.camelo/Desktop/bancosTeste/testeBancos.txt");

	if(!file.exists){
		MessageBox.information("A lista dos bancos disponíveis não foi encontrada.");
		return;
	}

	file.open(FileAccess.ReadOnly);
	var fileLinesArray = file.readLines();
	var bancoAddr = [];
	for(var i=0;i<fileLinesArray.length;i=i+1){
		if(fileLinesArray[i] != ""){
			bancoAddr.push(fileLinesArray[i].split(" -> "));
		}
	}

	var nodePath = selection.selectedNodes()[0];
	var nodePathDivided = nodePath.split("/");
	var myNode = nodePathDivided[nodePathDivided.length-1];
	myNode = myNode.split("_")[0];

	var workingBanco = "";

	for(var i=0;i<bancoAddr.length;i=i+1){
		if(myNode == bancoAddr[i][0]){
			workingBanco = bancoAddr[i][1];
			if(workingBanco[workingBanco.length-1]=="\r"){
				workingBanco = workingBanco.substring(0,workingBanco.length-1);
			}
			break;
		}
	}

	if(workingBanco == ""){
		MessageBox.information("Aparentemente não há banco de animação para o grupo selecionado.");
		return;
	}

//2. carrega a lista de templates daquele banco + thumbnails

	var myDir = new Dir;
	myDir.path = workingBanco;

	var folderList = myDir.entryList("*",1,6);

	folderList.reverse();
	folderList.pop();
	folderList.pop();
	if(folderList[folderList.length-1]==".deleted"){
		folderList.pop();
	}
	folderList.reverse();

	var thumbsLists = [];

	for(var i=0;i<folderList.length;i=i+1){
		thumbsLists[i] = [];
		var tempDir = new Dir;
		tempDir.path = workingBanco + "/" + folderList[i] + "/.thumbnails";
		var tempFilesList = tempDir.entryList("*",2,3);
		for(var j=0;j<tempFilesList.length;j=j+1) {
			thumbsLists[i][j] = new QPixmap;
			thumbsLists[i][j].load(tempDir.path + "/" + tempFilesList[j]);
		}
	}

//3. lança a interface com node-destino, lista de templates e imagens

	var f = new AnimCopierDialog(myNode,workingBanco,folderList,thumbsLists);
	f.ui.show();
}
