let toSize = 150;
let oSize = 20;
let hideCursor = false;
let useSmoothRotation = true;
let useSmoothPosition = true;
let canvas;
let table;
let space;
let numEntries;
let tNow;
let tPred;
let sNow;
let sPred;
let aNow;
let tPot;
let sPot;
let aPred;
let aPot;
let posT;
let posS;
let posA;
let rotationS;
let rotationT;
let rotationI;
let positionX;
let positionY;
let positionXi;
let positionYi;
let id;
let ppmS;
let ppmT;
let CoordXs;
let CoordYs;
let CoordXt;
let CoordYt;
let CoordXa;
let CoordYa;
let circleS = false;
let circleT = false;
let circleA = false;
let textI = false;
let coordinates;
let latLong;
let ppm;
let temp;
let scale;
let backgroundImage;
let info1;
let info2;
let info3;
let info4;
let info;
let biomes;
let id1 = 1; //info
let id2 = 2; //tree
let id3 = 3; //soil

function preload(){
    backgroundImage = loadImage('assets/background.png');
    scale = loadImage('assets/scale.png');
    temp = loadImage('assets/temp.png');
    ppm = loadImage('assets/ppm.png');
    info1 = loadImage('assets/soilcarbon_middle.png');
    info2 = loadImage('assets/climateconditions_middle.png');
    info3 = loadImage('assets/extracteddata_middle.png');
    info4 = loadImage('assets/biodiversity_middle.png');
    info = loadImage('assets/no_selection.png');
    biomes = loadImage('assets/biomes.png');
    table = loadTable('assets/data.csv', 'header');
}

function setup (){
    canvas = createCanvas(2560, 1600);
    print(table.getRowCount() + ' total rows in table');


}

function draw(){
    background(0, 0, 0, 0);
    noStroke();
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
    future();
    today();

}

function future(){

    push();
    translate(63,0);

    let spaceRight = width/8.18;
    let spaceLeft = width-width/4.63;
    let middle = (height/2)- height/5.5;
    let spaceMiddle = height/200;

    fill(0, 0, 0, 100);

    beginShape();

    vertex(spaceRight, middle -spaceMiddle);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        tPot = table.get(i)('Tree GtC potential');
        tPred = table.get(i)('Tree GtC prediction');

        let mtPot = map(tPot, 0, 19, 0, width/10);
        let mtPred = map(tPred, 0, 19, 0, width/14);

        let tP = map( rotationT, 0, 360, mtPred, mtPot);
        aPot = tP;
        ppmT = map(rotationT, 0, 360, 61.6, -86.4);

        let xCoord = space;
        let yCoord = middle -spaceMiddle- tP;
        space = xCoord +(height/110);


        vertex(xCoord, yCoord);


        let graphPointPosition = createVector(xCoord, 0);
        let tokenOfInterest = createVector(positionXi, 0);
        if (circleT == false) {
            if (graphPointPosition.dist(tokenOfInterest) < 3) {
                CoordXt = xCoord;
                CoordYt = yCoord;
                circleT = true;
            }
        }
    }
    vertex(spaceLeft, middle-spaceMiddle);
    endShape();

    // soil graph

    beginShape();

    vertex(spaceRight, middle+spaceMiddle);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        sPot = table.get(i)('Soil GtC potential');
        sPred = table.get(i)('Soil GtC prediction');

        let msPot = map(sPot, 0, 150, 0, width/2.85);
        let msPred = map(sPred, 0, 150, 0, width/2.25);

        let sP = map( rotationS, 0, 360, msPred, msPot);
        aPred = sP;
        ppmS = map(rotationS, 0, 360, -73.2, 69.4);

        let xCoord = space ;
        let yCoord = middle + sP +spaceMiddle;
        space = xCoord+height/110;

        vertex(xCoord, yCoord);
        let graphPointPosition = createVector(xCoord, 0);
        let tokenOfInterest = createVector(positionXi, 0);
        if (circleS == false) {
            if (graphPointPosition.dist(tokenOfInterest) < 3) {
                CoordXs = xCoord;
                CoordYs = yCoord;
                circleS = true;
            }
        }
    }
    vertex(spaceLeft, middle+spaceMiddle);
    endShape();
    // air graph

    beginShape();

    vertex(spaceRight, 0);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        aNow = table.get(i)('Mapped Air GtC now');

        let maPred = map(aPred, 3.7, 4.5, -15, 15);
        let maPot = map(aPot, 4, 9, -15, 15);
        let maNow = map(aNow, 3, 9, 3, 54);
        let Now = map(maNow, 3, 54, 0, maPred);
        let Now2 = map(maNow, 3, 54, 0, maPot);



        let xCoord = space ;
        let yCoord = 0 + maNow - Now - Now2 ;
        space = xCoord+height/110;


        vertex(xCoord, yCoord);


        let graphPointPosition = createVector(xCoord, 0);
        let tokenOfInterest = createVector(positionXi, 0);
        if (circleA == false) {
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

    for (let i = 0; i < numEntries; i++) {

        let xCoord = space ;
        space = xCoord+height/110;

        let graphPointPosition = createVector(xCoord, 0);
        let tokenOfInterest = createVector(positionXi, 0);

        if (textI == false) {
            if (graphPointPosition.dist(tokenOfInterest) < 3) {
                coordinates = table.get(i)('Biomes');
                latLong = map(xCoord, spaceRight, spaceLeft, -90, 90);
                textI = true;
            }
        }
    }



    //ppm monitor

    fill(0, 0, 100, 50);
    let ppmCalc = 369 + ppmT +ppmS;
    let sizePPM = map(ppmCalc, 0, 500, 1, 170);

    circle(width/6, height - height/6+1, sizePPM);



    //temperature monitor

    let colorPPM = map(ppmCalc, 0, 500, 270, 40);
    fill(colorPPM, 100, 100, 100);
    let numPPM = map(ppmCalc,0, 500,-1,2);
    let numPPMr = round(numPPM);

    stroke(0,0,100,100);
    circle( width/3.3, height - height/6, 170);

    fill(0,0,100,100);
    textSize(50);
    text("+" +numPPMr+ "°C" , width/3.8, height - height/6+18);

}

