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

//trackt welche tracker (tracker id) welche funktion des Programms hat. 
let trackerAllocation = {
  info: undefined,
  tree: undefined,
  soil: undefined
}


let socket = io() 
let trackedDevices = []
let myFont

let touchX =0, touchY = 0

/*  full screen */
let elem = document.documentElement
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen()
  }
}


/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen()
  }
} 


function init(){

}
let touchCount = 0
let ongoingTouches = []
let isTouch = false
function handleTouch(evt){
	isTouch=true
	touchCount++
	let touches = evt.changedTouches;
	// console.log("touch started at : " + evt.touches[0].clientX + " , " + evt.touches[0].clientY)
	touchX = evt.touches[0].clientX
	touchY = evt.touches[0].clientY
}

function handleEnd(evt) {
	isTouch=false
	// console.log("touch ended at : " + evt.changedTouches[0].pageX + " , " + evt.changedTouches[0].pageY )
	touchX = evt.changedTouches[0].pageX
	touchY = evt.changedTouches[0].pageY
}

function handleMove(evt) {
	 // console.log("touch moved at : " + evt.changedTouches[0].pageX + " , " + evt.changedTouches[0].pageY )
	touchX = evt.changedTouches[0].pageX
	touchY = evt.changedTouches[0].pageY
}


function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier
    
    if (id == idToFind) {
      return i
    }
  }
  return -1    // not found
}

function resize(){
	init()
}


function preload() {
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
    table = loadTable('assets/data.csv', 'csv', 'header');
	socket.on('connected',function(data){
		// do something in case another node is connected
		// console.log('new client connected id:' + data.id) 
	}) 
	
	myFont = loadFont('assets/Futura-Lig.otf')
	// openFullscreen()
	init()
}


function setup() {
	canvas = createCanvas(windowWidth, windowHeight)
//	canvas = createCanvas(2560, 1600);
    print(table.getRowCount() + ' total rows in table');
	print(table.getColumnCount() + 'total columns in table')
	noStroke()
	textFont(myFont)
	// Attaching  Touch Listeners to body and P5 JS Canvas 
	document.body.addEventListener('touchstart',handleTouch,false)
	document.getElementById('defaultCanvas0').addEventListener('touchstart',handleTouch,false)
	document.getElementById('defaultCanvas0').addEventListener('touchend',handleEnd,false)
	document.getElementById('defaultCanvas0').addEventListener('touchmove',handleMove,false)
	addScreenPositionFunction(this)
	listenMessages()
}

function draw() {
  	background(0)
	background(0, 0, 0, 0);
    noStroke();
    imageMode(CORNER);
    image(backgroundImage, 0, 0, width, height);
    today();
	future();
	show2d();

}


function windowResized() {
  	resizeCanvas(windowWidth, windowHeight,true)
  	resize()
}

// LISTEN FOR NEW TRACKED DEVICES AND UPDATES
function listenMessages(){
	socket.on('addDevice', function(data){

    for (trackerFunction of Object.keys(trackerAllocation)) {
      if (typeof trackerAllocation[trackerFunction] === "undefined") {
        trackerAllocation[trackerFunction] = data.id
        console.log(trackerAllocation);
        break;
      }
    }

		let thisDevice = new TrackedDevice()
		thisDevice.uniqueId = data.id
		thisDevice.x = data.x * windowWidth
		thisDevice.y = data.y * windowHeight
		thisDevice.rotation = data.rot
		trackedDevices.push(thisDevice)
	}) 
	socket.on('updateDevice', function(data){
		let id = data.id 

		trackedDevices.forEach( element => {
			if(element.uniqueId === id){
				element.x = data.x * windowWidth
				element.y = data.y * windowHeight
				element.rotation = data.rot
				positionXi = element.x

        for (trackerFunction of Object.keys(trackerAllocation)) {
          if (trackerFunction === "info") {
            //update info tracker
          }
          if (trackerFunction === "soil") {
            //update soil tracker
            rotationS = element.rotation;
          }
          if (trackerFunction === "tree") {
            //update tree tracker
            rotationT = element.rotation
          }
        }
				
			}
		})
	})
	socket.on('removeDevice', function(data){
    console.log("remove device");
		for (trackerFunction of Object.keys(trackerAllocation)) {
      if (trackerAllocation[trackerFunction] === data.id) {
        trackerAllocation[trackerFunction] = undefined;
        console.log(trackerAllocation);
        break;
      }
    }
		trackedDevices.forEach( function(element,index) {
			if(element.uniqueId == data.id ){
				trackedDevices.splice(index,1)
			}
		})
	}) 
}

