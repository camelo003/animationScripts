/*

---[ Toon Boom Harmony Premium 14.0.0 ]---

[PTBR] Esse script localiza os drawings que estiverem em "Top/_NOTES", pede uma
triagem do usuário e salva um template do drawing selecionado em um caminho
pré-determinado.

.gabriel camelo @ birdo, jun/2018

*/

function sendNotes(){

  if(node.getName("Top/_NOTES")==""){
    MessageBox.information("Essa cena não tem um espaço dedicado para receber notes.")
    return;
  }

  var notesContent = [];
  tempNodesInNotes = node.subNodes("Top/_NOTES");
  for(item in tempNodesInNotes){
    if(node.type(tempNodesInNotes[item])=="READ"){
      notesContent.push(tempNodesInNotes[item]);
    }
  }
  delete tempNodesInNotes;

  if(notesContent.length==0){
    MessageBox.information("Não tem nenhum drawing dentro do grupo '_NOTES'.");
    return;
  }

  var noteNode = chooseNoteDrawing();

  if(noteNode=="CANCELED"){
    return;
  }

  //Caminho onde os notes serão salvos devem ser escritos nessa variavel "pathToNotes"
  var pathToNotes = "C:/Users/gabriel.camelo/Desktop/testHarmonyScene/notes/" + String(scene.currentScene().split("_")[1]);

  selection.clearSelection();
  selection.addNodeToSelection(noteNode);
  var templateName = copyPaste.createTemplateFromSelection(scene.currentScene()+"_notes"+noteNode.split("_")[2],pathToNotes);

  MessageBox.information("Os notes do drawing '"
                         + noteNode.replace("Top/_NOTES/","")
                         + "' foram salvos em\n\n"
                         + pathToNotes
                         + "\n\ncom o nome de '"
                         + templateName
                         + "' e estão prontos para serem puxados pelo animador.");

  // - - - - - Helper Functions- - - - - //
  function print(content){
    MessageLog.trace(content);
  }

  function chooseNoteDrawing(){
    var d = new Dialog();
    d.title = "Mandar Note";
    d.okButtonText = "Mandar Note"

    var localArray = [];
    for(item in notesContent){
      localArray.push(notesContent[item].replace("Top/_NOTES/",""));
    }

    var cb = new ComboBox();
    cb.itemList = localArray;
    cb.label = "Drawing contendo os notes de hoje:";

    d.add(cb);

    if(d.exec()){
      return notesContent[cb.currentItemPos];
    }else{
      return "CANCELED";
    }
  }
}