function today(){

    push();
    translate(63, 0);

    let spaceRight = width/8.18;
    let spaceLeft = width-width/4.63;
    let middle = (height/2)- height/5.5;
    let spaceMiddle = height/200;

    fill(0, 0, 70, 50);

    beginShape();
    vertex( spaceRight, middle-spaceMiddle);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        tNow = table.get(i)('Tree GtC now');

        let mtNow = map(tNow, 0, 19, 0, width/14);

        let xCoord = space;
        let yCoord = middle - mtNow -spaceMiddle;
        space = xCoord +height/105;

        vertex(xCoord, yCoord);
    }
    vertex(spaceLeft, middle-spaceMiddle);
    endShape();



    // soil graph static

    beginShape();
    vertex( spaceRight, middle+spaceMiddle);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        sNow = table.get(i)('s');

        let msNow = map(sNow, 0, 150, 0, width/2.5);
        let xCoord = space ;
        let yCoord = middle + msNow +spaceMiddle;
        space = xCoord+height/110;

        vertex(xCoord, yCoord);
    }
    vertex(spaceLeft, middle+spaceMiddle);
    endShape();

    // air graph static

    beginShape();
    vertex( spaceRight, 0);
    space = spaceRight;

    for (let i = 0; i < numEntries; i++) {

        aNow = table.get(i)('Mapped Air GtC now');

        let maNow = map(aNow, 3, 9, width/300, width/20);

        let xCoord = space ;
        let yCoord = 0 + maNow ;
        space = xCoord+height/110;

        vertex(xCoord, yCoord);
    }


    vertex(spaceLeft, 0);
    endShape();




    if(id == id1){

        // intersection points

        stroke(0, 0, 0, 100);
        fill(0, 0, 100, 100);
        if (circleT) {
            circle(CoordXt, CoordYt, 10);
            circleT = false;
        }
        if (circleS) {
            circle(CoordXs, CoordYs, 10);
            circleS = false;
        }
        if (circleA) {
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