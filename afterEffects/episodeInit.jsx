/*##########################################################################
 _______ _______ _     _ _______ ___     ______  _______
|       |       | | _ | |   _   |   |   |      ||       |
|   _   |  _____| || || |  |_|  |   |   |  _    |   _   |
|  | |  | |_____|       |       |   |   | | |   |  | |  |
|  |_|  |_____  |       |       |   |___| |_|   |  |_|  |
|       |_____| |   _   |   _   |       |       |       |         ___
|_______|_______|__| |__|__| |__|_______|______||_______|       /     \
 _______ _______ ______   ___ _______ _______ _______  __      |(o)_(o)|
|       |       |    _ | |   |       |       |       ||  |     /  \_/  \
|  _____|       |   | || |   |    _  |_     _|  _____||  |   .' /     \ `.
| |_____|       |   |_||_|   |   |_| | |   | | |_____ |  |  / /|       |\ \
|_____  |      _|    __  |   |    ___| |   | |_____  ||__| (_/ |       | \_)
 _____| |     |_|   |  | |   |   |     |   |  _____| | __      \       /
|_______|_______|___|  |_|___|___|     |___| |_______||__|    __\_>-<_/__

---[ After Effects CC 2018 15.0.1 ]---

[PTBR] Script para importar todos os swfs de todas as cenas de um ep. e montar
a timeline em cima do animatic:

0. [ok] Pede pro usuário selecionar uma comp para ser a 'tripa' do ep.
1. [OK] Usuário seleciona a pasta contendo as cenas;
1,5. [  ] Usuário seleciona as pastas que quer importar;
2. [OK] Remove qualquer cena que não continer "sc" no nome;
3. [OK] Importa todos os swf de cada pasta para uma bin de nome equivalente;
4. [OK] Faz uma precomp com o nome da cena e coloca os swf dentro, em ordem;
5. [OK] Posiciona cada precomp em sequencia da comp do Animatic;
6. [  ] Confere inicio de cada cena em relação à marcação do animatic;
7. [ok] Exibe uma mensagem de confirmação.

.gabriel camelo @ birdo, jun/2018

##########################################################################*/

episodeInit();

function episodeInit(){

var swfs = 0;
var scenes = 0;

//0.
var sel = selectComp();
if(!(sel instanceof CompItem)){
  return;
}

app.beginUndoGroup("Import episode");

//1.
var epFolder = Folder.selectDialog('Select the folder to be imported'); //FIXME tratar cancelamento!
var scenesFolders = epFolder.getFiles(function isFolder(item){return item instanceof Folder;});

//1,5.
scenesFolders = filterFolders(scenesFolders);

//2.
for(var i=0; i<scenesFolders.length; i=i+1){
  //FIXME decidir o que vai no lugar de "pasta" (provavelmente "SC")
  if(scenesFolders[i].name.indexOf("SC")==-1){
    scenesFolders.splice(i, 1);
  }
}

//3 e 4.
for(var i=0; i<scenesFolders.length; i=i+1){
  var tempFolder = app.project.items.addFolder(scenesFolders[i].name);
  var sceneContent = scenesFolders[i].getFiles("*swf"); //FIXME '*swf' no lugar de '*png'
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
                                           ftg.duration, //FIXME mudar pra -> ftg.frameRate
                                           ftg.frameRate); //FIXME mudar pra -> ftg.frameRate
      tempComp.parentFolder = tempFolder;
    }
    if(tempComp!=tempFolder.item(j)){
      tempComp.layers.add(tempFolder.item(j));
    }
  /* NOTE o primeiro exec. do loop cria uma comp dentro de tempFolder.
  a qtd. de itens aumenta e no final do loop tenta-se colocar a propria
  comp dentro dela mesma. por isso esse if() antes de adicionar. >:C  */
    swfs = swfs + 1;
  }
  scenes = scenes + 1;
  //5. a)
  sel.layers.add(tempComp);
}

