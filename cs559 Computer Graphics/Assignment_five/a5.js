// Author:   Haoyu Wang
// Email:    hwang2376@wisc.edu
function setup(){
    var canvas = document.getElementById('Canvas');
    var ctx = canvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
    const trig = document.getElementById('b');
    const tra = document.getElementById('s');
    var cameraNormal = vec3.create();
    var w = 0;


    var distance = 200;
    var hor = 0;
    var dx = 0;
    var drunk = 0;
    var trajec = 0;
    
    function draw(){       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        
        var tParam = slider1.value*0.01;
        var viewAngle = slider2.value*0.02*Math.PI;
        
       
        function moveToTx(loc,Tx){
            var res = vec3.create();
            vec3.transformMat4(res,loc,Tx); 
            ctx.moveTo(res[0],res[1]);
        }

	    function lineToTx(loc,Tx){
            var res = vec3.create(); 
            vec3.transformMat4(res,loc,Tx); 
            ctx.lineTo(res[0],res[1]);
        }
//------------------------Draw---------------------------------------

        function computeNormal(p1, p2, p3) {
            let u = vec3.create();
            let v = vec3.create();
            let normal = vec3.create();
            vec3.subtract(u, p2, p1);
            vec3.subtract(v, p3, p1);

            vec3.cross(normal, u, v);

            return normal;
        }

        function drawWing(T){
            var Tx = mat4.create();
            if(w === 1){
                mat4.scale(Tx, T, [0.8,0.5,0.9]);
            } else{
                mat4.scale(Tx, T, [1,1,1]);
            }
            
            //wing
            ctx.beginPath();
            moveToTx([-.200, .150, .2], Tx);
            lineToTx([.160, .50, .0], Tx);
            lineToTx([.240, .80, -.3], Tx);
            ctx.closePath();
            ctx.fillStyle = '#666666'; 
            ctx.fill();
            ctx.strokeStyle = '#333333';
            ctx.stroke();
        }

 
        function drawObject(T) {
            var scale = 100;
            var Tx = mat4.create();
            mat4.scale(Tx,T,[scale,scale,scale]);
            
            var p1 = [.150, .300, .2];
            var p2 = [.220, .100, .2]; 
            var p3 = [.400, .100, .2]; 
            var p4 = [.450, .300, .2]; 
            var p5 = [.380, .420, .2]; 
            var p6 = [.200, .420, .2];

            var faceNormal = computeNormal(p1,p2,p3);

            if (vec3.dot(faceNormal, cameraNormal) >= 0){
                //eyes
                ctx.beginPath();
                moveToTx([.240, .380, .2], Tx);
                lineToTx([.250, .395, .2], Tx);
                lineToTx([.260, .380, .2], Tx);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.beginPath();
                moveToTx([.280, .380, .2], Tx);
                lineToTx([.290, .395, .2], Tx);
                lineToTx([.300, .380, .2], Tx);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.beginPath();
                moveToTx([.320, .380, .2], Tx);
                lineToTx([.330, .395, .2], Tx);
                lineToTx([.340, .380, .2], Tx);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.beginPath();
                moveToTx([.360, .380, .2], Tx);
                lineToTx([.370, .395, .2], Tx);
                lineToTx([.380, .380, .2], Tx);
                ctx.closePath();
                ctx.fillStyle = '#fff';
                ctx.fill();

            }
             //mouth
             ctx.beginPath();
             moveToTx(p1,Tx);
             lineToTx(p2,Tx);
             lineToTx(p3,Tx);
             lineToTx(p4,Tx);
             lineToTx(p5,Tx);
             lineToTx(p6,Tx);
             ctx.closePath();
             ctx.fillStyle = '#1a1a1a';
             ctx.fill();
             ctx.strokeStyle = '#990000'; 
             ctx.lineWidth = 5;
             ctx.stroke();
            
            var p7 = [.3,0,-.3];
            //body
            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p1, Tx);
            lineToTx(p2, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();
            
            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p2, Tx);
            lineToTx(p3, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();
            
            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p3, Tx);
            lineToTx(p4, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p4, Tx);
            lineToTx(p5, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p5, Tx);
            lineToTx(p6, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();

            ctx.beginPath();
            moveToTx(p7, Tx); 
            lineToTx(p6, Tx);
            lineToTx(p1, Tx);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.lineWidth = 5;
            ctx.stroke();

            //face
            ctx.beginPath();
            moveToTx([.230, .380, .2], Tx); 
            lineToTx([.250, .400, .2], Tx); 
            lineToTx([.270, .380, .2], Tx); 
            lineToTx([.290, .400, .2], Tx); 
            lineToTx([.310, .380, .2], Tx); 
            lineToTx([.330, .400, .2], Tx); 
            lineToTx([.350, .380, .2], Tx); 
            lineToTx([.370, .400, .2], Tx); 
            lineToTx([.390, .380, .2], Tx);
            lineToTx([.370, .420, .2], Tx); 
            lineToTx([.230, .420, .2], Tx); 
            ctx.closePath();
            ctx.fillStyle = '#ff6666';
            ctx.fill();
            ctx.strokeStyle = '#990000'; 
            ctx.stroke();

            drawWing(Tx);
            mat4.scale(Tx, Tx, [-1,1,1]);
            mat4.translate(Tx,Tx,[-.6,0,0]);
            drawWing(Tx);

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

        function draw3DAxes(color,TxU,scale) {
            var Tx = mat4.clone(TxU);
            mat4.scale(Tx,Tx,[scale,scale,scale]);

            ctx.strokeStyle=color;
            ctx.beginPath();
            // Axes
            moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
            moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
            // Arrowheads
            moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
            moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
            moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
            // X-label
            moveToTx([1.3,-.05,0],Tx);lineToTx([1.4,.05,0],Tx);
            moveToTx([1.3,.05,0],Tx);lineToTx([1.4,-.05,0],Tx);
            // Y-label
            moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.35,0],Tx);lineToTx([.05,1.4,0],Tx);
            moveToTx([0,1.35,0],Tx);lineToTx([0,1.28,0],Tx);
            // Z-label
            moveToTx([-.05,0,1.3],Tx);
            lineToTx([.05,0,1.3],Tx);
            lineToTx([-.05,0,1.4],Tx);
            lineToTx([.05,0,1.4],Tx);

            ctx.stroke();
        }

        function drawUpVector(color,vecUp,Tx) {
            ctx.strokeStyle=color;
            ctx.beginPath();
            // A single line segment in the "up" direction
            moveToTx([0,0,0],Tx);
            lineToTx(vecUp,Tx);
            ctx.stroke();
        }
        
//------------------------Cubic--------------------------------------


        var p0=[30,-60,-40];
        var d0=[1,2,3];
        var a0=[1,3,-4];

        var p1=[-54,80,50];
        var d1=[-1,3,8];
        var a1=[2,3,10];

        var p2=[61,71,62];
        var d2=[0,3,7];
        var a2=[3,5,-7];

        var p3=[-67,-63,44];
        var d3=[0,3,2];
        var a3=[3,-3,0];

        var P0 = [d0,a0,d1,a1]; 
        var P1 = [d1,a1,d2,a2]; 
        var P2 = [d2,a2,d3,a3];
        var P3 = [d3,a3,d0,a0];

        var Costumized_one = function(t){
            return [
                t,
                t*t/2-t*t*t/6,
                0,
                t*t*t/6
            ]
        }

        var Costumized_two = function(t){
            return [
                t-t*t*t/3,
                t*t/2-t*t*t/3,
                t*t*t/3,
                0
            ]
        }

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
            var result = vec3.create();
            vec3.scale(result, P[0], b[0])
            vec3.scaleAndAdd(result,result,P[1],b[1]);
	        vec3.scaleAndAdd(result,result,P[2],b[2]);
	        vec3.scaleAndAdd(result,result,P[3],b[3]);
            return result;
        }

        var C0 = function(_t){
            return Cubic(Costumized_one, P0, _t);
        };

        var C1 = function(_t){
            return Cubic(Costumized_one, P1, _t);
        };

        var C2 = function(_t){
            return Cubic(Costumized_two, P2, _t);
        };

        var C3 = function(_t){
            return Cubic(Costumized_two, P3, _t);
        };

        var H0 = [p0,d0,p1,d1]; 
        var H1 = [p1,d1,p2,d2];
        var H2 = [p2,d2,p3,d3];
        var H3 = [p3,d3,p0,d0];
        
        var C0H = function(_t){
            return Cubic(Herimite, H0, _t);
        };
        var C1H = function(_t){
            return Cubic(Herimite, H1, _t);
        };
        var C2H = function(_t){
            return Cubic(Herimite, H2, _t);
        };
        var C3H = function(_t){
            return Cubic(Herimite, H3, _t);
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

        var CcompHermite = function(t) {
            if (t<1){
                var u = t;
                return C0H(u);
            } else if (t<2){
                var u = t-1;
                return C1H(u);
            } else if (t<3){
                var u = t-2;
                return C2H(u);
            } else{
                var u = t-3;
                return C3H(u);
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
//------------------------------Camera----------------------------------------------------------------------
        var CameraCurve = function(viewAngle,distance) {
            var eye = vec3.create();
            eye[0] = distance*Math.sin(viewAngle);
            eye[1] = 100;
            eye[2] = distance*Math.cos(viewAngle);  
            return [eye[0],eye[1],eye[2]];
        }
//------------------------------Main------------------------------------------------------------------------
        


        var eyeCamera = CameraCurve(viewAngle, distance);
        var targetCamera = vec3.fromValues(hor,0,0); // Aim at the origin of the world coords
        var upCamera = vec3.fromValues(dx,100,0); // Y-axis of world coords to be vertical
        var TlookAtCamera = mat4.create();
        mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
        vec3.subtract(cameraNormal, targetCamera, eyeCamera);

        var windowTransform = mat4.create();
        mat4.fromTranslation(windowTransform,[200,300,0]);
	    mat4.scale(windowTransform,windowTransform,[100,-100,1]);

        var tProjection = mat4.create();
        mat4.perspective(tProjection, Math.PI/4, 1, -1, 1);

        var tVP_PROJ_VIEW_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_Camera,windowTransform,tProjection);
        mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);

        //model
        var Tmodel = mat4.create();
        mat4.fromTranslation(Tmodel,CcompHermite(tParam));
        var tangent = Ccomp_tangent(tParam);
        var angle = Math.atan2(tangent[1],tangent[0]);
	    mat4.rotateZ(Tmodel,Tmodel,angle);
        // var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
	    // mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);

        //ctx.translate(200,300);
        //draw
        draw3DAxes("grey",tVP_PROJ_VIEW_Camera,100.0);
        drawUpVector("orange",upCamera,tVP_PROJ_VIEW_Camera,1.0);

        var tVP_PROJ_VIEW_MOD_Object = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_MOD_Object, tVP_PROJ_VIEW_Camera, Tmodel);

        // ctx.translate(400,400);
        drawObject(tVP_PROJ_VIEW_MOD_Object);
        drawTraject(0.0, 4.0, 100, C0, tVP_PROJ_VIEW_Camera, 'yellow');
        drawTraject(0.0, 4.0, 100, C1, tVP_PROJ_VIEW_Camera, 'blue');
        drawTraject(0.0, 4.0, 100, C2, tVP_PROJ_VIEW_Camera, 'black');
        drawTraject(0.0, 4.0, 100, C3, tVP_PROJ_VIEW_Camera, 'green');
        
        if(trajec === 1){
            drawTraject(0.0, 1.0, 100, C0H, tVP_PROJ_VIEW_Camera, 'purple');
            drawTraject(0.0, 1.0, 100, C1H, tVP_PROJ_VIEW_Camera, 'purple');
            drawTraject(0.0, 1.0, 100, C2H, tVP_PROJ_VIEW_Camera, 'purple');
            drawTraject(0.0, 1.0, 100, C3H, tVP_PROJ_VIEW_Camera, 'purple');
        }
    }
    
    function animate() {
        if(drunk == 1){
        var random = Math.random() * 10 - 5;
        dx = dx + random;
        }
        w = w === 0 ? 1 : 0;
        draw();
        requestAnimationFrame(animate);
        
    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    document.addEventListener("keydown",(event) => {
        if(event.key === "w"||event.key === "W"){
            distance = distance - 10;
            draw();
        }
        if(event.key === "s"||event.key === "S"){
            distance = distance + 10;
            draw();
        }
        if(event.key === "a"||event.key === "A"){
            hor = hor - 10;
            draw();
        }
        if(event.key === "d"||event.key === "D"){
            hor = hor + 10;
            draw();
        }
    });
    trig.addEventListener('click', ()=>{
        drunk = drunk === 0 ? 1 : 0;
        draw();
    })
    tra.addEventListener('click', ()=>{
        trajec = trajec === 0 ? 1 : 0;
        draw();
    })
    draw();
    animate();
}
window.onload = setup;