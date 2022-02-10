import processing.javafx.*;


TrackerClient tracker;

float toSize = 150;
float oSize = 20;

boolean hideCursor = false;

boolean useSmoothRotation = true;
boolean useSmoothPosition = true;

Table table;
float space;
int numEntries;


float tNow;
float tPred;
float sNow;
float sPred;
float aNow;
float tPot;
float sPot;
float aPred;
float aPot;
float posT;
float posS;
float posA;
float rotationS;
float rotationT;
float rotationI;
float positionX;
float positionY;
float positionXi;
float positionYi;
int id;
float ppmS;
float ppmT;
float CoordXs;
float CoordYs;
float CoordXt;
float CoordYt;
float CoordXa;
float CoordYa;
boolean circleS = false;
boolean circleT = false;
boolean circleA = false;
boolean textI = false;
String coordinates;
float latLong;
PImage ppm;
PImage temp;
PImage scale;
//PShape background;
PImage background;
PImage info1;
PImage info2;
PImage info3;
PImage info4;
PImage info;
PImage biomes;
int id1 = 1; //info
int id2 = 2; //tree
int id3 = 3; //soil




void setup() {
  size(2560, 1600, FX2D);
  colorMode(HSB, 360, 100, 100, 100);

  // fullScreen(FX2D);
  background(0, 0, 100, 0);

  tracker = new TrackerClient(8002);

  if (hideCursor)
    noCursor();

  table = loadTable("data.csv", "header");
  numEntries = table.getRowCount();
  //println(numEntries + " total rows in table");


  background = loadImage("background.png");
  scale = loadImage("scale.png");
   temp = loadImage("temp.png");
  ppm = loadImage("ppm.png");
  info1 = loadImage("soilcarbon_middle.png");
  info2 = loadImage("climateconditions_middle.png");
  info3 = loadImage("extracteddata_middle.png");
  info4 = loadImage("biodiversity_middle.png");
  info = loadImage("no_selection.png");
  biomes = loadImage("biomes.png");
}


void draw() {
  background(0, 0, 0, 0);
  noStroke();


  imageMode(CORNER);
  image(background, 0, 0, width, height);
  image(scale, width/100, (height/2)- height/5.5,70,550);



  future();
  today();



  for (TactileObject to : tracker.getTactileObjects()) {
    to.update();
    drawTactileObject(to);
  }
}



void future() {

  push();
  translate(63, 0);

  float spaceRight = width/8.18;
  float spaceLeft = width-width/4.63;
  float middle = (height/2)- height/5.5;
  float spaceMiddle = height/200;

  fill(0, 0, 0, 100);




  // tree graph

  beginShape();

  vertex( spaceRight, middle -spaceMiddle);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    tPot = table.getRow(i).getFloat("Tree GtC potential");
    tPred = table.getRow(i).getFloat("Tree GtC prediction");

    float mtPot = map(tPot, 0, 19, 0, width/10);
    float mtPred = map(tPred, 0, 19, 0, width/14);

    float tP = map( rotationT, 0, 360, mtPred, mtPot);
    aPot = tP;
    ppmT = map(rotationT, 0, 360, 61.6, -86.4);

    float xCoord = space;
    float yCoord = middle -spaceMiddle- tP;
    space = xCoord +(height/110);


    vertex(xCoord, yCoord);


    PVector graphPointPosition = new PVector(xCoord, 0);
    PVector tokenOfInterest = new PVector(positionXi, 0);
    if ( circleT == false) {
      if (graphPointPosition.dist(tokenOfInterest) < 3) {
        CoordXt = xCoord;
        CoordYt = yCoord;
        circleT = true;
      }
    }
  }
  vertex( spaceLeft, middle-spaceMiddle);
  endShape();








  // soil graph

  beginShape();

  vertex( spaceRight, middle+spaceMiddle);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    sPot = table.getRow(i).getFloat("Soil GtC potential");
    sPred = table.getRow(i).getFloat("Soil GtC prediction");

    float msPot = map(sPot, 0, 150, 0, width/2.85); 
    float msPred = map(sPred, 0, 150, 0, width/2.25);

    float sP = map( rotationS, 0, 360, msPred, msPot);
    aPred = sP;
    ppmS = map(rotationS, 0, 360, -73.2, 69.4);

    float xCoord = space ;
    float yCoord = middle + sP +spaceMiddle;
    space = xCoord+height/110;


    vertex(xCoord, yCoord);


    PVector graphPointPosition = new PVector(xCoord, 0);
    PVector tokenOfInterest = new PVector(positionXi, 0);
    if ( circleS == false) {
      if (graphPointPosition.dist(tokenOfInterest) < 3) {
        CoordXs = xCoord;
        CoordYs = yCoord;
        circleS = true;
      }
    }
  }
  vertex( spaceLeft, middle+spaceMiddle);
  endShape();









  // air graph

  beginShape();

  vertex( spaceRight, 0);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    aNow = table.getRow(i).getFloat("Mapped Air GtC now");

    //float maPred = map(aPred, 3.7, 4, -width/90, width/900);
    //float maPot = map(aPot, 3, 6, -width/90, width/900);
    //float maNow = map(aNow, 3, 9, width/300, width/40);
    //float Now = map(maNow, width/300, width/40, 0, maPred);
    //float Now2 = map(maNow, width/300, width/40, 0, maPot);

    //float xCoord = space ;
    //float yCoord = 0 + maNow -Now- Now2 ;
    //space = xCoord+height/110;

    float maPred = map(aPred, 3.7, 4.5, -15, 15);
    float maPot = map(aPot, 4, 9, -15, 15);
    float maNow = map(aNow, 3, 9, 3, 54);
    float Now = map(maNow, 3, 54, 0, maPred);
    float Now2 = map(maNow, 3, 54, 0, maPot);



    float xCoord = space ;
    float yCoord = 0 + maNow - Now - Now2 ;
    space = xCoord+height/110;


    vertex(xCoord, yCoord);


    PVector graphPointPosition = new PVector(xCoord, 0);
    PVector tokenOfInterest = new PVector(positionXi, 0);
    if ( circleA == false) {
      if (graphPointPosition.dist(tokenOfInterest) < 3) {
        CoordXa = xCoord;
        CoordYa = yCoord;
        circleA = true;
      }
    }
  }
  vertex( spaceLeft, 0);
  endShape();


  pop();


  // text data out of table

  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    float xCoord = space ;
    space = xCoord+height/110;

    PVector graphPointPosition = new PVector(xCoord, 0);
    PVector tokenOfInterest = new PVector(positionXi, 0);

    if ( textI == false) { 
      if (graphPointPosition.dist(tokenOfInterest) < 3) {
        coordinates = table.getRow(i).getString("Biomes");
        latLong = map(xCoord, spaceRight, spaceLeft, -90, 90);
        textI = true;
      }
    }
  }



  //ppm monitor

  fill(0, 0, 100, 50);
  float ppmCalc = 369 + ppmT +ppmS;
  float sizePPM = map(ppmCalc, 0, 500, 1, 170);

  circle( width/6, height - height/6+1, sizePPM); 



  //temperature monitor

  float colorPPM = map(ppmCalc, 0, 500, 270, 40);
  fill(colorPPM, 100, 100, 100);
  float numPPM = map(ppmCalc,0, 500,-1,2);
