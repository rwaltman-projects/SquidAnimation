class Shape{
	constructor(){
		this.type = 'point';
		this.vertices;
		this.modelMatrix = new Matrix4();
	}

	render(){}
}

class Cube extends Shape{
	constructor(){
		super();

		this.type = 'square';
		this.vertices = new Float32Array([
				//face 1
				1.0, -1.0, 1.0,			1.0, 0.0, 0.0, 1.0,
				1.0, -1.0, -1.0,		1.0, 0.0, 0.0, 1.0,
				1.0, 1.0, -1.0,			1.0, 0.0, 0.0, 1.0,
				1.0, -1.0, 1.0,			1.0, 0.0, 0.0, 1.0,
				1.0, 1.0, -1.0,			1.0, 0.0, 0.0, 1.0,
				1.0, 1.0, 1.0,			1.0, 0.0, 0.0, 1.0,

				//face 2
				-1.0, -1.0, -1.0,		1.0, 1.0, 0.0, 1.0,
				-1.0, -1.0, 1.0,		1.0, 1.0, 0.0, 1.0,
				-1.0, 1.0, 1.0,			1.0, 1.0, 0.0, 1.0,
				-1.0, -1.0, -1.0,		1.0, 1.0, 0.0, 1.0,
				-1.0, 1.0, 1.0,			1.0, 1.0, 0.0, 1.0,
				-1.0, 1.0, -1.0,		1.0, 1.0, 0.0, 1.0,

				// //face 3
				1.0, 1.0, 1.0,			0.0, 1.0, 0.0, 1.0,
				-1.0, 1.0, 1.0,			0.0, 1.0, 0.0, 1.0,
				-1.0, -1.0, 1.0,		0.0, 1.0, 0.0, 1.0,
				1.0, 1.0, 1.0,			0.0, 1.0, 0.0, 1.0,
				-1.0, -1.0, 1.0,		0.0, 1.0, 0.0, 1.0,
				1.0, -1.0, 1.0,			0.0, 1.0, 0.0, 1.0,

				//face 4
				1.0, -1.0, -1.0,		0.0, 0.0, 1.0, 1.0,
				-1.0, -1.0, -1.0,		0.0, 0.0, 1.0, 1.0,
				-1.0, 1.0, -1.0,		0.0, 0.0, 1.0, 1.0,
				1.0, -1.0, -1.0,		0.0, 0.0, 1.0, 1.0,
				-1.0, 1.0, -1.0,		0.0, 0.0, 1.0, 1.0,
				1.0, 1.0, -1.0,			0.0, 0.0, 1.0, 1.0,

				//face 5
				1.0, 1.0, -1.0,			1.0, 0.0, 1.0, 1.0,
				-1.0, 1.0, -1.0,		1.0, 0.0, 1.0, 1.0,
				-1.0, 1.0, 1.0,			1.0, 0.0, 1.0, 1.0,
				1.0, 1.0, -1.0,			1.0, 0.0, 1.0, 1.0,
				1.0, 1.0, 1.0,			1.0, 0.0, 1.0, 1.0,
				-1.0, 1.0, 1.0,			1.0, 0.0, 1.0, 1.0,

				// //face 6
				1.0, -1.0, -1.0,		1.0, 1.0, 1.0, 1.0,
				-1.0, -1.0, -1.0,		1.0, 1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,		1.0, 1.0, 1.0, 1.0,
				1.0, -1.0, -1.0,		1.0, 1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,			1.0, 1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,		1.0, 1.0, 1.0, 1.0
			]);
		this.size = this.vertices.length;
		
		//each face color
	}

	render(){
	  	
	  	
	  	// Write date into the buffer object
	  	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);


