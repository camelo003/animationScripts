/*##############################################################################
################################################################################

         ___                   _     _         __           _       _
        /___\_____      ____ _| | __| | ___   / _\ ___ _ __(_)_ __ | |_ ___
(o<    //  // __\ \ /\ / / _` | |/ _` |/ _ \  \ \ / __| '__| | '_ \| __/ __|
//\   / \_//\__ \\ V  V / (_| | | (_| | (_) | _\ \ (__| |  | | |_) | |_\__ \
V_/_  \___/ |___/ \_/\_/ \__,_|_|\__,_|\___/  \__/\___|_|  |_| .__/ \__|___/
                                              |_|

              - - -[ Adobe After Effects CC 15.0.1 ]- - -

[PTBR]
Esse script importa as informações de movimento (posição, scala e rotação) de um
arquivo *json customizado e aplica na layer selecionada.

[TO-DO]
Incluir alguns tratamentos de erro e feedback!

[Dependencias]
O After não entende o objetos *json nativamente. Por conta disso importamos a
biblioteca 'json2.js' <https://gist.github.com/atheken/654510>.

.gabriel camelo at Birdo, ago 2018

################################################################################
##############################################################################*/

//Carrega biblioteca que lida com JSON
var jsonlib = new File();
jsonlib = jsonlib.openDlg ("escolha lib");
$.evalFile(jsonlib);
jsonlib.close();

//Carrega JSON com marcacao
var f = new File();
f = f.openDlg ("escolha um json");
f.open("r");
var a = f.read();
f.close();

var b = JSON.parse(a);

var frameDuration = app.project.activeItem.frameDuration;
var sL = app.project.activeItem.selectedLayers[0]; //selectedLayer

for(i in b.frame){
    var intI = parseInt(i);
    sL.transform.position.setValueAtTime(intI*frameDuration,[b.frame[i].positionX,b.frame[i].positionY]);
    sL.transform.scale.setValueAtTime(intI*frameDuration,[b.frame[i].scaleX,b.frame[i].scaleY]);
    sL.transform.rotation.setValueAtTime(intI*frameDuration,b.frame[i].rotation);
}

alert("acho que temos!");