//5. b)
/* for(var i=2;i<=sel.layers.length;i=i+1){ // FIXME -> wtf!?
  var prevEnd = sel.layer(i-1).startTime + sel.layer(i-1).outPoint;
  sel.layer(i).startTime = prevEnd; //FIXME -> tratar caso o esteja fora da comp
}*/

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
    myWind.close();
  };
  myWind.show();
  myWind = undefined;

  return selectedComp;
}

function filterFolders(foldersList){
  var toReturn = [];
  var w = new Window("dialog","Pastas para importar");
  w.main = w.add("panel", [0,0,400,300],"Pastas");
  w.main.checkboxes = w.main.add("group",[0,0,350,20+(20*(foldersList.length+1))]);

  w.main.checkboxes.frstChk = w.main.checkboxes.add("checkbox", [10, 20,350, 35], "TODOS");
  w.main.checkboxes.frstChk.onClick = function () {
    for(var i=0;i<w.main.checkboxes.children.length;i=i+1){
      if(i!=0){
        w.main.checkboxes.children[i].value = w.main.checkboxes.children[0].value;
      }
    }
  };

  for(var i=0; i<foldersList.length; i=i+1){
    w.main.checkboxes.add("checkbox", [10, 20*(i+2), 350, 20*(i+2)+15], foldersList[i].name);
  }

  w.main.scrl = w.main.add("scrollbar",[375,0,395,290]);

  var sizeDif = (20+(20*(foldersList.length+1))) - 300;
  w.main.scrl.onChanging = function (){w.main.checkboxes.location.y = -(w.main.scrl.value/100)*sizeDif;};

  var btnWidth = 100;
  var btnHeight = 35;
  var btnMargin = 10;
  w.btns = w.add("group",[0,310,400,360]);
  w.btns.ok = w.btns.add("button",[(400/2)-btnWidth-(btnMargin/2),0,((400/2)-(btnMargin/2)),btnHeight],"Ok");
  w.btns.ok.onClick = function (){
    for(var i=0;i<foldersList.length;i=i+1){
      if(w.main.checkboxes.children[i+1].value){ // +1 porque o primeiro checkbox é o TODOS. sorry =[ ...
        toReturn.push(foldersList[i]);
      }
    }
    w.close();
  };
  w.btns.cancel = w.btns.add("button",[(400/2)+(btnMargin/2),0,(400/2)+btnWidth+(btnMargin/2),btnHeight],"Cancela");
  w.btns.cancel.onClick = function (){
    toReturn = foldersList;
    w.close();
  };

  w.show();
  return toReturn;
}

function confirmation(){
  var confirmW = new Window("dialog","Sucesso!");
  confirmW.mainPnl = confirmW.add('group',[25,5,355,115]);
  var s = "Aparentemente deu tudo certo!\n\nForam importados " + swfs + " arquivos *swf e " + scenes + " cenas foram criadas.\n\nO projeto ficou assim:";
  confirmW.mainPnl.text1 = confirmW.mainPnl.add('statictext',[0,0,340,115],s,{multiline:true});
  confirmW.structure = confirmW.add('treeview',[25,0,355,460]);
  fillStructure(sel,confirmW.structure);
  confirmW.buttonsPnl = confirmW.add('group',[25,5,355,40],{orientation: "row",});
  confirmW.buttonsPnl.okBtn = confirmW.buttonsPnl.add("button",[0,0,75,30],"Ok!",{name: "ok", align: "center"});
  confirmW.show();

  function fillStructure(compItemLocal,nodeLocal){
    var tempNodeCatcher;
    if(compItemLocal instanceof CompItem){
      tempNodeCatcher = nodeLocal.add("node",compItemLocal.name);
      for(var i=1;i<=compItemLocal.numLayers;i=i+1){
        fillStructure(compItemLocal.layer(i).source,tempNodeCatcher);
      }
    }else if(compItemLocal instanceof FootageItem){
      nodeLocal.add("item",compItemLocal.name);
    }
  }
}

}