  		gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);

  		// Assign the buffer object to u_FragColor variable
  		//gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
	 
	 	// Assign the buffer object to a_Position variable
	  	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 7 * FLOAT_SIZE, 0 * FLOAT_SIZE);

	  	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 7 * FLOAT_SIZE, 3 * FLOAT_SIZE);

	 	// Enable the assignment to a_Position variable
	  	gl.enableVertexAttribArray(a_Position);

	  	gl.enableVertexAttribArray(a_Color);

	  	gl.drawArrays(gl.TRIANGLES, 0, this.size/7);
	}
}
//this class can be any prism that you want, just pass in the corresponding segment size
class Cylinder extends Shape{
	constructor(segmentSize, topSize, botSize, topBotColor, sideColor){
		super();
		this.type = 'cylinder';
		this.color1 = topBotColor;
		this.color2 = sideColor;
		this.topSize = topSize;
		this.botSize = botSize;
		this.segments = segmentSize;

		let segSize = segmentSize;
		let amountPoints = 12*segSize;
		let alpha = 360/segSize;

		//each point will have an xyz and an rgba
		this.vertices = new Float32Array(7 * amountPoints);
		
		let ind = 0;
		//bottom
		for(let i = 0; i < 360; i+=alpha){
			
			this.vertices[ind++] = 0.0; 	//x
			this.vertices[ind++] = 0.0;	//y
			this.vertices[ind++] = -1.0; 	//z

			this.vertices[ind++] = this.color2[0];	//r
			this.vertices[ind++] = this.color2[1];	//g
			this.vertices[ind++] = this.color2[2];	//b
			this.vertices[ind++] = this.color2[3];	//a
			
			this.vertices[ind++] = (this.topSize * Math.cos(i*Math.PI/180));
			this.vertices[ind++] = (this.topSize * Math.sin(i*Math.PI/180));
			this.vertices[ind++] = -1.0;

			this.vertices[ind++] = this.color2[0];
			this.vertices[ind++] = this.color2[1];
			this.vertices[ind++] = this.color2[2];
			this.vertices[ind++] = this.color2[3];

			this.vertices[ind++] = (this.topSize * Math.cos((i+alpha)*Math.PI/180));
			this.vertices[ind++] = (this.topSize * Math.sin((i+alpha)*Math.PI/180));
			this.vertices[ind++] = -1.0;

			this.vertices[ind++] = this.color2[0];
			this.vertices[ind++] = this.color2[1];
			this.vertices[ind++] = this.color2[2];
			this.vertices[ind++] = this.color2[3];
		}
		//top
		let topInd = ind; 

		for(let i = 0; i < 360; i+=alpha){
			
			this.vertices[ind++] = 0.0; 	//x
			this.vertices[ind++] = 0.0;	//y
			this.vertices[ind++] = 1.0; 	//z

			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];
			
			this.vertices[ind++] = (this.botSize * Math.cos(i*Math.PI/180));
			this.vertices[ind++] = (this.botSize * Math.sin(i*Math.PI/180));
			this.vertices[ind++] = 1.0;

			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];

			this.vertices[ind++] = (this.botSize * Math.cos((i+alpha)*Math.PI/180));
			this.vertices[ind++] = (this.botSize * Math.sin((i+alpha)*Math.PI/180));
			this.vertices[ind++] = 1.0;

			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];
		}
		
		this.color = [1.0, 0.3, 0.3, 1.0];

		for(let i = 0; i < segSize; i++){

			let b1 = 7 + (21 * i);
			let b2 = 14 + (21 * i);

			let t1 = topInd + 7 + (21 * i);
			let t2 = topInd + 14 + (21 * i);

			this.vertices[ind++] = this.vertices[b1];
			this.vertices[ind++] = this.vertices[b1 + 1];
			this.vertices[ind++] = this.vertices[b1 + 2];
			this.vertices[ind++] = this.color2[0];
			this.vertices[ind++] = this.color2[1];
			this.vertices[ind++] = this.color2[2];
			this.vertices[ind++] = this.color2[3];

			this.vertices[ind++] = this.vertices[t2];
			this.vertices[ind++] = this.vertices[t2 + 1];
			this.vertices[ind++] = this.vertices[t2 + 2];
			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];

			this.vertices[ind++] = this.vertices[t1];
			this.vertices[ind++] = this.vertices[t1 + 1];
			this.vertices[ind++] = this.vertices[t1 + 2];
			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];

			this.vertices[ind++] = this.vertices[b1];
			this.vertices[ind++] = this.vertices[b1 + 1];
			this.vertices[ind++] = this.vertices[b1 + 2];
			this.vertices[ind++] = this.color2[0];
			this.vertices[ind++] = this.color2[1];
			this.vertices[ind++] = this.color2[2];
			this.vertices[ind++] = this.color2[3];

			this.vertices[ind++] = this.vertices[b2];
			this.vertices[ind++] = this.vertices[b2 + 1];
			this.vertices[ind++] = this.vertices[b2 + 2];
			this.vertices[ind++] = this.color2[0];
			this.vertices[ind++] = this.color2[1];
			this.vertices[ind++] = this.color2[2];
			this.vertices[ind++] = this.color2[3];

			this.vertices[ind++] = this.vertices[t2];
			this.vertices[ind++] = this.vertices[t2 + 1];
			this.vertices[ind++] = this.vertices[t2 + 2];
			this.vertices[ind++] = this.color1[0];
			this.vertices[ind++] = this.color1[1];
			this.vertices[ind++] = this.color1[2];
			this.vertices[ind++] = this.color1[3];
		}

		this.size = this.vertices.length;
		
		//each face color
	}

	render(){
	  	
	  	
	  	// Write date into the buffer object
	  	gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);


  		gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);

  		// Assign the buffer object to u_FragColor variable
  		//gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
	 
	 	// Assign the buffer object to a_Position variable
	  	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 7 * FLOAT_SIZE, 0 * FLOAT_SIZE);

	  	gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 7 * FLOAT_SIZE, 3 * FLOAT_SIZE);

	 	// Enable the assignment to a_Position variable
	  	gl.enableVertexAttribArray(a_Position);

	  	gl.enableVertexAttribArray(a_Color);

	  	gl.drawArrays(gl.TRIANGLES, 0, this.size/7);
	}
}