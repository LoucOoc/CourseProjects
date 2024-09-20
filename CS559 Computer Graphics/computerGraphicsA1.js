// Author:   Haoyu Wang
// Email:    hwang2376@wisc.edu
// Note: I used and learned the idea of projecting rotatble 3d shapes into 2d plane with the help of https://stuartwakefield.github.io/canvas3dgfx/ and math.js
//       the coding structure from line 116 to line 206 is adapted from the instruction of https://stuartwakefield.github.io/canvas3dgfx/ with my own efforts added
//       in especially building fx and fy function to make projection and rotation possible, and I changed shape from the cube in the example to a pyramid
function setup(){
    var canvasXY = document.getElementById('myCanvasXY');
    var canvasYZ = document.getElementById('myCanvasYZ');
    var canvasXZ = document.getElementById('myCanvasXZ');
    var canvasCamera = document.getElementById('cameraView');

    var slider1 = document.getElementById('Xinput');
    slider1.value = 10;
    var slider2 = document.getElementById('Yinput');
    slider2.value = 10;
    var slider3 = document.getElementById('Zinput');
    slider3.value = 10;
    
    var x =10;
    var y =10;
    var canvas = document.getElementById('someAnimation');
		var slider = document.getElementById('speedControl');
    slider.value = 20;
    

    function draw(){
        var context1 = canvasXY.getContext('2d');
        var context2 = canvasYZ.getContext('2d');
        var context3 = canvasXZ.getContext('2d');
        var dx = slider1.value;
        var dy = slider2.value;
        var dz = slider3.value;
        canvasXY.width = canvasXY.width;
        canvasYZ.width = canvasYZ.width;
        canvasXZ.width = canvasXZ.width;
        canvasCamera.width = canvasCamera.width;


        //type: 1=XY 2=YZ 3=XZ
        function DrawAxes(color, context, type) {

            context.strokeStyle=color;
            context.beginPath();
            context.moveTo(-50,0);context.lineTo(50,0);
            context.moveTo(45,5);context.lineTo(50,0);context.lineTo(45,-5);
            context.moveTo(0,50);context.lineTo(0,-50);
            context.moveTo(-5,-45);context.lineTo(0,-50);context.lineTo(5,-45);
            
            //XY view
            if(type == 1){
            // X
            context.moveTo(60,6);context.lineTo(70,-6);
            context.moveTo(60,-6);context.lineTo(70,6);
            // Y
            context.moveTo(-5,-70);context.lineTo(0,-65);context.lineTo(5,-70);
            context.moveTo(0,-55);context.lineTo(0,-65);
            }
            //YZ view
            if(type == 2){
            // Y
            context.moveTo(60,-5);context.lineTo(65,0);context.lineTo(70,-5);
            context.moveTo(65,0);context.lineTo(65,10);
            // Z
            context.moveTo(-5,-70);context.lineTo(5,-70);context.lineTo(-5,-60);context.lineTo(5,-60);
            }
            //XZ view
            if(type == 3){
            // X
            context.moveTo(60,6);context.lineTo(70,-6);
            context.moveTo(60,-6);context.lineTo(70,6);
            // Z
            context.moveTo(-5,-70);context.lineTo(5,-70);context.lineTo(-5,-60);context.lineTo(5,-60);
            }
            context.stroke();
           }

        function DrawCamera(color, context, type){
            var horizontal;
            var vertical;
            //XY
            if(type == 1){
                horizontal  = dx;
                vertical    = dy;
            }
            //YZ
            if(type == 2){
                horizontal  = dy;
                vertical    = dz;
            }
            //XZ
            if(type == 3){
                horizontal  = dx;
                vertical    = dz;
            }
            var top = Number(vertical)-5;
            var left = Number(horizontal)-5;
            var down = Number(vertical)+5;
            var right = Number(horizontal)+5;
            context.beginPath();
            context.fillStyle = color;
            context.moveTo(horizontal,top);context.lineTo(left,vertical);context.lineTo(horizontal,down);context.lineTo(right,vertical);context.closePath();
            context.fill();
        }

        //draw pyramid with width and length are 60 and height 40
        function DrawShape(color, context, type){
            //XY
            if(type == 1){
                context.beginPath();
                context.rect(-25,-25,50,50);
                context.closePath();
                context.fillStyle = color;
                context.fill();
            }
            //YZ
            if(type == 2 || type == 3){
                context.beginPath();
                context.moveTo(0,-20);context.lineTo(-30,20);context.lineTo(30,20);context.closePath();
                context.fill();
                context.fillStyle = color;
                context.fill();
            }
        }

        function Vertex(x, y, z) {
            this.x = function() {
              return x;
            };
            this.y = function() {
              return y;
            };
            this.z = function() {
              return z;
            };
        }

        function Polygon(vertices) {
            this.count = function() {
              return vertices.length;
            };
            this.vertex = function(i) {
              if (i < 0) {
                throw new Error('Vertex index must be a positive integer')
              }
              if (i >= vertices.length) {
                throw new Error('Vertex index out of bounds');
              }
              return vertices[i];
            };
        }

        var vertices = [
            new Vertex(-3.0, -3.0, -2.0), // Bottom 1
            new Vertex( 3.0, -3.0, -2.0), // Bottom 2
            new Vertex(-3.0,  3.0, -2.0), // Bottom 3
            new Vertex( 3.0,  3.0, -2.0), // Bottom 4
            new Vertex( 0.0,  0.0,  2.0), // Top
          ];

        var faces = [
            new Polygon([vertices[0], vertices[1], vertices[2], vertices[3]]), // Bottom
            new Polygon([vertices[0], vertices[1], vertices[4]]), // Side 1 2
            new Polygon([vertices[0], vertices[2], vertices[4]]), // Side 1 3
            new Polygon([vertices[1], vertices[3], vertices[4]]), // Side 2 4
            new Polygon([vertices[2], vertices[3], vertices[4]]), // Side 3 4
          ];


         //using Oblique projection
         var angle = Math.atan(2);
         var angleXY = Math.atan(dy/dx);
         var angleXZ = Math.atan(dz/dx);
         var angleYZ = Math.atan(dz/dy);

        const mx = math.matrix([[1, 0, 0], [0, Math.cos(angleYZ), -Math.sin(angleYZ)], [0, Math.sin(angleXY), Math.cos(angleXY)]]);
        const my = math.matrix([[Math.cos(angleXZ), 0, Math.sin(angleXZ)], [0, 1, 0], [-Math.sin(angleXZ), 0, Math.cos(angleXZ)]]);
        const mz = math.matrix([[Math.cos(angleXY),-Math.sin(angleXY), 0], [Math.sin(angleXY), Math.cos(angleXY), 0], [0, 0, 1]]);
        const mRotation = math.multiply(math.multiply(mx,my),mz);
         var fx = function(vertex) {
          //const mVertex= math.matrix([Number(vertex.x())],[Number(vertex.y())],[Number(vertex.z())]);
          const mVertex = math.matrix([[vertex.x(),vertex.y(),vertex.z()]]);
          const mFinal = math.multiply(mVertex,mRotation);
             return (mFinal.subset(math.index(0,0)) + mFinal.subset(math.index(0,2)) * (Math.cos(angle)/2)) *size/7+400;
         };
         var fy = function(vertex) {
          const mVertex= math.matrix([[vertex.x(),vertex.y(),vertex.z()]]);
          const mFinal = math.multiply(mVertex,mRotation);
             return (mFinal.subset(math.index(0,1)) + mFinal.subset(math.index(0,2)) * (Math.sin(angle)/2))*size/7-150;
         };

        function DrawCameraShapes(context, polygon, fx, fy) {
            context.beginPath();
            
            // The -1 * is used to flip the y coordinate as y value increases
            // as you move down the canvas.
            context.moveTo(fx(polygon.vertex(0)), -1 * fy(polygon.vertex(0)));
            for (var i = 1; i < polygon.count(); ++i) {
                context.lineTo(fx(polygon.vertex(i)), -1 * fy(polygon.vertex(i)));
                //console.log(fx(polygon.vertex(i))+" "+fy(polygon.vertex(i)));
            }
            context.closePath();
            context.stroke();
        }

        var context4 = canvasCamera.getContext('2d');

        // Make the cube half the width of the canvas - need to be changed
        var size = canvasCamera.width / 2;



        for (var i = 0; i < faces.length; ++i) {
            DrawCameraShapes(context4, faces[i], fx, fy);
        }   
        
    context1.translate(canvasXY.width / 2, canvasXY.height / 2);
    context2.translate(canvasYZ.width / 2, canvasYZ.height / 2);
    context3.translate(canvasXZ.width / 2, canvasXZ.height / 2);
    context4.translate(canvasCamera.width / 2, canvasCamera.height / 2);
       

    DrawAxes("black", context1, 1);
    DrawAxes("black", context2, 2);
    DrawAxes("black", context3, 3);
    //context.save();
    DrawShape("red", context1, 1);
    DrawShape("red", context2, 2);
    DrawShape("red", context3, 3);
    //context.restore();
    DrawCamera('grey',context1,1);
    DrawCamera('grey',context2,2);
    DrawCamera('grey',context3,3);
    //context.restore();
    }

    function drawAni(){
      var context = canvas.getContext('2d');
      canvas.width = canvas.width;
      context.beginPath();
      context.rect(x,y,50,50);
      context.fillStyle = "green";
      context.fill();
      x = (x + 13) % slider.value;
      window.requestAnimationFrame(drawAni);
  
    };
    window.requestAnimationFrame(drawAni);
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    slider3.addEventListener("input",draw);
    draw();
    
}

  
window.onload = setup;
//or window.onload = function(){...the content in setup() function}