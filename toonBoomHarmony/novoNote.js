function novoNote(){

  scene.beginUndoRedoAccum("Novo note");

  if(node.getName("Top/_NOTES")==""){
    MessageBox.information("Essa cena não tem um espaço dedicado para receber notes.")
    return;
  }

  var tempNotesList = node.subNodes("Top/_NOTES");
  var notesList = [];
  for(item in tempNotesList){
    if(node.type(tempNotesList[item])=="READ"){
      notesList.push(tempNotesList[item]);
    }
  }
  tempNotesList = undefined;

  var a = novoDrawing("Top/_NOTES","note_"+(notesList.length+1));
  node.link("Top/_NOTES/Multi-Port-In",0,a,0,false,true);
  node.link(a, 0,"Top/_NOTES/compositeNotes",0); //FIXME <- alterar nome da composite aqui!

  var nodeX = -150+(75*notesList.length);
  var nodeY;

  if(notesList.length%2==0){
    nodeY = -15;
  }else{
    nodeY = 15;
  }

  node.setCoord(a,nodeX,nodeY);

  scene.endUndoRedoAccum();

  //HELPER FUNCTIONS

  function novoDrawing(group,name){
    var id = element.add(name, "BW", scene.numberOfUnitsZ(), "SCAN", "TVG");
    column.add(name, "DRAWING");
    column.setElementIdOfDrawing(name, id);
    var tempNode = node.add(group,name, "READ", 0, 0, 0);
    node.linkAttr(tempNode, "DRAWING.ELEMENT", name);
    return tempNode;
  }
}
