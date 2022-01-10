
//Variablen um den arithmethischen Ausdruck zu erzeugen
var expansionCount = 0;
var maxExpansions = 3;
var ausdruck = "A";
var ausdruckFalsch;
var counter = 0;
var ausdruckListe = ["A"];
var regelListe = [];

//variables to navigate Kellerautomat
var startZustand;
var zielZustand;

var eingabeKonsumieren;
var kellerKonsumieren;

var kellerHinzufügen;

var zahlen = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var operationen = ["+", "-", "/", "*"];
var plusMinus = ["+", "-"];

var jetzigerZustand = "0";

//A list with all the tableEntries
var allMoves = [];

var formattedEntries = formatTableEntryArray(allMoves);

var pauseTime = 4000;

var tableHeight = 140;

var entryCounter = 0;

var arrowCounter = 0;



//Die Grammatik Regeln 
//als 2-dimensionale Arrays in einem dictionary
var rules = {
  "A": [
    ["Z"],
    ["A", "O", "A"],
    ["(", "A", "O", "A", ")"]
  ],
  "O": [
    ["*"],
    ["+"],
    ["/"],
    ["-"]
  ],
  "Z": [
    ["0"],
    ["1"],
    ["2"],
    ["3"],
    ["4"],
    ["5"],
    ["6"],
    ["7"],
    ["8"],
    ["9"]
  ]
};

function setup() {
  createCanvas(1600, 500);
  background(220);
  
  expand("A", []);
  ausdruck = ausdruck.replace(/\s/g, "");
  console.log(ausdruck);
  ausdruckFalsch = createWrongExpression();
  console.log(ausdruckFalsch);
  //seems to work


  //test

  //seems to work

  //test
  drawAutomat();
  //seems to work

  //test
  var exampleString = "ABCD";
  exampleString = pushCharacter(exampleString, "E");
  exampleString = deleteLastCharacter(exampleString);
  console.log(exampleString);
  //seems to work

  //test
  var stringy = "";
  console.log(stringy.charAt(stringy.length -1));

  var stringy2 = stringy.charAt(stringy.length -1);

  if (stringy2 == ""){
    console.log(1);
  }
  //seems to work

  //test

  drawTable();
  legende();




  //Inputfenster um die Animationsgeschwindigkeit einzustellen
  createP("Geben Sie die Animationsgeschwindigkeit ein (in Sek.) (Beispiel für Eingabe: 2):");
  inpTime = createInput();
  inpTime.changed(changePauseTime);

  createP("Geben Sie einen arithmetischen Ausdruck ein, oder erzeugen Sie einen über den Button");
  inpAusdruck = createInput();
  inpAusdruck.changed(changeAusdruck);

  //Button um die Animation zu starten
  buttonAnimation1 = createButton("Wahrscheinlich falschen Ausdruck erzeugen");
  buttonAnimation1.mousePressed(ausdruckErzeugen);

  //Button um die Animation zu starten
  buttonAnimation2 = createButton("Ausdruck überprüfen");
  buttonAnimation2.mousePressed(startAnimation);
  
}

function draw() {

}

function changeAusdruck(){
  ausdruck = inpAusdruck.value();
}

function ausdruckErzeugen(){


  createP(ausdruckFalsch);

}


function startAnimation(){

  var eingabeStackTest = ausdruckFalsch;
  var kellerStack = "";
  generateSteps("1", eingabeStackTest, kellerStack, []);
  formattedEntries = formatTableEntryArray(allMoves);

  drawTableEntries();
  interval = setInterval(drawTableEntries, pauseTime);

}


function changePauseTime() {
  if (inpTime.value() != ""){
    pauseTime = inpTime.value() *1000;
  }
}