int numPPMr = round(numPPM);

stroke(0,0,100,100);
circle( width/3.3, height - height/6, 170);

fill(0,0,100,100);
textSize(50);
text("+" +numPPMr+ "°C" , width/3.8, height - height/6+18);
  
}









void today() {

  push();
  translate(63, 0);

  float spaceRight = width/8.18;
  float spaceLeft = width-width/4.63;
  float middle = (height/2)- height/5.5;
  float spaceMiddle = height/200;

  fill(0, 0, 70, 50);




  // tree graph static

  beginShape();
  vertex( spaceRight, middle-spaceMiddle);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    tNow = table.getRow(i).getFloat("Tree GtC now");

    float mtNow = map(tNow, 0, 19, 0, width/14);

    float xCoord = space;
    float yCoord = middle - mtNow -spaceMiddle;
    space = xCoord +height/105;

    vertex(xCoord, yCoord);
  }
  vertex( spaceLeft, middle-spaceMiddle);
  endShape();



  // soil graph static

  beginShape();
  vertex( spaceRight, middle+spaceMiddle);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    sNow = table.getRow(i).getFloat("s");

    float msNow = map(sNow, 0, 150, 0, width/2.5);

    float xCoord = space ;
    float yCoord = middle + msNow +spaceMiddle;
    space = xCoord+height/110;

    vertex(xCoord, yCoord);
  }
  vertex( spaceLeft, middle+spaceMiddle);
  endShape();



  // air graph static

  beginShape();
  vertex( spaceRight, 0);
  space = spaceRight;

  for (int i = 0; i < numEntries; i++) {

    aNow = table.getRow(i).getFloat("Mapped Air GtC now");

    float maNow = map(aNow, 3, 9, width/300, width/20);

    float xCoord = space ;
    float yCoord = 0 + maNow ;
    space = xCoord+height/110;

    vertex(xCoord, yCoord);
  }
  vertex( spaceLeft, 0);
  endShape();




if(id == id1){

  // intersection points
  
  stroke(0, 0, 0, 100);
  fill(0, 0, 100, 100);
  if ( circleT ) {
    circle(CoordXt, CoordYt, 10);
    circleT = false;
  }
  if ( circleS ) {
    circle(CoordXs, CoordYs, 10);
    circleS = false;
  }
  if ( circleA ) {
    circle(CoordXa, CoordYa, 10);
    circleA = false;
  }

 // line

  strokeWeight(1);
  if ((positionXi >  spaceRight) && (positionXi < spaceLeft)) {
    line(positionXi, 0, positionXi, height);
  }
  

  
  
  
}

  pop();



