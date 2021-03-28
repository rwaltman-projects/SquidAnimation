class Squid{

	constructor(){
		this.tentacles = [];
		this.amountTentacles = 10;
		this.tentacleAngle = 0;
		this.head = new Head();

		this.modelMatrix = new Matrix4();

	  	let alpha = 360 / this.amountTentacles;
	  	for(let i = 0; i < 360; i += alpha){
	    	let tCur = new Tentacle();
	    	tCur.startPos = [0.05, 0.0, 0];
	    	tCur.startAngle = i;
	    	this.tentacles.push(tCur);
	 	}

	}

	update(){
		for(let i = 0; i < this.amountTentacles; i ++){
			this.tentacles[i].modelMatrix.setIdentity();
	    	this.tentacles[i].modelMatrix.multiply(this.modelMatrix);
	    	this.tentacles[i].updatePos(this.tentacleAngle); //takes in global rotation
  		}
  		this.head.modelMatrix.setIdentity();
  		this.head.modelMatrix.multiply(this.modelMatrix);
  		this.head.update();
	}

	render(){
		for(let i = 0; i < this.amountTentacles; i ++){
			this.tentacles[i].render();
		}
		this.head.render();
	}

	rotate(x, y, z){
		this.modelMatrix.rotate(x, 1, 0, 0);
		this.modelMatrix.rotate(y, 0, 1, 0);
		this.modelMatrix.rotate(z, 0, 0, 1);
	}

	translate(x,y,z){
		this.modelMatrix.translate(x,y,z);
	}

	scale(x,y,z){
		this.modelMatrix.scale(x,y,z);
	}
}


class Tentacle{
	constructor(){
		this.angle = []; //keeps track of the angle of all the segments
		this.segments = []; //list of cylinder shapes
		this.length = 0.02;	//length of each cylinder segment
		this.size = 20;		//amount of segments
		this.pos = []; //starting positions of each segment
		this.startPos = [0,0,0]; 
		this.startAngle = 0;
		this.startWidth = 0.01;
		this.widths = [];

		this.modelMatrix = new Matrix4();


		for(let i = 0; i < this.size; i++){
			this.segments.push(new Cylinder(20, 1, 1, color1, color1));
			this.angle.push(0);
			this.pos.push([0,0]);
			this.widths.push(0);
		}


		let stepWidth = this.startWidth / 2 / this.size;
		for(let i = 0; i < this.size; i++){
			this.widths[i] = this.startWidth- i * stepWidth;
		}

	}

	updatePos(tentacleAngle){


		//reseting the tentacle matrices
		for(let i = 0; i < this.segments.length; i++){
			this.segments[i].modelMatrix.setIdentity();
			this.segments[i].modelMatrix.multiply(this.modelMatrix);
		}


		for(let i = 0; i < this.segments.length; i++){
			this.angle[i] = (tentacleAngle * i) * (Math.PI / 18);
			let pos = [0.0, 0.0];
			let j = 0;
			while(j < i){
				pos[1] += 2 * this.length * Math.cos(this.angle[j])
				pos[0] += 2 * this.length * Math.sin(this.angle[j])
				j++;
			}
			this.pos[i] = [pos[0], pos[1]];
		}
		
		for(let i = 0; i < this.segments.length; i++){
			this.segments[i].modelMatrix.rotate(this.startAngle, 0, 0, 1);
			this.segments[i].modelMatrix.translate(this.startPos[0], this.startPos[1], this.startPos[2]);
			this.segments[i].modelMatrix.translate(this.pos[i][0], 0, this.pos[i][1]);
			

			this.segments[i].modelMatrix.rotate(this.angle[i] * 180 / Math.PI, 0, 1, 0);
			this.segments[i].modelMatrix.scale(this.widths[i], this.widths[i], this.length);
			this.segments[i].modelMatrix.translate(0,0,1);
		}
	}

	rotate(x, y, z){
		this.modelMatrix.rotate(x, 1, 0, 0);
		this.modelMatrix.rotate(y, 0, 1, 0);
		this.modelMatrix.rotate(z, 0, 0, 1);
	}



	render(){
		for(let i = 0; i < this.segments.length; i++){
			this.segments[i].render();
		}
	}
}

class Head{
	constructor(){
		this.eyes = [];
		this.headSegments = [];

		this.modelMatrix = new Matrix4();
		this.seg1RotMatrix = new Matrix4();
		this.flapsRotMatrix = new Matrix4();
		
	
		this.headSegments.push(new Cylinder(20,1,1,color1, color2));
	  	this.headSegments.push(new Cylinder(20,1.5,1.0,color2, color2));
	  	this.headSegments.push(new Cylinder(20,0.75,1.5,color2, color2));
	  	this.headSegments.push(new Cylinder(20,0.2,0.75,color2, color1));
	  	this.headSegments.push(new Cylinder(3,1,1,color1, color2));
	  	this.headSegments.push(new Cylinder(3,1,1,color1, color2));

	  	this.eyes[0] = new Cylinder(10,1,1,[0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0]);
	  	this.eyes[1] = new Cylinder(10,1,1,[0.0, 0.0, 0.0, 1.0], [0.0, 0.0, 0.0, 1.0]);
	}