//Paints the arrow green or black based on table entry
//This is useful for animating the selected arrow and erasing the selection
function drawArrowAnimation(green){

  var tableEntry = formattedEntries[arrowCounter];

  strokeWeight(0.9);

  if (green){
    stroke(0,255,0);
  } else {
    if(arrowCounter == 1){
      return;
    }
    tableEntry = formattedEntries[arrowCounter -2];

    stroke(0,0,0);
  }

  //Jede Kante lässt sich durch folgende 3 Werte identifizieren :
  //In welchem Zustand befinden wir uns und was wird aus der eingabe und dem keller konsumiert
  var startZustand = tableEntry[0];
  var eingabe = tableEntry[1];
  var keller = tableEntry[2];
  var zielZustand = tableEntry[3];

  if (startZustand == "1" && eingabe == "ε" && keller == "ε" && zielZustand == "2"){
      //Kante ε,ε -> $ von Zustand 1 zu 2
      beginShape();
      vertex(65, 250);
      vertex(120, 250);
      vertex(115, 245);
      vertex(120, 250);
      vertex(115, 255);
      vertex(120, 250);
      endShape();
  } else if (startZustand == "2" && eingabe == "(" && keller == "ε" && zielZustand == "2"){
      //Kante (, ε -> ( von Zustand 2 zu 2
      line(125, 240, 90, 190);
      line(90, 190, 135, 190);
      beginShape();
      vertex(135, 190);
      vertex(135, 230);
      vertex(130, 225);
      vertex(135, 230);
      vertex(140, 225);
      vertex(135, 230);
      endShape();
  } else if (startZustand == "2" && eingabe == ")" && keller == "(" && zielZustand == "2"){
      //Kante ),( -> ε von Zustand 2 zu 2
      line(150, 190, 195, 190);
      line(195, 190, 165, 240);
      beginShape();
      vertex(150, 190);
      vertex(150, 230);
      vertex(145, 225);
      vertex(150, 230);
      vertex(155, 225);
      vertex(150, 230);
      endShape();
  } else if (startZustand == "2" && zahlen.includes(eingabe) && keller == "ε" && zielZustand == "3"){
      //Kante x ϵ {0, .., 9}, ε -> ε von Zustand 2 zu 3
      beginShape();
      vertex(175, 245);
      vertex(325, 245);
      vertex(320, 240);
      vertex(325, 245);
      vertex(320, 250);
      vertex(325, 245);
      endShape();
  } else if (startZustand == "3" && operationen.includes(eingabe) && keller == "ε" && zielZustand == "2"){
      //Kante x ϵ {+, .., /}, ε -> ε von Zustand 3 zu 2
      beginShape();
      vertex(325, 255);
      vertex(175, 255);
      vertex(180, 250);
      vertex(175, 255);
      vertex(180, 260);
      vertex(175, 255);
      endShape();
  } else if (startZustand == "3" && eingabe == "(" && keller == "ε" && zielZustand == "3"){
      //Kante (, ε -> ( von Zustand 3 zu 3
      line(330, 240, 295, 190);
      line(295, 190, 340, 190);
      beginShape();
      vertex(340, 190);
      vertex(340, 230);
      vertex(335, 225);
      vertex(340, 230);
      vertex(345, 225);
      vertex(340, 230);
      endShape();
  } else if (startZustand == "3" && eingabe == ")" && keller == "(" && zielZustand == "3"){
      //Kante ),( -> ε von Zustand 3 zu 3
      line(355, 190, 400, 190);
      line(400, 190, 370, 240);
      beginShape();
      vertex(355, 190);
      vertex(355, 230);
      vertex(350, 225);
      vertex(355, 230);
      vertex(360, 225);
      vertex(355, 230);
      endShape();
  } else if (startZustand == "2" && zahlen.includes(eingabe) && keller == "ε" && zielZustand == "6"){

      console.log("I was here");
      //Kante x ϵ {0, .., 9}, ε -> ε von 2 zu 6
      line(170, 242, 245, 120);
      beginShape();
      vertex(245, 120);
      vertex(325, 120);
      vertex(320, 115);
      vertex(325, 120);
      vertex(320, 125);
      vertex(325, 120);
      endShape();
  } else if (startZustand == "6" && zahlen.includes(eingabe) && keller == "ε" && zielZustand == "3"){
      //Kante x ϵ {0, .., 9}, ε -> ε von 6 zu 3
      line(375, 120, 475, 120);
      line(475, 120, 475, 250);
      beginShape();
      vertex(475, 250);
      vertex(375, 250);
      vertex(380, 245);
      vertex(375, 250);
      vertex(380, 255);
      vertex(375, 250);
      endShape();
  } else if (startZustand == "3" && operationen.includes(eingabe) && keller == "ε" && zielZustand == "7"){
      //Kante x ϵ {+, .., /}, ε -> ε von 3 zu 7
      line(350, 275, 390, 350);
      beginShape();
      vertex(390, 350);
      vertex(275, 350);
      vertex(280, 345);
      vertex(275, 350);
      vertex(280, 355);
      vertex(275, 350);
      endShape();
  } else if (startZustand == "7" && eingabe == "(" && keller == "ε" && zielZustand == "7"){
      //Kante (, ε -> ( von 7 nach 7
      line(265, 370, 290, 410);
      line(290, 410, 210, 410);
      beginShape();
      vertex(210, 410);
      vertex(235, 370);
      vertex(230, 370);
      vertex(235, 370);
      vertex(235, 375);
      vertex(235, 370);
      endShape();
  } else if (startZustand == "7" && plusMinus.includes(eingabe) && keller == "ε"  && zielZustand == "2"){
      //Kante x ϵ {+, -}, ε -> ε von 7 zu 2
      line(225, 350, 110, 350);
      beginShape();
      vertex(110, 350);
      vertex(140, 275);
      vertex(135, 280);
      vertex(140, 275);
      vertex(142, 280);
      vertex(140, 275);
      endShape();
  } else if (startZustand == "2" && eingabe == "ε" && keller == "$" && zielZustand == "5"){
      //Kante ε, $ -> ε von 2 zu 5
      beginShape();
      vertex(130, 270);
      vertex(60, 380);
      vertex(60, 375);
      vertex(60, 380);
      vertex(65, 380);
      vertex(60, 380);
      endShape();
  } else if (startZustand == "3" && eingabe == "ε" && keller == "$" && zielZustand == "4"){
      //Kante ε, $ -> ε von 3 zu 4
      beginShape();
      vertex(368, 268);
      vertex(480, 380);
      vertex(480, 375);
      vertex(480, 380);
      vertex(475, 380);
      vertex(480, 380);
      endShape();
  }

  if(green){
    arrowCounter = arrowCounter +1;
  }


  if (arrowCounter == formattedEntries.length){
    clearInterval(interval);
  }



}


