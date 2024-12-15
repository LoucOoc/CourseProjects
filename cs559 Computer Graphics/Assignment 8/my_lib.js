
function loadShaders(gl, vertexName, fragmentName, type){
    // Read shader source
    var vertexSource = document.getElementById(vertexName).text;
    var fragmentSource = document.getElementById(fragmentName).text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert("ve"+gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert("fr"+gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);

    //set uniforms and attributes
    if(type === 0){
      //dummy and weapon
      // with the vertex shader, we need to pass it positions
      // as an attribute - so set up that communication
      shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
      gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
      
      shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
      gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

      shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
      gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
    
      // this gives us access to the matrix uniform
      shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
      shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
      shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");
      shaderProgram.type = gl.getUniformLocation(shaderProgram,"type");

      // Attach samplers to texture units
      shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
      gl.uniform1i(shaderProgram.texSampler1, 0);

      shaderProgram.texSampler_d_1 = gl.getUniformLocation(shaderProgram, "texSampler_d_1");
      gl.uniform1i(shaderProgram.texSampler_d_1, 1);

      shaderProgram.texSampler_d_2 = gl.getUniformLocation(shaderProgram, "texSampler_d_2");
      gl.uniform1i(shaderProgram.texSampler_d_2, 2);

      shaderProgram.texSampler_d_3 = gl.getUniformLocation(shaderProgram, "texSampler_d_3");
      gl.uniform1i(shaderProgram.texSampler_d_3, 3);

      shaderProgram.texSampler_d_4 = gl.getUniformLocation(shaderProgram, "texSampler_d_4");
      gl.uniform1i(shaderProgram.texSampler_d_4, 4);
    } else if (type === 1){
      //sky box
      shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
      gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
      
      shaderProgram.invMat = gl.getUniformLocation(shaderProgram, "u_viewDirectionProjectionInverse");
      
      shaderProgram.texSky = gl.getUniformLocation(shaderProgram, "u_skybox");
      gl.uniform1i(shaderProgram.texSky, 5);

    } else if (type === 2){
      //reflection cube
      shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
      gl.enableVertexAttribArray(shaderProgram.PositionAttribute);

      shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
      gl.enableVertexAttribArray(shaderProgram.NormalAttribute);

      shaderProgram.Projectionmatrix = gl.getUniformLocation(shaderProgram,"u_projection");
      shaderProgram.Viewmatrix = gl.getUniformLocation(shaderProgram,"u_view");
      shaderProgram.Worldmatrix = gl.getUniformLocation(shaderProgram,"u_world");
      shaderProgram.CameraPos = gl.getUniformLocation(shaderProgram,"u_worldCameraPosition");

      shaderProgram.texReflection = gl.getUniformLocation(shaderProgram, "u_texture");
      gl.uniform1i(shaderProgram.texReflection, 6);
    }
    return shaderProgram;
}

// Fill the buffer with the values that define a cube.
function setGeometry(gl) {
    var positions = new Float32Array(
      [
      -0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
       0.5, -0.5,  -0.5,
      -0.5,  0.5,  -0.5,
       0.5,  0.5,  -0.5,
       0.5, -0.5,  -0.5,
  
      -0.5, -0.5,   0.5,
       0.5, -0.5,   0.5,
      -0.5,  0.5,   0.5,
      -0.5,  0.5,   0.5,
       0.5, -0.5,   0.5,
       0.5,  0.5,   0.5,
  
      -0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
       0.5,   0.5, -0.5,
      -0.5,   0.5,  0.5,
       0.5,   0.5,  0.5,
       0.5,   0.5, -0.5,
  
      -0.5,  -0.5, -0.5,
       0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,  -0.5,  0.5,
       0.5,  -0.5, -0.5,
       0.5,  -0.5,  0.5,
  
      -0.5,  -0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5, -0.5,
      -0.5,  -0.5,  0.5,
      -0.5,   0.5,  0.5,
      -0.5,   0.5, -0.5,
  
       0.5,  -0.5, -0.5,
       0.5,   0.5, -0.5,
       0.5,  -0.5,  0.5,
       0.5,  -0.5,  0.5,
       0.5,   0.5, -0.5,
       0.5,   0.5,  0.5,
  
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function setGeometry_skyBox(gl) {
    var positions = new Float32Array(
      [
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  }
  
  // Fill the buffer with normals for cube
function setNormals(gl) {
    var normals = new Float32Array(
    [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,

        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,

        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,

        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,

        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,

        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}

    


function radToDeg(r) {
    return r * 180 / Math.PI;
  }

function degToRad(d) {
return d * Math.PI / 180;
}

function drawWeapon(gl, tCamera, tProjection, equip, shaderProgram) {   
    tModel = mat4.create();
    mat4.fromScaling(tModel, [0.15, 0.15, 0.15]);

    // Equip weapon
    if (equip === 1) {
        mat4.fromTranslation(tModel, [0, -200, -200]);
        //mat4.scale(tModel, tModel, [0.9, 0.9, 0.9]);
        mat4.multiply(tModel, tAnimation, tModel);
    }

    // Apply rotation
    //mat4.rotate(tModel, tModel, angle2, [1, 1, 1]);   

    // Compute matrices
    tMV = mat4.create();
    tMVn = mat3.create();
    tMVP = mat4.create();
    type = 1; // type = 1 for weapon

    if (equip === 0) {
        mat4.multiply(tMV, tCamera, tModel); // "modelView" matrix
    } else {
        tMV = mat4.clone(tModel);
    }

    mat3.normalFromMat4(tMVn, tMV);
    mat4.multiply(tMVP, tProjection, tMV);

    // Set up uniforms & attributes
    gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, tMV);
    gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix, false, tMVn);
    gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, tMVP);
    gl.uniform1i(shaderProgram.type, type);

    // Bind data
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_weapon);
    gl.vertexAttribPointer(
        shaderProgram.PositionAttribute, 
        trianglePosBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_weapon);
    gl.vertexAttribPointer(
        shaderProgram.NormalAttribute, 
        triangleNormalBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_weapon);
    gl.vertexAttribPointer(
        shaderProgram.texcoordAttribute, 
        textureBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_weapon);

    // Do the drawing 
    gl.drawElements(gl.TRIANGLES, triangleIndices_weapon.length, gl.UNSIGNED_SHORT, 0);
}


