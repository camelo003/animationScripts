/*

---[ Toon Boom Harmony Premium 14.0.0 ]---

[PTBR] Esse script muda a exposicao todos os desenhos do grupo da atual seleção
para  a posicao "zZero" (com eventuais desenhos em subgrupos) e cria uma nova
exposição no drawing que tiver "FULL" no nome.

.gabriel camelo @ birdo, mai/2018

*/

function newDrawingInFull(){

	var inNode = selection.selectedNode(0);

	if(trataErro(inNode)){
		return;
	}

	selection.clearSelection();

	var nodeGroup = node.parentNode(inNode);
	var arrayDeSubNodes = node.subNodes(nodeGroup);

	correGrupo(arrayDeSubNodes);
}

function correGrupo(lista){
	for(var i=0;i<lista.length;i=i+1){
		if(node.type(lista[i])=="READ"){
			var s = node.getName(lista[i]);
			if(s.indexOf("FULL")==-1){
				var d = node.linkedColumn(lista[i],"DRAWING.ELEMENT");
				column.setEntry(d,1,frame.current(),"zZero");
			}else{
				var f = node.linkedColumn(lista[i],"DRAWING.ELEMENT");
				var tempRand = 500 + Math.round(Math.random()*1000);
				column.createDrawing(f,tempRand);
				var tempInput = Input.getText("Nome do novo desenho:","X_novoDesenho","Novo desenho em 'FULL'");
				//FIXME: se criar um nome que já existe o anterior recebe um novo nome estranho.
				column.renameDrawing(f,tempRand,tempInput);
				column.setEntry(f,1,frame.current(),tempInput);
				selection.addNodeToSelection(lista[i]);
				noFull = "";
			}
			nds.push(node.getName(lista[i])+" ");
			continue;
		}
	  if(node.type(lista[i])=="GROUP"){
			var novaSublista = node.subNodes(lista[i]);
			 correGrupo(novaSublista);
			 continue;
		}
	}
}

function trataErro(inputNode){
	if(inputNode==""){
		MessageBox.information("Nenhum desenho selecionado.");
		return true;
	}
	if(node.type(inputNode)!="READ"){
		MessageBox.information("O node selecionado não é Um node de desenho.");
		return true;
	}
	if(node.parentNode(inputNode)=="Top"){
		MessageBox.information("O node selecionado não está dentro de um grupo.");
		return true;
	}
	var s = node.subNodes(node.parentNode(selection.selectedNode(0))).toString();
	if(s.indexOf("FULL")==-1){
		MessageBox.information("Esse grupo não tem um drawing 'FULL'.");
		return true;
	}

}