function drawTableEntries() {

  stroke(0,0,0);
  strokeWeight(0.1);

  if(formattedEntries[entryCounter][4].length < 2){

    text(formattedEntries[entryCounter][0], 620, tableHeight);
    text(formattedEntries[entryCounter][1], 660, tableHeight);
    text(formattedEntries[entryCounter][2], 700, tableHeight);
    text(formattedEntries[entryCounter][3], 740, tableHeight);
    text(formattedEntries[entryCounter][4], 780, tableHeight);


  } else if (formattedEntries[entryCounter][4] == "ungültig"){

    stroke(255,0,0);
    strokeWeight(0.4);
    text("ungültig", 740, tableHeight);

    tableHeight = tableHeight +5;

  } else {

    stroke(0,255,0);
    strokeWeight(0.4);
    text("gültig", 740, tableHeight);

    tableHeight = tableHeight +5;
  }

  drawArrowAnimation(true);
  drawArrowAnimation(false);

  tableHeight = tableHeight +15;
  entryCounter = entryCounter +1;

  if (entryCounter == formattedEntries.length){
    clearInterval(interval);
  }
}






function test() {
  console.log("Hallo");
}

//Hilffunktion für Animationsgeschwindigkeit
function delay(func){
  setTimeout(() => {func();}, 2000);
}

//Tabelle zeichnen
function drawTable() {

  stroke(0,0,0);
  strokeWeight(1);

  line(600, 120, 800, 120);
  line(725, 100, 725, 450);

  strokeWeight(0.2);
  text("Überführungsfunktion δ", 600, 80);

  strokeWeight(0.2);
  text("Q", 620, 110);
  text("Σ", 660, 110);
  text("Γ", 700, 110);
  text("Q", 740, 110);
  text("Γ", 780, 110);

}



//Hilffunktion für Animationsgeschwindigkeit
function delay(func){
  setTimeout(func(), pauseTime);
}

//Legende zeichnen
function legende(){
  strokeWeight(0.2);
  text("Q (links) = Startzustand, Σ = Eingabe, Γ (links) = wird konsumiert aus keller, \nQ (rechts) = Endzustand, Γ (rechts) = wird in keller geschrieben", 900, 280);
}


//hier formatieren wir das 3-dimensionale Array
//zu einem 2-dimensionalen
//Jedes Element ist ein Array mit den 5 Elementen 
//Für einen Tabelleneintrag
function formatTableEntryArray(tableEntries) {

  var tableEntriesList = [];

  for (let i = 0; i < tableEntries.length; i++){
    for (let j = 0; j < tableEntries[i].length; j++){
      tableEntriesList.push(tableEntries[i][j]);
    }
  }

  return tableEntriesList;

}











