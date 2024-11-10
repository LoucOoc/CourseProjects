// Author:   Haoyu Wang
// Email:    hwang2376@wisc.edu
// Time:     10/21/2024
//Note: this version is adapted from the class jsbin sample code https://output.jsbin.com/bodorun; The origional idea was to add fire simulation feature on fireball and the castle based on https://www.youtube.com/watch?v=RsgmS3ZxDtc, but failed due to time limit, will update on github (github.com/LoucOoc) if there's enough time in future 
function setup(){
    var canvas = document.getElementById('MonsterCanvas');
    var ctx = canvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = -25;
    var hit = 0;
    var trig = document.getElementById('b');
    var img = document.getElementById("background");

    function draw(){       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var tParam = slider1.value*0.01;
        var castlePosX = 1000.0;
        var castlePosY = 500.0;

        function moveToTx(loc,Tx){
            var res = vec2.create();
            vec2.transformMat3(res,loc,Tx); 
            ctx.moveTo(res[0],res[1]);
        }

	    function lineToTx(loc,Tx){
            var res = vec2.create(); 
            vec2.transformMat3(res,loc,Tx); 
            ctx.lineTo(res[0],res[1]);
        }
        

//------------------------Shapes------------------------------------------

        function drawCastle(dx, dy) {
            ctx.save();
            ctx.translate(dx, dy);
            ctx.fillStyle = '#808080'; 
            ctx.fillRect(100, 150, 400, 150); 

            ctx.fillStyle = '#696969';
            ctx.fillRect(80, 100, 60, 200); 
            ctx.fillRect(460, 100, 60, 200);

            ctx.beginPath();
            ctx.moveTo(80, 100); 
            ctx.lineTo(110, 50);
            ctx.lineTo(140, 100);
            ctx.closePath();
            ctx.fillStyle = '#B22222';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(460, 100);
            ctx.lineTo(490, 50);
            ctx.lineTo(520, 100);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(270, 300); 
            ctx.lineTo(330, 300);
            ctx.arc(300, 300, 30, 0, Math.PI, true);
            ctx.closePath();
            ctx.fillStyle = '#333'; 
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.stroke();

            ctx.fillStyle = '#000';
            ctx.fillRect(100, 150, 20, 40); 
            ctx.fillRect(480, 150, 20, 40); 

            ctx.fillRect(180, 180, 30, 30);
            ctx.fillRect(250, 180, 30, 30);
            ctx.fillRect(320, 180, 30, 30);
            ctx.fillRect(390, 180, 30, 30);
            ctx.restore();
        }

        function drawDestroyedCastle(dx, dy) {
            ctx.save();
            ctx.translate(dx, dy);
            ctx.fillStyle = '#555555';
            ctx.fillRect(100, 150, 400, 150);

            ctx.strokeStyle = '#000'; 
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(120, 200); 
            ctx.lineTo(150, 230);
            ctx.lineTo(130, 270);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(380, 190); 
            ctx.lineTo(420, 220);
            ctx.lineTo(400, 260);
            ctx.stroke();

            ctx.fillStyle = '#444444';
            ctx.fillRect(80, 130, 60, 170); 
            ctx.fillRect(460, 100, 60, 200); 

            ctx.beginPath();
            ctx.moveTo(100, 180); 
            ctx.lineTo(90, 210);
            ctx.lineTo(110, 250);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(480, 150);
            ctx.lineTo(500, 180);
            ctx.lineTo(490, 220);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(80, 130); 
            ctx.lineTo(110, 90);
            ctx.lineTo(140, 130);
            ctx.closePath();
            ctx.fillStyle = '#B22222';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(460, 100);
            ctx.lineTo(490, 50);
            ctx.lineTo(520, 100);
            ctx.closePath();
            ctx.fillStyle = '#B22222';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(270, 300); 
            ctx.lineTo(330, 300);
            ctx.arc(300, 300, 30, 0, Math.PI, true);
            ctx.lineTo(270, 300);
            ctx.fillStyle = '#333';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.stroke();

            ctx.fillStyle = '#000';
            ctx.fillRect(100, 150, 20, 40); 
            ctx.fillRect(480, 150, 20, 40); 

            ctx.clearRect(190, 190, 30, 20); 
            ctx.clearRect(350, 190, 30, 20); 

            ctx.fillStyle = '#444444';
            ctx.fillRect(150, 280, 30, 10);
            ctx.fillRect(170, 290, 50, 10);
            ctx.fillRect(400, 280, 30, 10);
            ctx.fillRect(380, 290, 50, 10);
            ctx.restore();
        }
        
        function drawObject(color,Tx) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.beginPath();
            moveToTx([0,0], Tx); 
            lineToTx([.150, .300], Tx);
            lineToTx([.220, .100], Tx);
            ctx.closePath();
            ctx.fillStyle = '#666666';
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            moveToTx([.150, .300], Tx); 
            lineToTx([.220, .100], Tx); 
            lineToTx([.400, .100], Tx); 
            lineToTx([.450, .300], Tx); 
            lineToTx([.380, .420], Tx); 
            lineToTx([.200, .420], Tx); 
            ctx.closePath();
            ctx.fillStyle = '#1a1a1a';
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();
           
            ctx.beginPath();
            moveToTx([-.200, .150], Tx);
            lineToTx([.160, .50], Tx);
            lineToTx([.240, .80], Tx);
            ctx.closePath();
            ctx.fillStyle = '#666666'; 
            ctx.fill();
            ctx.strokeStyle = '#333333';
            ctx.stroke();

            ctx.beginPath();
            moveToTx([.500, .150], Tx);
            lineToTx([.360, .50], Tx);
            lineToTx([.440, .80], Tx);
            ctx.closePath();
            ctx.fillStyle = '#666666';
            ctx.fill();
            ctx.strokeStyle = '#333333';
            ctx.stroke();

            ctx.beginPath();
            moveToTx([.230, .380], Tx); 
            lineToTx([.250, .400], Tx); 
            lineToTx([.270, .380], Tx); 
            lineToTx([.290, .400], Tx); 
            lineToTx([.310, .380], Tx); 
            lineToTx([.330, .400], Tx); 
            lineToTx([.350, .380], Tx); 
            lineToTx([.370, .400], Tx); 
            lineToTx([.390, .380], Tx);
            lineToTx([.370, .420], Tx); 
            lineToTx([.230, .420], Tx); 
            ctx.closePath();
            ctx.fillStyle = '#ff6666';
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.stroke();

            ctx.beginPath();
            moveToTx([.240, .380], Tx);
            lineToTx([.250, .395], Tx);
            lineToTx([.260, .380], Tx);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.beginPath();
            moveToTx([.280, .380], Tx);
            lineToTx([.290, .395], Tx);
            lineToTx([.300, .380], Tx);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.beginPath();
            moveToTx([.320, .380], Tx);
            lineToTx([.330, .395], Tx);
            lineToTx([.340, .380], Tx);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.fill();

            ctx.beginPath();
            moveToTx([.360, .380], Tx);
            lineToTx([.370, .395], Tx);
            lineToTx([.380, .380], Tx);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.fill();
        }

//------------------------Trajectory Monster--------------------------------------
        var p0=[3,-1];
	    var d0=[1,2];
	    var p1=[1,0];
	    var d1=[-1,3];
	    var p2=[2,1];
	    var d2=[0,3];
        var p3=[7,1];
	    var d3=[0,3];

        var P0 = [p0,d0,p1,d1]; 
	    var P1 = [p1,d1,p2,d2]; 
        var P2 = [p2,d2,p3,d3];
        var P3 = [p3,d3,p0,d0];

        var Herimite = function(t){
            return [
                2*t*t*t-3*t*t+1,
		        t*t*t-2*t*t+t,
		        -2*t*t*t+3*t*t,
		        t*t*t-t*t
            ];
        }

        var HerimiteDerivative = function(t){
            return [
                6*t*t-6*t,
                3*t*t-4*t+1,
                -6*t*t+6*t,
                3*t*t-2*t
            ];
        }

        function Cubic(basis, P, t){
            var b = basis(t);
            var result = vec2.create();
            vec2.scale(result, P[0], b[0])
            vec2.scaleAndAdd(result,result,P[1],b[1]);
	        vec2.scaleAndAdd(result,result,P[2],b[2]);
	        vec2.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }


        var C0 = function(_t){
            return Cubic(Herimite, P0, _t);
        };

        var C1 = function(_t){
            return Cubic(Herimite, P1, _t);
        };

        var C2 = function(_t){
            return Cubic(Herimite, P2, _t);
        };

        var C3 = function(_t){
            return Cubic(Herimite, P3, _t);
        };

        var C0P = function(_t){
            return Cubic(HerimiteDerivative, P0, _t);
        };

        var C1P = function(_t){
            return Cubic(HerimiteDerivative, P1, _t);
        };

        var C2P = function(_t){
            return Cubic(HerimiteDerivative, P2, _t);
        };

        var C3P = function(_t){
            return Cubic(HerimiteDerivative, P3, _t);
        };

        var Ccomp = function(t) {
            if (t<1){
                var u = t;
                return C0(u);
            } else if (t<2){
                var u = t-1;
                return C1(u);
            } else if (t<3){
                var u = t-2;
                return C2(u);
            } else{
                var u = t-3;
                return C3(u);
            }
        }
    
        var Ccomp_tangent = function(t) {
            if (t<1){
                var u = t;
                return C0P(u);
            } else if (t<2){
                var u = t-1;
                return C1P(u);
            } else if (t<3){
                var u = t-2;
                return C2P(u);
            } else{
                var u = t-3;
                return C3P(u);
            }   
        }


        var Tblue_to_canvas = mat3.create();
        mat3.fromTranslation(Tblue_to_canvas, [50, 350]);
        mat3.scale(Tblue_to_canvas, Tblue_to_canvas, [150, -150]);
        drawTraject(0.0, 1.0, 100, C0, Tblue_to_canvas, 'yellow');
        var Tgreen_to_blue = mat3.create();
        mat3.fromTranslation(Tgreen_to_blue, Ccomp(tParam));

        var Tgreen_to_canvas = mat3.create();
        var tangent = Ccomp_tangent(tParam);
        var angle = Math.atan2(tangent[1],tangent[0]);
	    mat3.rotate(Tgreen_to_blue,Tgreen_to_blue,angle);
	    mat3.multiply(Tgreen_to_canvas, Tblue_to_canvas, Tgreen_to_blue);
//--------------------------------Trajectory Fireball---------------------------------------------------
        var p4=[0,0];
        p4 = vec2.add(p4,p4,Ccomp(tParam))
        var p5=[2,2];
        var p6=[1,2];
        var p7=[2,1];

        var P4 = [p4,p5,p6,p7]; 

        var BSpines = function(t){
            return [
                (-1*t*t*t+3*t*t-3*t+1)/6,
                (3*t*t*t-6*t*t+4)/6,
                (-3*t*t*t+3*t*t+3*t+1)/6,
                (1*t*t*t)/6
            ];
        }

        var C4 = function(_t){
            return Cubic(BSpines, P4, _t);
        };

        
        function drawFireball(Tx){
            ctx.fillStyle = 'black';
            ctx.strokeStyle='red';
            ctx.beginPath();
            moveToTx([0,.5],Tx);
            lineToTx([-.5,-.5],Tx);
            lineToTx([.5,-.5],Tx);
            moveToTx([0,-.5],Tx)
            lineToTx([-.5,.5],Tx);
            lineToTx([.5,.5],Tx);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        var dis = 0;
        var frame = 1/30;
        var v = 0.5;
        function animate(){
            // Clear the previous frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
            // Redraw the static background (castle, trajectory, etc.)
            drawTraject(0.0, 1.0, 100, C0, Tblue_to_canvas, 'yellow');
            drawTraject(0.0, 1.0, 100, C1, Tblue_to_canvas, 'blue');
            drawTraject(0.0, 1.0, 100, C2, Tblue_to_canvas, 'black');
            drawTraject(0.0, 1.0, 100, C3, Tblue_to_canvas, 'green');
            drawTraject(0.0, 4.0, 100, C4, Tblue_to_canvas, 'red');
            drawObject("green", Tgreen_to_canvas);
            
            drawPoint(p4);
            drawPoint(p5);
            drawPoint(p6);
            drawPoint(p7);

            if(hit == 0){
                drawCastle(castlePosX, castlePosY);
            } else {
                drawDestroyedCastle(castlePosX, castlePosY);
            }
        
            // Animation logic
            var fireMat = mat3.create();
            mat3.fromTranslation(fireMat, C4(dis));
            mat3.multiply(fireMat, Tblue_to_canvas, fireMat);
            drawFireball(fireMat);
            console.log(slider1.value);
            dis += frame * v;
            if(dis <= 4){
                requestAnimationFrame(animate);
            } else{
                if(slider1.value>=203 && slider1.value<=267){
                    hit = 1;
                }
                dis = 0;
            }
        }

        trig.addEventListener('click', ()=>{
            animate();
        })

//------------------------------Draw------------------------------------------------------------------------
        function drawPoint(loc){
            var Tx = mat3.create();
            
            // Create a translation matrix from loc
            mat3.fromTranslation(Tx, loc);
            
            // Multiply the translation matrix with the existing transformation
            mat3.multiply(Tx, Tblue_to_canvas, Tx);
            
            ctx.beginPath();
            ctx.fillStyle = 'red';
            
            // Draw a small square centered at the location
            moveToTx([-.05, -.05], Tx);
            lineToTx([-.05, .05], Tx);
            lineToTx([.05, .05], Tx);
            lineToTx([.05, -.05], Tx);
            
            ctx.closePath();
            ctx.fill();
        }

        function drawTraject(t_begin, t_end, intervals, C, Tx, color){
            ctx.strokeStyle = color;
            ctx.beginPath();
            moveToTx(C(t_begin), Tx);
            for(var i = 0; i<=intervals; i++){
                var t = ((intervals - i)/intervals) * t_begin + (i/intervals) * t_end;
                lineToTx(C(t), Tx);
            }
            ctx.stroke();
        }

        drawTraject(0.0, 1.0, 100, C0, Tblue_to_canvas, 'yellow');
        drawTraject(0.0, 1.0, 100, C1, Tblue_to_canvas, 'blue');
        drawTraject(0.0, 1.0, 100, C2, Tblue_to_canvas, 'black');
        drawTraject(0.0, 1.0, 100, C3, Tblue_to_canvas, 'green');
        drawTraject(0.0, 4.0, 100, C4, Tblue_to_canvas, 'red');
	    drawObject("green",Tgreen_to_canvas);

        drawPoint(p4);
        drawPoint(p5);
        drawPoint(p6);
        drawPoint(p7);
        if(hit == 0){
            drawCastle(castlePosX,castlePosY);
        } else{
            drawDestroyedCastle(castlePosX, castlePosY);
        }

    }

    
    slider1.addEventListener("input",draw);
    draw();
}
window.onload = setup;