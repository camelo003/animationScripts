/*#############################################################################
         ___                   _     _         __           _       _       
        /___\_____      ____ _| | __| | ___   / _\ ___ _ __(_)_ __ | |_ ___ 
(o<    //  // __\ \ /\ / / _` | |/ _` |/ _ \  \ \ / __| '__| | '_ \| __/ __|
//\   / \_//\__ \\ V  V / (_| | | (_| | (_) | _\ \ (__| |  | | |_) | |_\__ \
V_/_  \___/ |___/ \_/\_/ \__,_|_|\__,_|\___/  \__/\___|_|  |_| .__/ \__|___/
                                                       |_|            

						---[ Adobe Animate CC 18.0.1 ]---                      

Esse script exporta informação de movimento (posição, tamanho e rotação) do
primeiro elemento da layer selecionada em um arquivo *json customizado.

.gabriel camelo at Birdo, ago 2018

#############################################################################*/

var lyr = fl.getDocumentDOM().getTimeline().layers[fl.getDocumentDOM().getTimeline().getSelectedLayers()];
var a = "";

for(var i=0;i<lyr.frames.length;i=i+1){
	if(i==0){
		a = a + '{\n  "frame":{\n';
	}
	a=a+'    "'+i+'":{\n';
	a=a+'      "positionX":'+lyr.frames[i].elements[0].transformX+',\n';
	a=a+'      "positionY":'+lyr.frames[i].elements[0].transformY+',\n';
	a=a+'      "scaleX":'+lyr.frames[i].elements[0].scaleX+',\n';
	a=a+'      "scaleY":'+lyr.frames[i].elements[0].scaleY+',\n';
	a=a+'      "rotation":'+lyr.frames[i].elements[0].rotation;
	if(i==lyr.frames.length-1){
		a = a + '\n    }\n  }\n}';
	}else{
		a = a + "\n    },\n"
	}
}

var caminho = fl.browseForFolderURL("Onde salvar?");
var flaFileName = document.name.substring(0,document.name.length-4);
var jsonFileName = flaFileName+"_motionAt_"+lyr.name+".json";
FLfile.write(caminho+"/"+jsonFileName,a);

alert("O arquivo '"+ jsonFileName + "' foi salvo em '" + caminho + "' com a informação de movimento dessa layer.\n\nValeu!");