//Deleting last character of String
function deleteLastCharacter(aString) {
  return aString.slice(0, aString.length -1);
}

//Deleting first character of String
function deleteFirstCharacter(aString) {
  return aString.slice(1, aString.length);
}

//Pushing character onto String
function pushCharacter(aString, aCharacter){
  return aString + aCharacter;
}


function generateSteps(zustand, eingabeStack, kellerStack, entries) {

  var eingabe = eingabeStack.charAt(0);

  var keller = kellerStack.charAt(kellerStack.length -1);

  var nächsterZustandUndKeller = nextStep(zustand, eingabe, keller);


  console.log(eingabeStack);




  //ungültiger Zustand
  if(nächsterZustandUndKeller[0] == "ungültig"){

    entries.push(["", "", "", "", "ungültig"]);
    allMoves.push(entries);
    return;
  }

  //gültiger Zustand
  if(nächsterZustandUndKeller[0] == "gültig"){

    entries.push(["", "", "", "", "gültig"]);
    allMoves.push(entries);
    return;
  }

  //Falls die Eingabe leer ist und wir keinen gültigen Zustand erreicht haben
  //ist der Zustand ungültig
  if(eingabeStack == "" && kellerStack == "" && (zustand == "4" || zustand == "5")){
    
    entries.push(["", "", "", "", "gültig"]);
    allMoves.push(entries);
    return;
  } else if (eingabeStack == "" && kellerStack != "$") {

    entries.push(["", "", "", "", "ungültig"]);
    allMoves.push(entries);
    return;
  }


  //Falls 2 Kanten möglich sind, müssen wir hier 2 rekursive Aufrufe tätigen
  if(nächsterZustandUndKeller.length == 4){

    //Zustände

    //nächster Zustand 1
    var zustand1 = nächsterZustandUndKeller[0];

    //nächster Zustand 2
    var zustand2 = nächsterZustandUndKeller[2];


    //elemente konsumieren aus eingabeStack und kellerStack

    //return value von konsumieren : [boolean1, boolean2] 
    //oder [boolean1, boolean2, boolean3, boolean4]
    //boolean1 == true bedeutet eingabe konsumieren
    //boolean2 == true bedeutet keller konsumieren
    var konsum = konsumieren(zustand, eingabe, keller);


    var eingabe1 = eingabe;
    var eingabe2 = eingabe;

    var keller1 = keller;
    var keller2 = keller;

    var eingabeStack1 = eingabeStack;
    var eingabeStack2 = eingabeStack;

    var kellerStack1 =  kellerStack;
    var kellerStack2 = kellerStack;

    //eingabe der ersten Kante konsumieren
    if(konsum[0]){
      eingabeStack1 = deleteFirstCharacter(eingabeStack);
    } else {
      eingabe1 = "ε";
    }

    //keller der ersten Kante konsumieren
    if(konsum[1]){
      kellerStack1 = deleteLastCharacter(kellerStack);
    } else {
      keller1 = "ε";
    }

    //eingabe der zweiten Kante konsumieren
    if(konsum[2]){
      eingabeStack2 = deleteFirstCharacter(eingabeStack);
    } else {
      eingabe2 = "ε";
    }

    //keller der zweiten Kante konsumieren
    if(konsum[3]){
      kellerStack2 = deleteLastCharacter(kellerStack);
    } else {
      keller2 = "ε";
    }

    console.log("eingabeStack1: " +eingabeStack1);
    console.log("eingabeStack2: " +eingabeStack2);

    //kellerStack character hinzufügen

    kellerStack1 = kellerStack1 + nächsterZustandUndKeller[1];
    kellerStack2 = kellerStack2 + nächsterZustandUndKeller[3];

    console.log("kellerStack1: " +kellerStack1);
    console.log("kellerStack2: " +kellerStack2);

    //Tabelleneinträge vermerken

    var kellerEintrag1 = nächsterZustandUndKeller[1];

    if(kellerEintrag1 == ""){
      kellerEintrag1 = "ε";
    }

    var kellerEintrag2 = nächsterZustandUndKeller[3];

    if(kellerEintrag2 == ""){
      kellerEintrag2 = "ε";
    }

    //1. Kante
    entries.push([zustand, eingabe1, keller1, nächsterZustandUndKeller[0], kellerEintrag1]);

    //1. rekursiver Aufruf
    generateSteps(zustand1, eingabeStack1, kellerStack1, entries);

    //2.Kante
    var entries2 = [];

    entries2.push([zustand, eingabe2, keller2, nächsterZustandUndKeller[2], kellerEintrag2]);


    generateSteps(zustand2, eingabeStack2, kellerStack2, entries2);

  } 

  //Der letzte Fall ist, dass nur eine Kante möglich ist
  else if(nächsterZustandUndKeller.length == 2) {

    //nächster Zustand
    var zustand1 = nächsterZustandUndKeller[0];

    //elemente konsumieren

    //return value von konsumieren : [boolean1, boolean2] 
    //boolean1 == true bedeutet eingabe konsumieren
    //boolean2 == true bedeutet keller konsumieren
    var konsum = konsumieren(zustand, eingabe, keller);

 

    var eingabeStack1 = eingabeStack;
    var kellerStack1 = kellerStack;

    //eingabe konsumieren
    if(konsum[0]){
      eingabeStack1 = deleteFirstCharacter(eingabeStack1);
      console.log(eingabeStack1);
    } else {
      eingabe = "ε";
    }

    //keller konsumieren
    if(konsum[1]){
      kellerStack1 = deleteLastCharacter(kellerStack1);
    } else {
      keller = "ε";
    }

    //kellerStack character hinzufügen

    kellerStack1 = kellerStack1 + nächsterZustandUndKeller[1];

    //Tabelleneintrag

    var kellerEintrag = nächsterZustandUndKeller[1];

    if(kellerEintrag == ""){
      kellerEintrag = "ε";
    }

    entries.push([zustand, eingabe, keller, nächsterZustandUndKeller[0], kellerEintrag]);

    //rekursiver Aufruf
    generateSteps(zustand1, eingabeStack1, kellerStack1, entries);

  }


}

