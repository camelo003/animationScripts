/*##############################################################################

...____...................._....._.........._____..........._......._       
../ __ \..................| |...| |......../ ____|.........(_).....| |      
.| |  | |_____......____._| |.__| | ___...| (___   ___ _ __ _ _ __ | |_ ___ 
.| |  | / __\ \ /\ / / _` | |/ _` |/ _ \...\___ \ / __| '__| | '_ \| __/ __|
.| |__| \__ \\ V  V / (_| | | (_| | (_) |..____) | (__| |  | | |_) | |_\__ \
..\____/|___/ \_/\_/ \__,_|_|\__,_|\___/..|_____/ \___|_|  |_| .__/ \__|___/
.............................................................| |            
.............................................................|_|            

~~~~{After Effects CC 15.0.1}~~~~

[PTBR]
Expressão pra ser colocada no parâmetro 'Source Text' de uma layer de texto a fim
de gerar uma marcação de cenas baseadas em uma layer de referência com as marcas.

[Effects>Expression Controls>Layer Control = effect("Layer com Marcação")("Layer")]

Os marcadores devem ser comentados com:

  - "Sc XXXX" para cenas intermediárias;
  - "t" para transições;
  - "+" para incremetar +1 à contagem de cenas.

Adicionalmente, expressões para shapes foram incrementadas
(ver arquivo templateOswEtiqueta.aep).

gabriel camelo at Birdo, jul 2018.

##############################################################################*/

var L = effect("Layer com Marcação")("Layer");
var activeMark;
var activeScene;
var transitions=0, ignoreds=0, increments=0;
var scName, actualFrame, frameDuration;
var finalOutput;
var isTransition = false;

for(var i=1;i<=L.marker.numKeys;i=i+1){
  var s;
  if(i>1){
    s = L.marker.key(i-1).comment;
  }else{
    s = L.marker.key(i).comment;
  }
  if(s.indexOf("t")!=-1 || s.indexOf("T")!=-1){
    transitions = transitions + 1;
  }
  if(s.indexOf("+")!=-1){
    increments = increments + 1;
  }
  if(s.indexOf("Sc")!=-1){
    ignoreds = ignoreds + 1;
  }
  if(time<L.marker.key(i).time){
    activeMark = i-1;
    activeScene = activeMark-transitions-ignoreds+increments;
    break;
  }
}

//Resolve sceneName!
if(L.marker.key(activeMark).comment.indexOf("t")!=-1){
  isTransition = true;
}else if(L.marker.key(activeMark).comment.indexOf("Sc")!=-1){
  scName = L.marker.key(activeMark).comment;
}else{
  scName = scFormat(activeScene);
}

//Resolve actualFrame
if(isTransition){
  //do nothing!
}else if(activeMark>1 && L.marker.key(activeMark-1).comment.indexOf("t")!=-1){ //anterior for transição
  actualFrame = timeToFrames(time-L.marker.key(activeMark-1).time);
}else{ //normalzão
  actualFrame = timeToFrames(time-L.marker.key(activeMark).time);
}

//Resolve frameDuration
if(isTransition){
  //do nothing!
}else if(activeMark>1 && L.marker.key(activeMark-1).comment.indexOf("t")!=-1){ //anterior for transição
  frameDuration = timeToFrames(L.marker.key(activeMark+1).time-L.marker.key(activeMark-1).time)-1;
}else if(L.marker.key(activeMark+1).comment.indexOf("t")!=-1){ //próx. for transição
  frameDuration = timeToFrames(L.marker.key(activeMark+2).time-L.marker.key(activeMark).time)-1;
}else{ //normalzão
  frameDuration = timeToFrames(L.marker.key(activeMark+1).time-L.marker.key(activeMark).time)-1;
}

//Resolve transição
if(isTransition){
  var preScName = scFormat(activeScene);
  var preActualFrame = timeToFrames(time-L.marker.key(activeMark-1).time);
  var preFrameDuration = timeToFrames(L.marker.key(activeMark+1).time-L.marker.key(activeMark-1).time)-1;
  var nextScName = scFormat(activeScene+1);
  var nextActualFrame = timeToFrames(time-L.marker.key(activeMark).time);
  var nextFrameDuration = timeToFrames(L.marker.key(activeMark+2).time-L.marker.key(activeMark).time)-1;
  
  finalOutput = preScName  + "\n" + preActualFrame  + "/" + preFrameDuration + "\n\n" +
                nextScName + "\n" + nextActualFrame + "/" + nextFrameDuration;
}else{
  finalOutput = scName + "\n" + actualFrame + "/" + frameDuration;
}

finalOutput

// - - - H E L P E R   F U N C T I O N S - - - //

function scFormat(scNumber){
  var tempString = String(scNumber);
  var putZeros = 3 - tempString.length;
  for(var i=0;i<putZeros;i=i+1){
    tempString = "0" + tempString;
  }
  return "Sc " + tempString + "0";
}
