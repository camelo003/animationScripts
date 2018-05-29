/*

---[ Toon Boom Harmony Premium 14.0.0 ]---

[PTBR] Esse script pede confirmação do usuária para salvar a cena e copiá-la em
um caminho pré-determinado.

.gabriel camelo @ birdo, mai/2018

*/

function saveAsToPath(){

//DONE Bugs acontecem se as pastas que tentam ser criadas já existem (?) !
//DONE checar se a pasta da cena (!!!) já existe. se sim, perguntar se que exluí-la pra gravar uma nova
//DONE Diálogo explicativo!
//FIXME FIXME FIXME arrumar sistema de cópia de arquivos, está ridículo de demorado!
//FIXME possibilidade de mudar o caminho
//FIXME ignorar pasta 'frames'
//FIXME para arquivos *xstage, copiar apenas versão atual!
//FIXME ignorar arquivos com ~

/*  - - { M A I N   F U N C T I O N } - -  */

if(!initDialog()){
  return;
}

scene.saveAll();

var rootDir = new Dir;
rootDir.path = "C:/Users/User/Desktop/cenaTeste/savePath/";
var scenePath = scene.currentProjectPath();
var savePath = new Dir;
savePath.path = rootDir.path + "/" + scene.currentScene();

if(!rootDir.exists){
  rootDir.mkdir();
}

if(savePath.exists){
  savePath.rmdirs();
}

rootDir.mkdir(savePath.path);
loopAndCopy(scenePath);
MessageBox.information("A cena foi salva no\ncaminho especificado.");

/*  - - { H E L P E R   F U N C T I O N S } - -  */

function print(content){
  MessageLog.trace(content);
}

function loopAndCopy(path){
  var dir = new Dir;
  dir.path = path;
  var l = dir.entryList("*",-1,4);
  l.shift();
  l.shift();
  for(item in l){
    if(fileOrFolder(dir.path + "/" + l[item]) == "FOLDER"){
      var tempDir = new Dir;
      var dif = dir.path.replace(scenePath,"");
      tempDir.path = savePath.path + dif + "/" + l[item];
      if(!tempDir.exists){
        tempDir.mkdir(tempDir.path);
      }
      loopAndCopy(dir.path + "/" + l[item]);
   }else if(fileOrFolder(dir.path + "/" + l[item]) == "FILE"){
      var originalFilePath = dir.path + "/" + l[item];
      var dif = dir.path.replace(scenePath,"");
      var newFilePath = savePath.path + dif + "/" + l[item];

      copyFileBytes(originalFilePath,newFilePath);
   }
  }
}

function copyFileBytes(copyPath,pastePath){
	var fileToCopy = new File(copyPath);
	var copyOfFile = new File(pastePath);

	fileToCopy.open(FileAccess.ReadOnly);
	copyOfFile.open(FileAccess.WriteOnly);

	for(var i = 0;i<fileToCopy.size;i=i+1){
		copyOfFile.writeByte(fileToCopy.readByte());
	}

	fileToCopy.close();
	copyOfFile.close();
}

function fileOrFolder(fileToCheck){
  var tempFile = new File(fileToCheck);
  if(tempFile.size==0){
    return "FOLDER";
  }else{
    return "FILE";
  }
}

function initDialog(){
  var d = new Dialog();
  d.title = "Save as to path...";
  d.width = 350;

  var s1 = "A cena atual será salva e copiada para o seguinte caminho.";
  var l1 = new Label();
  l1.text = s1;
  d.add(l1);

  var sPath = "C:/Users/User/Desktop/cenaTeste/savePath/";
  var inputL = new LineEdit;
  inputL.text = sPath;
  inputL.label = "Save as to path:";
  d.add( inputL );

  var s2 = "ATENÇÃO!";
  var l2 = new Label();
  l2.text = s2;
  d.add(l2);

  var s3 = "Se já existir uma cena de mesmo nome nesse caminho, essa cena será excluída e\numa nova cena será salva em seu lugar.";
  var l3 = new Label();
  l3.text = s3;
  d.add(l3);

  if(d.exec()){
	   return true;
  }else{
    return false;
  }
}

}
