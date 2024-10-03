function setup() {
    
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext('2d');

    canvas.width = canvas.width;

    var gravity = 0.98;
    var windForce = 0.5; // Simulated wind force
    //var damping = 0.995; // Reduced damping for greater motion
    var iterations = 10; // XPBD iterations for constraint solving
    //var relaxation = 1;  // Relaxation parameter for XPBD
    var frame = 60;
    var lenthBet = 20;
    var elasticity = 0.5;
    var dampingCoefficient = 0.9;
    //from 0 - 1
    var stiffness = 0.9;
    var initXpos = 100;
    var numPoints = 5;

    let prePosX = [];
    let prePosY = [];
    let nowPosX = [];
    let nowPosY = [];
    let velocityX = [];
    let velocityY = [];
    let forceX = [];
    let forceY = [];
    let invmass = [];

    
    function init(){
        invmass[0] = 0;
        for(var i = 0 ; i < numPoints; ++i){
            nowPosX.push(initXpos);
            nowPosY.push(lenthBet * i);
            velocityX.push(0);
            velocityY.push(0);
            forceX.push(gravity);
            forceY.push(windForce);
            invmass.push(1);
        }
    }
    

    let lastTime = performance.now();
    let accumulatedTime = 0;
    //const timeStep = 1 / frame;

    function animate() {
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; 
        lastTime = currentTime;
        updateSimulation(deltaTime); 
        draw();
        requestAnimationFrame(animate);
    }

    function updateSimulation(deltaTime) {
        var itera = 0;
        while(itera < iterations){

        for(i = 0; i < numPoints; ++i){
            velocityX[i] += deltaTime * forceX[i];
            velocityY[i] += deltaTime * forceY[i];
            prePosX[i] = nowPosX[i];
            prePosY[i] = nowPosY[i];
            nowPosX[i] += deltaTime * velocityX[i];
            nowPosY[i] += deltaTime * velocityY[i];
        }
        for(i = 1; i < numPoints; ++i){
            //compute the elastic force 
            var dx = nowPosX[i-1]-nowPosX[i];
            var dy = nowPosY[i-1]-nowPosY[i];
            var distance = Math.sqrt(dx*dx+dy*dy);
            var deltaDis = distance - lenthBet;
            var elasFX = -elasticity * deltaDis * (dx/distance);
            var elasFY = -elasticity * deltaDis * (dy/distance);
            forceX[i] = gravity + elasFX;
            forceY[i] = windForce + elasFY;
            //1: predict position x = x^n + delta_t*v^n+ delta_t^2*M^-1*fext(x^n)
            var predX = nowPosX[i] + deltaTime * velocityX[i] + deltaTime * deltaTime * invmass[i] * forceX[i];
            var predY = nowPosY[i] + deltaTime * velocityY[i] + deltaTime * deltaTime * invmass[i] * forceY[i];

            //2:initialize solve x0 and lambda0
            var x0 = predX;
            var y0 = predY;
            var lambda0 = 0;

            //3: update delX and dexLambda 
            //only one constraints, no loop needed            
                //since we here only have one constraints that's the distance between two points, we don't need a for loop here
                //Cij = ∥disij∥−d
                // ke neng fan le
                var dx = nowPosX[i-1]-nowPosX[i];
                var dy = nowPosY[i-1]-nowPosY[i];
                var distance = Math.sqrt(dx*dx+dy*dy);
                var Cx = distance - lenthBet;
                //update lambda using (26) formular of the paper to include damping
                var alpha = 1/stiffness;
                var belta = dampingCoefficient;
                var alphaHat = alpha/(deltaTime*deltaTime);
                var beltaHat = deltaTime*deltaTime * belta;
                var gamma = alphaHat * beltaHat / deltaTime;
                //since the process is 2 dimentional, ∇C = (xi - xi+1)/||xi - xi+1||
                var gradientC = []
                gradientC.push(dx/distance);
                gradientC.push(dy/distance);
                var delLambdaN = (-Cx - alphaHat * lambda0 - gamma * (gradientC[0] * x0 + gradientC[1] * y0));
                var delLambdaD = (1+gamma) * (gradientC[0] * gradientC[0] + gradientC[1] * gradientC[1]) * (invmass[i-1] + invmass[i]) + alphaHat
                var delLambda = delLambdaN / delLambdaD;
                
                var delX = (invmass[i-1] + invmass[i]) * gradientC[0] * delLambda;
                var delY = (invmass[i-1] + invmass[i]) * gradientC[1] * delLambda;

                lambda0 += delLambda;
                x0 += delX;
                y0 += delY;
            
            nowPosX[i] = x0;
            nowPosY[i] = y0;
        }

        velocityX[i] = (nowPosX[i] - prePosX[i]) / deltaTime;
        velocityY[i] = (nowPosY[i] - prePosY[i]) / deltaTime;
        itera = itera + 1;
        }
    }

    function draw() {
        context.beginPath();
        context.moveTo(nowPosX[0], nowPosY[0]);
        for(var i = 0; i < numPoints; ++i){
            context.lineTo(nowPosX[0], nowPosY[0]);
        }
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
        }
    

    init();
    animate();  
}
window.onload = setup();