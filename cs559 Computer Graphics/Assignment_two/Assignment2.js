// Author:   Haoyu Wang
// Email:    hwang2376@wisc.edu
// Note:    The idea of a swaying rope is inspired by https://www.youtube.com/watch?v=SfGtcZb8yM8.
//          Learning material is from https://mmacklin.com/xpbd.pdf
//          However, after struggling, I failed to successfully implement XPDB on time to implement a swaying wire
//          The following links inspired me to use Verelet Integration instead
//          Links: https://gamedev.net/forums/topic/675751-verlet-integration-and-dampening/5277178/#:~:text=Velocity%20isn't%20really%20present%20in%20verlet,%20and%20calculating
//                  https://cs559featuredartists.github.io/hw2/score4/4/p2.html
function setup(){
    const canvas = document.getElementById('Canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var slider1 = document.getElementById('x');
    var slider2 = document.getElementById('y');
    var slider4 = document.getElementById('theta');
    var slider5 = document.getElementById('phi');
    var slider6 = document.getElementById('phi2');
    const trig = document.getElementById('b');
    
    var gravity = 0.98;
    var dampCoef = 1.0;
    var itera = 10; 

    let points = [];
    var numPoints = 20;
    var lenBet = 20;

    trig.addEventListener('click', ()=>{
        points[5].oldX -= 300; 
        points[9].oldX += 50;
    })

    class Point {
        constructor(x, y, fixed = false) {
            this.x = x;
            this.y = y;
            this.oldX = x;
            this.oldY = y;
            this.fixed = fixed;
        }

        update() {
            if (this.fixed) return;
            
            // Verlet integration
            const velX = (this.x - this.oldX) * dampCoef;
            const velY = (this.y - this.oldY) * dampCoef;

            this.oldX = this.x;
            this.oldY = this.y;
            
            this.x += velX;
            this.y += velY + gravity;
        }

    }

    function createRope() {
        for (let i = 0; i < numPoints; i++) {
            const x = 0;
            const y = 50 + i * lenBet;
            points.push(new Point(x, y, i === 0)); // The first point is fixed
        }
    }

    function applyConstraints() {
        for (let iteration = 0; iteration < itera; iteration++) {
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const difference = lenBet - dist;
                const percent = difference / dist / 2;

                if (!p1.fixed) {
                    p1.x -= percent * dx;
                    p1.y -= percent * dy;
                }
                if (!p2.fixed) {
                    p2.x += percent * dx;
                    p2.y += percent * dy;
                }
            }
        }
    }

    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var dx = slider1.value;
        var dy = slider2.value;
        var theta = slider4.value*0.005*Math.PI;
        var phi = slider5.value*0.005*Math.PI;
        var phi2 = slider6.value*0.005*Math.PI;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(theta);
        // drawStick();
        ctx.strokeStyle = 'brown';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 400 );
        ctx.lineWidth = 30;
        ctx.stroke();
        ctx.save();
        ctx.translate(300, 350);
        ctx.rotate(-phi);
        //draw rope1
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.stroke();
        //draw rope2
        ctx.restore();
        ctx.translate(300, 340);
        ctx.rotate(-phi2);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
        
    }

    function update() {
        points.forEach(point => point.update());
        applyConstraints();
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    createRope();
    animate();
} window.onload = setup();