//return value: [boolean1, boolean2]
//boolean1 == true bedeutet eingabe konsumieren
//boolean2 == true bedeutet keller konsumieren
function konsumieren(startZustand, eingabe, keller){
  if(startZustand == "1"){
    return [false, false];
  }
  if(startZustand == "2"){
    if(eingabe == "("){
      //konsumiere "(" todo aus eingabe
      return [true, false];
    } else if (eingabe == ")" && keller == "("){
      //konsumiere ")" aus eingabe und "(" aus keller
      return [true, true];
    } else if (keller == "$"){
      //konsumiere $ aus keller
      return [false, true];
    } else if (zahlen.includes(eingabe)){
      //konsumiere zahl aus eingabe
      //Wir gehen hier in 2 Zustände indem wir ein array länge 4 zurückgeben!
      return [true, false, true, false];
    } else {
      return ["ungültig"];
    }
  }

  if(startZustand == "3"){
    if(eingabe == "("){
      //konsumiere "(" aus eingabe
      return [true, false];
    } else if (eingabe == ")" && keller == "("){
      //konsumiere ")" aus eingabe und "(" aus keller
      return [true, true];
    } else if (keller == "$"){
      //konsumiere $ aus keller
      return [false, true];
    } else if (operationen.includes(eingabe)){
      //konsumiere operation aus eingabe
      //Wir gehen hier in 2 Zustände indem wir ein array länge 4 zurückgeben!
      return [true, false, true, false];
    }
  }

  if(startZustand == "4"){
    //Wenn die Eingabe ein leerer String ist und wir uns in Zustand 4 befinden
    //akzeptieren wir das Wort
    if(eingabe == ""){
      return ["gültig"];
    } else {
      return ["ungültig"];
    }
  }

  if(startZustand == "5"){
    //Wenn die Eingabe ein leerer String ist und wir uns in Zustand 5 befinden
    //akzeptieren wir das Wort
    if(eingabe == ""){
      return ["gültig"];
    } else {
      return ["ungültig"];
    }
  }

  //Beschreibt das Szenario indem eine Operation zwischen zwei Zahlen
  //gelöscht wird. Es entsteht eine neue Zahl. Des Ausdruck ist gültig.
  //Wir lassen den Automaten aber noch zu Ende laufen
  if(startZustand == "6"){
    if(zahlen.includes(eingabe)){
      //konsumiere zahl aus eingabe
      return [true, false];
    } else {
      return ["ungültig"]
    }
  }

  //Beschreibt das Szenario indem eine Zahl vor einem minus oder plus
  //gelöscht wird. Es entsteht eine negative oder positive Zahl. 
  //Des Ausdruck ist gültig.
  //Wir lassen den Automaten aber noch zu Ende laufen
  if(startZustand == "7"){
    if(plusMinus.includes(eingabe)){
      //konsumiere operation aus eingabe
      return [true, false];
    } else if (eingabe = "("){
      //konsumiere "(" aus eingabe
      return [true, false];
    } else {
      return ["ungültig"]
    }
  }
}








