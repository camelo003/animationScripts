/*##########################################################################
 _______ _______ _     _ _______ ___     ______  _______
|       |       | | _ | |   _   |   |   |      ||       |
|   _   |  _____| || || |  |_|  |   |   |  _    |   _   |
|  | |  | |_____|       |       |   |   | | |   |  | |  |
|  |_|  |_____  |       |       |   |___| |_|   |  |_|  |
|       |_____| |   _   |   _   |       |       |       |         ___
|_______|_______|__| |__|__| |__|_______|______||_______|       /     \
 _______ _______ ______   ___ _______ _______ _______  __      |(O)_(O)|
|       |       |    _ | |   |       |       |       ||  |     /  \_/  \
|  _____|       |   | || |   |    _  |_     _|  _____||  |   .' /     \ `.
| |_____|       |   |_||_|   |   |_| | |   | | |_____ |  |  / /|       |\ \
|_____  |      _|    __  |   |    ___| |   | |_____  ||__| (_/ |       | \_)
 _____| |     |_|   |  | |   |   |     |   |  _____| | __      \       /
|_______|_______|___|  |_|___|___|     |___| |_______||__|    __\_>-<_/__

---[ After Effects CC 2018 15.0.1 ]---

[PTBR] Script para importar todos os swfs de todas as cenas de um ep. e montar
a timeline em cima do animatic:

0. [OK] Pede pro usuário selecionar uma comp para ser a 'tripa' do ep.
1. [OK] Usuário seleciona a pasta contendo as cenas;
2. [OK] Remove qualquer cena que não continer "sc" no nome;
3. [OK] Importa todos os swf de cada pasta para uma bin de nome equivalente;
4. [OK] Faz uma precomp com o nome da cena e coloca os swf dentro, em ordem;
5. [OK] Posiciona cada precomp em sequencia da comp do Animatic;
6. [  ] Confere inicio de cada cena em relação à marcação do animatic;
7. [  ] Exibe uma mensagem de confirmação.

.gabriel camelo @ birdo, jun/2018

##########################################################################*/

episodeInit();

function episodeInit(){

//0.
var sel = selectComp();
if(!(sel instanceof CompItem)){
  return;
}

app.beginUndoGroup("Import episode");

//1.
var epFolder = Folder.selectDialog('Select the folder to be imported'); //FIXME tratar cancelamento!
var scenesFolders = epFolder.getFiles(function isFolder(item){return item instanceof Folder;});

//2.
for(var i=0; i<scenesFolders.length; i=i+1){
  //FIXME decidir o que vai no lugar de "pasta" (provavelmente "SC")
  if(scenesFolders[i].name.indexOf("pasta")==-1){
    scenesFolders.splice(i, 1);
  }
}

//3 e 4.
for(var i=0; i<scenesFolders.length; i=i+1){
  var tempFolder = app.project.items.addFolder(scenesFolders[i].name);
  var sceneContent = scenesFolders[i].getFiles("*png"); //FIXME '*swf' no lugar de '*png'
  for(var j=0; j<sceneContent.length; j=j+1){
    var tempImportOptions = new ImportOptions(sceneContent[j]);
    var tempItem = app.project.importFile(tempImportOptions);
    tempItem.parentFolder = tempFolder;
  }
  //FIXME checar ordem das layers!
  var tempComp;
  for (var j=1; j<=tempFolder.numItems; j=j+1) {
    if(j==1){
      var ftg = tempFolder.item(j);
      tempComp = app.project.items.addComp(scenesFolders[i].name,
                                           ftg.width,
                                           ftg.height,
                                           ftg.pixelAspect,
                                           ftg.frameDuration/24, //FIXME mudar pra -> ftg.frameRate
                                           24); //FIXME mudar pra -> ftg.frameRate
      tempComp.parentFolder = tempFolder;
    }
    if(tempComp!=tempFolder.item(j)){
      tempComp.layers.add(tempFolder.item(j));
    }
  /* NOTE o primeiro exec. do loop cria uma comp dentro de tempFolder.
  a qtd. de itens aumenta e no final do loop tenta-se colocar a propria
  comp dentro dela mesma. por isso esse if() antes de adicionar. >:C  */
  }
  //5. a)
  sel.layers.add(tempComp);
}

//5. b)
for(var i=2;i<=sel.layers.length;i=i+1){
  var prevEnd = sel.layer(i-1).startTime + sel.layer(i-1).outPoint;
  sel.layer(i).startTime = prevEnd;
}

//7.
confirmation();

// - - { H E L P E R   F U N C T I O N S } - - //

function print(content){
  $.writeln(content);
}

function getCompByName(name){
  for (var i=1; i<=app.project.numItems; i=i+1) {
    if ((app.project.item(i) instanceof CompItem) && (app.project.item(i).name == name)) {
      return app.project.item(i);
    }
  }
}

function selectComp(){
  var selectedComp;

  var compsInProj = [];
  for(var i=1;i<=app.project.numItems;i=i+1){
    if(app.project.items[i] instanceof CompItem){
      compsInProj.push(app.project.items[i]);
    }
  }

  var compsNames = [];
  for(var i=0;i<compsInProj.length;i=i+1){
      compsNames.push(compsInProj[i].name);
  }

  var myWind = new Window("dialog","Selecione a comp do ep.");

  myWind.text1 = myWind.add("statictext",undefined,"Selecione nessa lista a comp contendo o animatic. Ela será preenchida com as cenas.");
  myWind.list = myWind.add("dropdownlist",undefined,compsNames);
  myWind.list.selection = 0;
  myWind.cancelBtn = myWind.add("button",undefined,"Cancela",{name: "cancel"});
  myWind.cancelBtn.onClick = function (){
    myWind.close();
  };
  myWind.okBtn = myWind.add("button",undefined,"Já é!",{name: "ok"});
  myWind.okBtn.onClick = function (){
    selectedComp = compsInProj[myWind.list.selection.index];
    alert("Okayzou! Selecionou o " + compsInProj[myWind.list.selection.index].name); //FIXME <- Remover
    myWind.close();
  };
  myWind.show();
  myWind = undefined;

  return selectedComp;
}

function confirmation(){
  alert("Episódio foi importado! Depois devo colocar a quantidades de swfs e comps.","Sucesso!",false);
}

}