	update(){
		
		let tailPos = 0.01;
		for(let i = 0; i < this.eyes.length; i++){
		    this.eyes[i].modelMatrix.setIdentity();
			this.eyes[i].modelMatrix.multiply(this.modelMatrix);

			this.eyes[i].modelMatrix.multiply(this.seg1RotMatrix);
		    this.eyes[i].modelMatrix.rotate(i*180, 0, 0, 1);
		    this.eyes[i].modelMatrix.translate(0.055, 0, tailPos-0.05);
		    this.eyes[i].modelMatrix.rotate(90, 0, 1, 0);
		    this.eyes[i].modelMatrix.scale(0.01, 0.01, 0.01);
  		}

  		for(let i = 0; i < this.headSegments.length; i++){
  			this.headSegments[i].modelMatrix.setIdentity();
  			this.headSegments[i].modelMatrix.multiply(this.modelMatrix);
  		}

	  	
	  	let scales = [0.05,0.05,0.3,0.01];

	  	this.headSegments[0].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[0].modelMatrix.translate(0,0,tailPos--);
	  	this.headSegments[0].modelMatrix.scale(0.06,0.06,scales[0]);
	  	this.headSegments[0].modelMatrix.translate(0,0,-1);

	  	tailPos-= 2*scales[0] - 1.0;

	  	this.headSegments[1].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[1].modelMatrix.translate(0,0,tailPos);
	  	this.headSegments[1].modelMatrix.scale(0.06,0.06,scales[1]);
	  	this.headSegments[1].modelMatrix.translate(0,0,-1);
	  	
	  	tailPos-= 2*scales[1];

	  	this.headSegments[2].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[2].modelMatrix.translate(0,0,tailPos);
	  	this.headSegments[2].modelMatrix.scale(0.06,0.06,scales[2]);
	  	this.headSegments[2].modelMatrix.translate(0,0,-1);

	  	tailPos-= 2*scales[2];
	  	this.headSegments[3].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[3].modelMatrix.translate(0,0,tailPos);
	  	this.headSegments[3].modelMatrix.scale(0.06,0.06,scales[3]);
	  	this.headSegments[3].modelMatrix.translate(0,0,-1);

	  	let flapsOffset = 0.2;
	  	this.headSegments[4].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[4].modelMatrix.translate(0,0.01,tailPos  + flapsOffset);
	  	this.headSegments[4].modelMatrix.multiply(this.flapsRotMatrix);
	  	this.headSegments[4].modelMatrix.rotate(90,0,0,1);
	  	this.headSegments[4].modelMatrix.rotate(15,1,0,0);
	  	this.headSegments[4].modelMatrix.rotate(90,0,1,0);
	  	this.headSegments[4].modelMatrix.scale(0.2,0.1,0.01);
	  	this.headSegments[4].modelMatrix.translate(0,-0.5,-1.0);

	  	this.headSegments[5].modelMatrix.multiply(this.seg1RotMatrix);
	  	this.headSegments[5].modelMatrix.translate(0,0.01,tailPos  + flapsOffset);
	  	this.headSegments[5].modelMatrix.scale(-1,1,1);
	  	this.headSegments[5].modelMatrix.multiply(this.flapsRotMatrix);
	  	this.headSegments[5].modelMatrix.rotate(90,0,0,1);
	  	this.headSegments[5].modelMatrix.rotate(15,1,0,0);
	  	this.headSegments[5].modelMatrix.rotate(90,0,1,0);
	  	this.headSegments[5].modelMatrix.scale(0.2,0.1,0.01);
	  	this.headSegments[5].modelMatrix.translate(0,-0.5,-1.0);
	  	
	}

	render(){
		for(let i = 0; i < this.eyes.length; i++){
			this.eyes[i].render();
		}
		for(let i = 0; i < this.headSegments.length; i++){
			this.headSegments[i].render();
		}
	}

	rotate(x, y, z){
		this.modelMatrix.rotate(x, 1, 0, 0);
		this.modelMatrix.rotate(y, 0, 1, 0);
		this.modelMatrix.rotate(z, 0, 0, 1);
	}

	translate(x,y,z){
		this.modelMatrix.translate(x,y,z);
	}

	scale(x,y,z){
		this.modelMatrix.scale(x,y,z);
	}
}