//Zeichnung des Automats mit allen Zuständen und Kanten
function drawAutomat(){

  //Zustand 1
  drawState(40, 250, "1");

  //Kante e,e -> $ von Zustand 1 zu 2
  stroke(0,0,0);
  beginShape();
  vertex(65, 250);
  vertex(120, 250);
  vertex(115, 245);
  vertex(120, 250);
  vertex(115, 255);
  vertex(120, 250);
  endShape();

  strokeWeight(0.1);
  text("ε, ε -> $", 70, 240);

  //Zustand 2
  drawState(145, 250, "2");

  //Kante (, ε -> ( von Zustand 2 zu 2
  stroke(0,0,0);
  line(125, 240, 90, 190);
  line(90, 190, 135, 190);
  beginShape();
  vertex(135, 190);
  vertex(135, 230);
  vertex(130, 225);
  vertex(135, 230);
  vertex(140, 225);
  vertex(135, 230);
  endShape();

  strokeWeight(0.2);
  text("(, ε -> (", 95, 182);

  //Kante ),( -> ε von Zustand 2 zu 2
  strokeWeight(1);

  line(150, 190, 195, 190);
  line(195, 190, 165, 240);

  beginShape();
  vertex(150, 190);
  vertex(150, 230);
  vertex(145, 225);
  vertex(150, 230);
  vertex(155, 225);
  vertex(150, 230);
  endShape();

  strokeWeight(0.2);
  text("), ( -> ε", 155, 182);

  //Zustand 3
  drawState(350, 250, "3");

  //Kante x ϵ {0, .., 9}, ε -> ε von Zustand 2 zu 3
  stroke(0,0,0);
  beginShape();
  vertex(175, 245);
  vertex(325, 245);
  vertex(320, 240);
  vertex(325, 245);
  vertex(320, 250);
  vertex(325, 245);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {0, .., 9}, ε -> ε", 200, 239);

  //Kante x ϵ {+, .., /}, ε -> ε von Zustand 3 zu 2
  strokeWeight(1);
  stroke(0,0,0);
  beginShape();
  vertex(325, 255);
  vertex(175, 255);
  vertex(180, 250);
  vertex(175, 255);
  vertex(180, 260);
  vertex(175, 255);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {+, .., /}, ε -> ε", 205, 269);



  //Kante (, ε -> ( von Zustand 3 zu 3
  strokeWeight(1);
  stroke(0,0,0);
  line(330, 240, 295, 190);
  line(295, 190, 340, 190);
  beginShape();
  vertex(340, 190);
  vertex(340, 230);
  vertex(335, 225);
  vertex(340, 230);
  vertex(345, 225);
  vertex(340, 230);
  endShape();

  strokeWeight(0.2);
  text("(, ε -> (", 300, 182);

  //Kante ),( -> ε von Zustand 2 zu 2
  strokeWeight(1);

  line(355, 190, 400, 190);
  line(400, 190, 370, 240);

  beginShape();
  vertex(355, 190);
  vertex(355, 230);
  vertex(350, 225);
  vertex(355, 230);
  vertex(360, 225);
  vertex(355, 230);
  endShape();

  strokeWeight(0.2);
  text("), ( -> ε", 360, 182);
  
  //Zustand 6
  drawState(350, 120, "6");

  //Kante x ϵ {0, .., 9}, ε -> ε von 2 zu 6
  stroke(0,0,0);
  beginShape();

  line(170, 242, 245, 120);

  vertex(245, 120);
  vertex(325, 120);
  vertex(320, 115);
  vertex(325, 120);
  vertex(320, 125);
  vertex(325, 120);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {0, .., 9}, ε -> ε", 235, 110);

  //Kante x ϵ {0, .., 9}, ε -> ε von 6 zu 3
  stroke(0,0,0);
  strokeWeight(1);

  line(375, 120, 475, 120);
  line(475, 120, 475, 250);

  beginShape();
  vertex(475, 250);
  vertex(375, 250);
  vertex(380, 245);
  vertex(375, 250);
  vertex(380, 255);
  vertex(375, 250);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {0, .., 9}, ε -> ε", 380, 110);

  //Zustand 7
  drawState(250, 350, "7");

  //Kante x ϵ {+, .., /}, ε -> ε von 3 zu 7
  stroke(0,0,0);
  strokeWeight(1);

  line(350, 275, 390, 350);

  beginShape();
  vertex(390, 350);
  vertex(275, 350);
  vertex(280, 345);
  vertex(275, 350);
  vertex(280, 355);
  vertex(275, 350);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {+, .., /}, ε -> ε", 295, 365);

  //Kante (, ε -> ( von 7 nach 7
  stroke(0,0,0);
  strokeWeight(1);
  
  line(265, 370, 290, 410);
  line(290, 410, 210, 410);

  beginShape();
  vertex(210, 410);
  vertex(235, 370);
  vertex(230, 370);
  vertex(235, 370);
  vertex(235, 375);
  vertex(235, 370);
  endShape();

  strokeWeight(0.1);
  text("(, ε -> (", 230, 425);

  //Kante x ϵ {+, -}, ε -> ε von 7 zu 2
  stroke(0,0,0);
  strokeWeight(1);

  line(225, 350, 110, 350);

  beginShape();
  vertex(110, 350);
  vertex(140, 275);
  vertex(135, 280);
  vertex(140, 275);
  vertex(142, 280);
  vertex(140, 275);
  endShape();

  strokeWeight(0.1);
  text("x ϵ {+, -}, ε -> ε", 130, 340);

  //Zustand 7
  stroke(0,0,0);
  //Endszustand markieren
  strokeWeight(10);
  ellipse(40, 400, 40, 40);
  strokeWeight(1);

  drawState(40, 400, "5");


  //Kante ε, $ -> ε von 2 zu 5
  stroke(0,0,0);
  strokeWeight(1);

  beginShape();
  vertex(130, 270);
  vertex(60, 380);
  vertex(60, 375);
  vertex(60, 380);
  vertex(65, 380);
  vertex(60, 380);
  endShape();

  strokeWeight(0.1);
  text("ε, $ -> ε", 30, 340);

  //Zustand 4
  stroke(0,0,0);
  //Endszustand markieren
  strokeWeight(10);
  ellipse(500, 400, 40, 40);
  strokeWeight(1);

  drawState(500, 400, "4");

  //Kante ε, $ -> ε von 3 zu 4
  stroke(0,0,0);
  strokeWeight(1);

  beginShape();
  vertex(368, 268);
  vertex(480, 380);
  vertex(480, 375);
  vertex(480, 380);
  vertex(475, 380);
  vertex(480, 380);
  endShape();

  strokeWeight(0.1);
  text("ε, $ -> ε", 450, 340);

}