// Biomes

if ((positionXi >  870) && (positionXi < 900)) {
 imageMode(CENTER);
  image(biomes, width/2.15, height - height/6+4, 250,195);
}

//ppm

  imageMode(CENTER);
  image(ppm, width/6, height - height/6+4, 180, 195);
  
  // temp 
  
   imageMode(CENTER);
  image(temp, width/3.3, height - height/6+4, 180, 195);




  // text

  if ( textI ) {

    fill(0, 0, 0, 100);
  //  text(latLong + "°", positionXi+ 100, positionYi);
   // text(coordinates, positionXi+ 100, positionYi + 50);
    textI = false;
  }
}






void drawTactileObject(TactileObject to) {
  // fix mirror (maybe flip with width - term)
  float tox = useSmoothPosition ? to.position.x : to.x;
  float toy = useSmoothPosition ? to.position.y : to.y;

  float x = (tox * width);
  float y = (toy * height);
  float spaceRight = width/8.18;
  float spaceLeft = width-width/5.07;

  float r = radians(360.0 - (useSmoothRotation ? to.smoothRotation : to.rotation));

  // check out of bounds
  if (x < 0 || x >= width || y < 0 || y >= height) {
    drawOutOfBounds(x, y, to.uniqueId);
  }

  // render object

  float hto = toSize * 0.6;

push();
  translate(63, 0);
  
  if (id == id2 || id == id3) {

    ellipseMode(CENTER);
    noFill();
    stroke(255);
    strokeWeight(8);
    circle(x, y, 140);

    // draw rotation
    stroke(255, 0, 0);
    arc(x, y, 140, 140, 0, r);
  }

  if (id == id1) {
    if ((positionXi >  spaceRight) && (positionXi < spaceLeft)) {
      if (rotationI < 91 && rotationI > 0 ) {

        imageMode(CENTER);
        image(info1, x, y, 1000, 1000);
      } else if (rotationI < 180 && rotationI > 90 ) {

        imageMode(CENTER);
        image(info4, x, y, 1000, 1000);
      } else if (rotationI < 271 && rotationI > 180) {
        imageMode(CENTER);
        image(info3, x, y, 1000, 1000);
      } else if (rotationI < 361 && rotationI > 270 ) {

        imageMode(CENTER);
        image(info2, x, y, 1000, 1000);
      }
    } else {
      imageMode(CENTER);
      image(info, x, y, 1000, 1000);
    }
  }

pop();

  push();

  translate(x, y);
  rotate(r);
  translate(hto, hto);
  rotate(radians(45));

  // text
  fill(255);
  textSize(10);
  textAlign(CENTER, CENTER);
 // text(to.uniqueId + " - R: " + round(to.rotation), 0, 0);

  pop();





  // imput for the tokens and data connections

  id = to.uniqueId;
  println(id);

  float posX = to.x;
  float posY = to.y;

  positionX = map(posX, 0, 1, 0, width);
  positionY = map(posY, 0, 1, 0, width);

  //println(positionX);

  if (id == id3) {
    //println("sucess");
    rotationS = to.rotation;
  }
  if (id == id2) {
    //println("sucess");
    rotationT = to.rotation;
  }
  if (id == id1) {
    //println("sucess");
    rotationI = to.rotation;
    positionXi = map(to.x, 0, 1, 0, width);
    positionYi = map(to.y, 0, 1, 0, width);
  }
}


void drawOutOfBounds(float x, float y, int uniqueId) {
  push();
  float rx = constrain(x, 0, width - 1);
  float ry = constrain(y, 0, height - 1);

  translate(rx, ry);

  if (x < 0)
    rotate(radians(90));

  if (x > width)
    rotate(radians(-90));

  if (y < 0)
    rotate(radians(-180));

  float hs = oSize * 0.5;

  rectMode(CENTER);
  noFill();
  stroke(255);
  strokeWeight(3);
  triangle(-hs, -hs, hs, -hs, 0, 0);

  // text
  fill(255);
  textAlign(CENTER, CENTER);
  if ( id == id1) {
    text("more information", 0, -oSize * 1.2);
  }
  if ( id == id2) {
    text("biomass dial", 0, -oSize * 1.2);
  }
  if ( id == id3) {
    text("soilcarbon dial", 0, -oSize * 1.2);
  }

  pop();
}

void mouseClicked() {
  // show and hide cursor if necessary
  if (hideCursor)
    cursor();
  else
    noCursor();

  hideCursor = !hideCursor;
}

void keyPressed() {
  if (key == 'R') {
    useSmoothRotation = !useSmoothRotation;
    println("Smooth Rotation: " + useSmoothRotation);
  }

  if (key == 'P') {
    useSmoothPosition = !useSmoothPosition;
    println("Smooth Position: " + useSmoothPosition);
  }
}

void stop() {
  cursor();
}
