/*

---[ Toon Boom Harmony Premium 14.0.0 ]---

[PTBR] Esse script pede confirmação do usuário para salvar a cena e copiá-la em
um caminho pré-determinado.

.gabriel camelo @ birdo, mai/2018,

(o)>
(v)_

*/

function saveAsToPath(){

//DONE Bugs acontecem se as pastas que tentam ser criadas já existem (?) !
//DONE checar se a pasta da cena (!!!) já existe. se sim, perguntar se que exluí-la pra gravar uma nova
//DONE Diálogo explicativo!
//DONE arrumar sistema de cópia de arquivos, está ridículo de demorado!
//DONE possibilidade de mudar o caminho!
//DONE ignorar pasta 'frames'
//DONE para arquivos *xstage, copiar apenas versão atual!
//DONE ignorar arquivos com ~
//DONE checar se o nome da cena está no padrao
//DONE ao salvar uma cena, checar se ela já existe no destino
//     se já existir, mandar a atual versão para a pasta 'temp/ep' + timestamp
//DONE definir path com o ep correspondente

//TODO (pro futuro) as funcoes aprovToTemp() e loopAndCopy() devem ser refatoradas em uma so!

/*  - - { M A I N   F U N C T I O N } - -  */

var rootDir = new Dir;
//ALTERAR DESTINO PADRAO  NA LINHA ABAIXO!
rootDir.path = "C:/Users/gabriel.camelo/Desktop/testHarmonyScene/aprov";

if(!checaPadraoNome()){
  return;
}

if(!initDialog()){
  return;
}

scene.saveAll();

var scenePath = scene.currentProjectPath();
var savePath = new Dir;
savePath.path = rootDir.path + "/" + String(scene.currentScene().split("_")[1]) + "/" + String(scene.currentScene());

if(!rootDir.exists){
  rootDir.mkdir();
}

if(savePath.exists){
  aprovToTemp(savePath.path,"C:/Users/gabriel.camelo/Desktop/testHarmonyScene/temp","C:/Users/gabriel.camelo/Desktop/testHarmonyScene/temp");
  savePath.rmdirs();
}else{
  savePath.mkdir(rootDir.path + "/" + String(scene.currentScene().split("_")[1]));
}

savePath.mkdir(savePath.path);
loopAndCopy(scenePath);
MessageBox.information("A cena foi salva no\ncaminho especificado.");

/*  - - { H E L P E R   F U N C T I O N S } - -  */

function print(content){
  MessageLog.trace(content);
}

function dataHora(){
	var d = new Date();
  var mes = String((d.getMonth()+1)); if(mes.length < 2){ mes = "0" + mes;}
  var dia = String(d.getDate()); if(dia.length < 2){ dia = "0" + dia;}
	var hora = String(d.getHours()); if(hora.length < 2){ hora = "0" + hora;}
	var minuto = String(d.getMinutes()); if(minuto.length < 2){ minuto = "0" + minuto;}
	var a = d.getFullYear() + mes + dia + "_" + hora + "h" + minuto;
	return a;
}

function aprovToTemp(source,destiny,destinyRoot){
  //FIXME -> essa coisa de destinyRoot está bem estranha. Melhorar!
  var temp = new Dir;
  if(destiny==destinyRoot){
	temp.path = destiny + "/" + scene.currentScene() + "_" + dataHora();
  }else{
	temp.path = destiny;
  }
  temp.mkdir();

  var aprov = new Dir;
  aprov.path = source; //FIXME filtrar por cena
  var sourceContent = aprov.entryList("*",-1,4);
  sourceContent.shift();
  sourceContent.shift();

  for(item in sourceContent){
    if(fileOrFolder(source + "/" + sourceContent[item]) == "FOLDER"){
      aprovToTemp(source + "/" + sourceContent[item], temp.path + "/" +  sourceContent[item],destinyRoot);
    }else if(fileOrFolder(source + "/" + sourceContent[item]) == "FILE"){
	copyFile(source + "/" + sourceContent[item],temp.path+ "/" + sourceContent[item]);
    }
  }
}

function loopAndCopy(path){
  var dir = new Dir;
  dir.path = path;
  var l = dir.entryList("*",-1,4);
  l.shift();
  l.shift();
  for(item in l){
    if(fileOrFolder(dir.path + "/" + l[item]) == "FOLDER"){
      if (l[item]=="frames"){
        continue;
      }
      var tempDir = new Dir;
      var dif = dir.path.replace(scenePath,"");
      tempDir.path = savePath.path + dif + "/" + l[item];
      if(!tempDir.exists){
        tempDir.mkdir(tempDir.path);
      }
      loopAndCopy(dir.path + "/" + l[item]);
   }else if(fileOrFolder(dir.path + "/" + l[item]) == "FILE"){
      if(l[item].search("~")!=-1){
        continue;
      }else if(l[item].search(".xstage")!=-1){
        if(l[item].replace(".xstage","")!=scene.currentVersionName()) {
          continue;
        }
      }
      var originalFilePath = dir.path + "/" + l[item];
      var dif = dir.path.replace(scenePath,"");
      var newFilePath = savePath.path + dif + "/" + l[item];

      copyFile(originalFilePath,newFilePath);
   }
  }
}

function copyFile(copyPath,pastePath){
	var fileToCopy = new PermanentFile(copyPath);
	var copyOfFile = new PermanentFile(pastePath);

  fileToCopy.copy(copyOfFile);
}

function fileOrFolder(fileToCheck){
  var tempFile = new QFileInfo(fileToCheck);
  if(!tempFile.isFile()){
    return "FOLDER";
  }else{
    return "FILE";
  }
}

function checaPadraoNome(){
  var scArr = scene.currentScene().split("_");

  if(scArr.length != 3){
    MessageBox.information("O nome desta cena não está no padrão.\nImpossível mandar para aprovação!");
    return false;
  }else{
    return true;
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

  var inputL = new LineEdit;
  inputL.text = rootDir.path;
  inputL.label = "Mandar para aprovação:";
  d.add( inputL );

  var s2 = "ATENÇÃO!";
  var l2 = new Label();
  l2.text = s2;
  d.add(l2);

  var s3 = "Se já existir uma cena de mesmo nome nesse caminho, a versão anterior vai para um temporário\ne a nova cena será salva em seu lugar.";
  var l3 = new Label();
  l3.text = s3;
  d.add(l3);

  var s4 = "Isso pode levar alguns minutos. Um aviso aparecerá quando estiver terminado.";
  var l4 = new Label();
  l4.text = s4;
  d.add(l4);

  d.addSpace(10);

  if(d.exec()){
    rootDir.path = inputL.text;
	  return true;
  }else{
    return false;
  }
}
}