//Hilfsfunktion um einen Zustand zu zeichnen
function drawState(x, y, zustandName){
  stroke(255,255,255);
  //Möglicherweise in eigene Funktion bringen
  if(zustandName == jetzigerZustand) {
    strokeWeight(1.75);
    stroke(0,255,0);
  }
  //
  ellipse(x, y, 40, 40);

  strokeWeight(1);
  stroke(255,255,255);
  text(zustandName, x-4, y+4);
}



//einen Character in ausdruck löschen
function createWrongExpression(){
  return ausdruck.replace(ausdruck.charAt(Math.floor(Math.random() * ausdruck.length)), '');
}

//Von einem Zustand zum nächsten bewegen,
//abhängig von Zustand, eingabe und keller

//Wenn wir eingabe = "" übergeben ist die Eingabe leer

//Der Rückgabewert ist entweder 
//["2", "("], als Beispiel für den nächsten Zustand und eintrag in den Kellerautomaten
//["2", ")", "3", "("], als Beispiel für 2 Zustände (es werden 2 Kanten benutzt)
//["ungültig"] für es gibt keine mögliche Kante
//["gültig"] für ein gültiges Wort
function nextStep(startZustand, eingabe, keller){
  if(startZustand == "1"){
    return ["2", "$"];
  }
  if(startZustand == "2"){
    if(eingabe == "("){
      //konsumiere "(" todo
      return ["2", "("];
    } else if (eingabe == ")" && keller == "("){
      //konsumiere ")" aus eingabe und "(" aus keller
      return ["2", ""];
    } else if (keller == "$"){
      //konsumiere $ aus keller
      return ["5", ""];
    } else if (zahlen.includes(eingabe)){
      //konsumiere zahl aus eingabe
      //Wir gehen hier in 2 Zustände indem wir ein array länge 4 zurückgeben!
      return ["3", "", "6", ""];
    } else {
      return ["ungültig"];
    }
  }

  if(startZustand == "3"){
    if(eingabe == "("){
      //konsumiere "(" todo
      return ["3", "("];
    } else if (eingabe == ")" && keller == "("){
      //konsumiere ")" aus eingabe und "(" aus keller
      return ["3", ""];
    } else if (keller == "$"){
      //konsumiere $ aus keller
      return ["4", ""];
    } else if (operationen.includes(eingabe)){
      //konsumiere operation aus eingabe
      //Wir gehen hier in 2 Zustände indem wir ein array länge 4 zurückgeben!
      return ["2", "", "7", ""];
    } else {
      return ["ungültig"];
    }
  }

  if(startZustand == "4"){
    //Wenn die Eingabe ein leerer String ist und wir uns in Zustand 4 befinden
    //akzeptieren wir das Wort
    if(eingabe == ""){
      return ["gültig"];
    } else {
      return ["ungültig"];
    }
  }

  if(startZustand == "5"){
    //Wenn die Eingabe ein leerer String ist und wir uns in Zustand 5 befinden
    //akzeptieren wir das Wort
    if(eingabe == ""){
      return ["gültig"];
    } else {
      return ["ungültig"];
    }
  }

  //Beschreibt das Szenario indem eine Operation zwischen zwei Zahlen
  //gelöscht wird. Es entsteht eine neue Zahl. Des Ausdruck ist gültig.
  //Wir lassen den Automaten aber noch zu Ende laufen
  if(startZustand == "6"){
    if(zahlen.includes(eingabe)){
      //konsumiere zahl aus eingabe
      return ["3", ""];
    } else {
      return ["ungültig"]
    }
  }

  //Beschreibt das Szenario indem eine Zahl vor einem minus oder plus
  //gelöscht wird. Es entsteht eine negative oder positive Zahl. 
  //Des Ausdruck ist gültig.
  //Wir lassen den Automaten aber noch zu Ende laufen
  if(startZustand == "7"){
    if(plusMinus.includes(eingabe)){
      //konsumiere operation aus eingabe
      return ["2", ""];
    } else if (eingabe == "("){
      //konsumiere "(" aus eingabe
      return ["7", "("];
    } else {
      return ["ungültig"]
    }
  }

}















