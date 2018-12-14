function listaDrawings(firstGroup){
	
	var listToFill = [];
	
	listaRecursivamente(node.subNodes(firstGroup));
	
	function listaRecursivamente(a){
		for(var i = 0;i<a.length;i=i+1){
			if(node.type(a[i]) == "READ"){
				listToFill.push(a[i]);
			}else if(node.type(a[i]) == "GROUP"){
				listaRecursivamente(node.subNodes(a[i]));
			}
		}
	}

	return listToFill;
}