function show2d() {
	if(trackedDevices.length>0){

		trackedDevices.forEach( element => {
			element.calculateRange()

		})
		trackedDevices.forEach(element =>{
			if(element.inRange){
				element.show()

			}
		})
	}
}

function future(){

    push();
    translate(63,0);

    let spaceRight = width/8.18;
    let spaceLeft = width-width/4.63;
    let middle = (height/2)- height/5.5;
    let spaceMiddle = height/200;

    fill(255, 0, 0, 100);

    beginShape();

    vertex(spaceRight, middle-spaceMiddle);
    space = spaceRight;

    for (let i = 0; i < table.getRowCount(); i++) {

		tPot = table.getRow(i).getNum("Tree GtC potential");
		tPred = table.getRow(i).getNum("Tree GtC prediction");

        let mtPot = map(tPot, 0, 19, 0, width/10);
        let mtPred = map(tPred, 0, 19, 0, width/14);

        let tP = map(rotationT, 0, 360, mtPred, mtPot);
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

    for (let i = 0; i < table.getRowCount(); i++) {

        sPot = table.getRow(i).getNum("Soil GtC potential");
        sPred = table.getRow(i).getNum("Soil GtC prediction");

        let msPot = map(sPot, 0, 150, 0, width/2.85);
        let msPred = map(sPred, 0, 150, 0, width/2.25);

        let sP = map(rotationS, 0, 360, msPred, msPot);
        aPred = sP;
        ppmS = map(rotationS, 0, 360, -73.2, 69.4);

        let xCoord = space ;
        let yCoord = middle + sP + spaceMiddle;

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

    for (let i = 0; i < table.getRowCount(); i++) {

        aNow = table.getRow(i).getNum("Mapped Air GtC now");

        let maPred = map(aPred, 3.7, 4.5, -15, 15);
        let maPot = map(aPot, 4, 9, -15, 15);
        let maNow = map(aNow, 3, 9, 3, 54);
        let Now = map(maNow, 3, 54, 0, maPred);
        let Now2 = map(maNow, 3, 54, 0, maPot);

        let xCoord = space ;
        let yCoord = 0 + maNow - Now - Now2 ;
        space = xCoord+height/110;

        vertex(xCoord, -yCoord);

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
    vertex(spaceLeft, 0);
    endShape();


    pop();
    // text data out of table
    space = spaceRight;

    for (let i = 0; i < table.getRowCount(); i++) {

        let xCoord = space ;
        space = xCoord+height/110;

        let graphPointPosition = createVector(xCoord, 0);
        let tokenOfInterest = createVector(positionXi, 0);

        if (textI == false) {
            if (graphPointPosition.dist(tokenOfInterest) < 3) {
                coordinates = table.getRow(i).getString("Biomes");
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

    for (let i = 0; i < table.getRowCount(); i++) {

        tNow = table.getRow(i).getNum("Tree GtC now");

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

    for (let i = 0; i < table.getRowCount(); i++) {

        sNow = table.getRow(i).getNum("s");

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

    for (let i = 0; i < table.getRowCount(); i++) {

        aNow = table.getRow(i).getNum("Mapped Air GtC now");

        let maNow = map(aNow, 3, 9, width/300, width/20);

        let xCoord = space ;
        let yCoord = 0 + maNow ;
        space = xCoord+height/110;

        vertex(xCoord, yCoord);
    }

    vertex(spaceLeft, 0);
    endShape();

    if(id == trackerAllocation.info){

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
    image(ppm, width/3, height - height/3+2, 180, 195);

    // temp

    imageMode(CENTER);
    image(temp, width/1.1, height - height/3+2, 180, 195);


    // text

    if ( textI ) {

        fill(0, 0, 0, 100);
        //  text(latLong + "°", positionXi+ 100, positionYi);
        // text(coordinates, positionXi+ 100, positionYi + 50);
        textI = false;
    }

}

// *** CLASS FOR THE TRACKED DEVICE *** //
class TrackedDevice{
	constructor(){
		this.uniqueId = -1
		this.identifier = -1
		this.x = 0.0
		this.y = 0.0
		this.rotation =0.0
		this.intensity = 0.0
		this.dead = false
		this.smoothPosition  = createVector(0.0,0.0)
		this.smoothRotation = 0.0
		this.inRange = false
		this.angle = 0
		this.sizeL = 180
		this.thisLabel = new Label()
		this.oldPos = createVector(0,0)
		
	}
	update(){
		let currPos = createVector ( this.x,this.y )
		let delta = currPos.dist(this.oldPos)
		let alpha = 0.1
		this.smoothRotation = this.easeFloatCircular((360 - this.rotation), this.smoothRotation, 0.85)
		this.smoothPosition.x = this.easeFloatCircular(this.x, this.smoothPosition.x, alpha)
   		this.smoothPosition.y = this.easeFloatCircular(this.y, this.smoothPosition.y, alpha)
		this.angle = Math.atan2(this.smoothPosition.y - windowHeight/2, this.smoothPosition.x - windowWidth/2) * 180 / Math.PI
		this.oldPos.x = this.smoothPosition.x
		this.oldPos.y = this.smoothPosition.y
	}
	show(){
		let radius = 45
		let lSize = map(this.smoothRotation,0,360,10,75)
		let rotX = (0 + radius) * Math.cos(radians(this.smoothRotation))
		let rotY = (0+ radius) * Math.sin(radians(this.smoothRotation))

		fill(255,255,100, 25+map(this.smoothRotation,0,360,0,150))
		noStroke()
		ellipse(this.smoothPosition.x,this.smoothPosition.y,radius*2 + lSize,radius*2 + lSize)
		fill(255,255,100)
		stroke(0)
		strokeWeight(10)
		circle(this.smoothPosition.x ,this.smoothPosition.y , radius*2)
		stroke(0)
		strokeWeight(10)
		line(this.smoothPosition.x , this.smoothPosition.y  , this.smoothPosition.x + rotX, this.smoothPosition.y + rotY)

		// DISPLAY DEGREES OF ROTATION
		push()
			translate(this.smoothPosition.x+rotX, this.smoothPosition.y+rotY)
			rotate(radians(this.smoothRotation))
			fill(255,255,100)
			textSize(30)
			// text(Math.round(this.smoothRotation,3) + " , " + Math.round(this.smoothPosition.x) + " , " + Math.round(this.smoothPosition.y), 30,10)
			text(Math.round(this.smoothRotation,3), 30,10)
		pop()

		// DISPLAY LABEL
		this.thisLabel.update(this.smoothPosition.x,this.smoothPosition.y,this.sizeL, this.smoothRotation + 120)		
		noStroke()
	}
	calculateRange(){
		this.update()
		
		// CONDITION DEVICE OUT OF DRAWING RANGE
		if(this.smoothPosition.x > windowWidth || this.smoothPosition.x < 0 || this.smoothPosition.y>windowHeight || this.smoothPosition.y<0){
			let angle = atan2(this.smoothPosition.y - height / 2, this.smoothPosition.x  - width / 2)
			let newX = this.smoothPosition.x > windowWidth ? windowWidth : this.smoothPosition.x
			let newY = this.smoothPosition.y > windowHeight ? windowHeight : this.smoothPosition.y
			newX = newX < 0 ? 0 : newX
			newY = newY < 0 ? 0 : newY
			push()
			let sizeT = 30
			translate(newX,newY)
			rotate(angle)
			let thisTriangle = new Triangle(0,0,sizeT)
			thisTriangle.show()
			pop()
			this.inRange = false
		}else{
			this.inRange = true
		}
	}
	easeFloat (target, value, alpha = 0.1) {
    	const d = target - value
    	return value + (d * alpha)
  	}
	easeFloat2 (target, value, alpha ){
	value = value * alpha + target *(1-alpha)
	return value
	}
  	easeFloatCircular (target, value, maxValue, alpha = 0.1) {
    	let delta = target - value
    	const altDelta = maxValue - Math.abs(delta)

    	if (Math.abs(altDelta) < Math.abs(delta)) {
      		delta = altDelta * (delta < 0 ? 1 : -1)
    	}
		return value + (delta * alpha)
	}
	radians (degrees) {
		let radians = degrees * (Math.PI / 180)
		return radians
	}
}
// CLASS TO DRAW THE TRIANGLE
class Triangle{
	constructor(x, y, size){
		this.x = x
		this.y = y
		this.size = size
	}
	update(){

	}
	show(){
		noStroke()
		fill(255,255,100)
		beginShape()
		vertex(this.x,this.y)
		vertex(this.x-this.size,this.y+this.size)
		vertex(this.x-this.size, this.y-this.size)
		endShape(CLOSE)
		textSize(16)
		text('OBJECT OUT OF RANGE', this.x-200,this.y+4)
	}
}

// CLASS TO DRAW THE LABEL
class Label{
	constructor(x,y,size, rotation){
		this.x =0
		this.y = 0
		this.size = 0
		this.rotation = 0
		this.count = 0
		this.oldRotation = 0
		this.oldY = 0
		this.labelOff=false
		this.opacity = 0
	}
	update(x,y,size,rotation){

		this.x = x
		this.y = y
		this.size = size
		this.rotation = Math.round(rotation)

		if(this.rotation!=this.oldRotation){
			this.count=30
			this.labelOff = false

		}else{
			if(this.count>0){
				this.count --
			}else{
				this.labelOff = true
			}
		}
		this.opacity = map(this.count,0,30,0,255)
		if(!this.labelOff){
			this.show()
		}
		
		this.oldRotation = this.rotation

	}

	show(){
		// mapping the rotation of the tracked device to the position of the text array
		// if rotation 120 
		let txtContent =[
			"I'M A PROTOTYPE FOR TANGIBLE INTERACTION AND DATA VISUALIZATION",
			"MOVE ME AROUND TO EXPLORE MY AFFORDANCES!",
			"STUDENTS FROM INTERACTION DESIGN USE ME TO EXPLORE THEIR CONCEPTS",
			"DESIGN ... TECHNOLOGY ... THINKING ... CONCEIVING ...  DOING ...  ",
			"PROTOTYPING"
		]
		let peak = 10
		let offX=120
		let offY=0
		push()
		strokeWeight(5)
		stroke(255,255,100,this.opacity)
		noFill()
		translate(this.x,this.y)
		rotate(radians(this.rotation))
		beginShape()
		vertex(offX,offY)
		vertex(offX+peak, offY-peak)
		vertex(offX+peak,offY-this.size/3)
		vertex(offX+peak+this.size, offY-this.size/3)
		vertex(offX+peak+this.size,offY+this.size/3)
		vertex(offX+peak, offY+this.size/3)
		vertex(offX+peak,offY+peak)
		endShape(CLOSE)
		textSize(16)
		fill(255,255,100)
		textAlign(CENTER,CENTER)
		noStroke()
		text(txtContent[int(map(this.rotation%360,1,360,0,txtContent.length))],offX +30 , offY - this.size/4, this.size-25, this.size/2 )
		pop()

	}
}