//Wir benutzen die folgende Funktion um einen Ausdruck zu erzeugen
//Dieser wird in "ausdruck" gespeichert

//Rekursive Funktion, welche Mathematische Ausdrücke
//und die Überführungsregeln generiert und in Listen speichert
function expand(start, expansion){

  //Wir rufen die Funktion nur auf, falls sich start als key 
  //in unserem dictionary rules befindet
  if (rules[start]){
    //Hier verhindern wir zu große Ausdrücke indem wir nach einer bestimmten 
    //Rekurstionstiefe immer die Regel A -> Z für A anwenden
    expansionCount++;
    if (expansionCount >= maxExpansions && start == "A"){
      regelListe.push(start + " -> Z");
      ausdruck = ausdruck.replace(start, "Z");
      ausdruckListe.push(ausdruck);
      expand("Z", expansion);
      return;}
    //Wir wählen zufällig ein Unterarray (von den Arrays "A", "O" oder "Z") aus
    //und vermerken die angewandte Regel in der regelListe
    var pick = random(rules[start]);
    regelListe.push(start + " -> " + pick.join(" "));

    //Unser Ausdruck wächst und verändert sich mit angewandten Regeln
    //Wir speichern jeden veränderten Ausdruck in der Ausdruckliste
    ausdruck = ausdruck.replace(start, pick.join(" "));
    ausdruckListe.push(ausdruck);

    //Falls wir ["A", "O", "A"] oder ["(", "A", "O", "A", ")"], expandieren wir
    //jedes Element
    for (var i = 0; i < pick.length; i++){
      expand(pick[i], expansion);
    }
  } else {
    //Falls start keiner der Ausdrücke "A", "O" oder "Z" ist,
    //fügen wir ihn der expansion zu
    expansion.push(start);
  }
  return;
}