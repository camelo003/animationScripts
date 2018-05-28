function saveAsToPath(){

//FIXME Bugs acontecem se as pastas que tentam ser criadas já existem (?) !
//FIXME checar se a pasta da cena (!!!) já existe. se sim, perguntar se que exluí-la pra gravar uma nova
//FIXME ignorar pasta 'frames'
//FIXME para arquivos *xstage, copiar apenas versão atual!

/*  - - { M A I N   F U N C T I O N } - -  */

var dirHandler = new Dir;
var scenePath = scene.currentProjectPath();
var savePath = "C:/Users/User/Desktop/cenaTeste/savePath/" + scene.currentScene();

dirHandler.mkdir("C:/Users/User/Desktop/cenaTeste/savePath/");
dirHandler.mkdir(savePath);

print("=========================");

loopAndCopy(scenePath);

MessageBox.information("Foi!");

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
    print(fileOrFolder(dir.path + "/" + l[item]));
    if(fileOrFolder(dir.path + "/" + l[item]) == "FOLDER"){
      var tempDir = new Dir;
      var dif = dir.path.replace(scenePath,"");
      tempDir.path = savePath + dif + "/" + l[item];
      if(!tempDir.exists){
        tempDir.mkdir(tempDir.path);
      }
      loopAndCopy(dir.path + "/" + l[item]);
   }else if(fileOrFolder(dir.path + "/" + l[item]) == "FILE"){
      var originalFilePath = dir.path + "/" + l[item];
      var dif = dir.path.replace(scenePath,"");
      var newFilePath = savePath + dif + "/" + l[item];

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

}
