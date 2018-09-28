/*

---[ Toon Boom Harmony Premium 14.0.0 ]---

[PTBR] Esse script puxa templates de um caminho pré-determinado e manda para
"Top/_NOTES".

.gabriel camelo @ birdo, jun/2018

*/

function getNotes(){

  if(node.getName("Top/_NOTES")==""){
    MessageBox.information("Essa cena não tem um espaço dedicado para receber notes.")
    return;
  }

  //Pasta para procurar os notes dentro.
  var pathToNotes = "C:/Users/User/Desktop/cenaTeste/NOTES";

  var template = selectNoteTemplate();
  if(template=="CANCELED"){
    return
  }

  copyPaste.setPasteSpecialCreateNewColumn(true);
  copyPaste.usePasteSpecial(true);
  copyPaste.setExtendScene(true);

  copyPaste.pasteTemplateIntoScene(template,"",1);

  node.moveToGroup(selection.selectedNodes(0),"Top/_NOTES");

  // - - - - - HELPER FUNCTIONS - - - - - //
  function print(content){
    MessageLog.trace(content);
  }

  function selectNoteTemplate(){
    var myDir = new Dir();
    myDir.path = pathToNotes;
    var foldersList = myDir.entryList("*",1,6);
    var tplList = [];
    for(item in foldersList){
      if(foldersList[item].search(".tpl")!=-1 && foldersList[item].search("_"+scene.currentScene().split("_")[1])+"_"!=-1){
        tplList.push(foldersList[item]);
      }
    }
    var myDialog = new Dialog();
    myDialog.title = "Puxar Note";
    myDialog.okButtonText = "Puxar Note";

    var l1 = new Label();
    l1.text = "Escolher note localizado em '" + pathToNotes + "'.";
    myDialog.add(l1);

    //FIXME -> Atualmente os templates não estão sendo filtrados por cena!
    var c = new ComboBox();
    c.label = "Note cena " + scene.name + ":"
    c.itemList = tplList;
    myDialog.add(c);

    if(myDialog.exec()){
      return  pathToNotes +"/"+ c.currentItem;
    }else{
      return "CANCELED";
    }
  }
}
