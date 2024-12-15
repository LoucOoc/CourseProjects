//Author: Haoyu Wang
//Email: hwang2376@wisc.edu
//CS559
function start(){
  var canvas = document.getElementById("mycanvas");
  var gl = canvas.getContext("webgl");
  var p = document.getElementById('z');
  
  var equip = 0;
  var isFocused = false;

  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/px.png',
      eye: [1, 0, 0], up: [0, -1, 0],
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/nx.png',
      eye: [-1, 0, 0], up: [0, -1, 0],
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/py.png',
      eye: [0, 1, 0], up: [0, 0, 1],
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/ny.png',
      eye: [0, -1, 0], up: [0, 0, -1],
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/pz.png',
      eye: [0, 0, 1], up: [0, -1, 0],
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
      url: 'https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/skybox/nz.png',
      eye: [0, 0, -1], up: [0, -1, 0],
    },
  ];


  //programs
  var mainProgram = loadShaders(gl,"vertexShader_1", "fragmentShader_1", 0);
  var skyProgram = loadShaders(gl,"skybox-vertex-shader", "skybox-fragment-shader", 1);
  var refProgram = loadShaders(gl,"envmap-vertex-shader", "envmap-fragment-shader", 2);

  //data buffer setting
  //training dummy-----------------------------------------------------------------------------------
  var dummy = my_model_dummy;
  var positions_dummy = dummy.vertexPos;
  var normals_dummy = dummy.vertexNormals; 
  var triangleIndices_dummy = dummy.triangleIndices;
  var textureCord_dummy = dummy.vertexTextureCoords;
  
  var trianglePosBuffer_dummy = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_dummy);
  gl.bufferData(gl.ARRAY_BUFFER, positions_dummy, gl.STATIC_DRAW);
  trianglePosBuffer_dummy.itemSize = 3;
  trianglePosBuffer_dummy.numItems = positions_dummy.length/3;
  
  // a buffer for normals
  var triangleNormalBuffer_dummy = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_dummy);
  gl.bufferData(gl.ARRAY_BUFFER, normals_dummy, gl.STATIC_DRAW);
  triangleNormalBuffer_dummy.itemSize = 3;
  triangleNormalBuffer_dummy.numItems = normals_dummy.length/3;
  
  // a buffer for indices
  var indexBuffer_dummy = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_dummy);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_dummy, gl.STATIC_DRAW);
  
  // a buffer for textures
  var textureBuffer_dummy = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_dummy);
  gl.bufferData(gl.ARRAY_BUFFER, textureCord_dummy, gl.STATIC_DRAW);
  textureBuffer_dummy.itemSize = 2;
  textureBuffer_dummy.numItems = textureCord_dummy.length/2;
  
  // Set up texture
  var texture_dummy_1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture_dummy_1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image_d_1 = new Image();
  
  var texture_dummy_2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture_dummy_2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image_d_2 = new Image();
  
  var texture_dummy_3 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture_dummy_3);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image_d_3 = new Image();
  
  var texture_dummy_4 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture_dummy_4);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image_d_4 = new Image();

  //weapon-----------------------------------------------------------------------------------
  var weapon = my_model_weapon;
  var position_weapon = weapon.vertexPos;
  var normals_weapon = weapon.vertexNormals;
  var triangleIndices_weapon = weapon.triangleIndices;
  var textureCord_weapon = weapon.vertexTextureCoords;

  var trianglePosBuffer_weapon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_weapon);
  gl.bufferData(gl.ARRAY_BUFFER, position_weapon, gl.STATIC_DRAW);
  trianglePosBuffer_weapon.itemSize = 3;
  trianglePosBuffer_weapon.numItems = position_weapon.length/3;
  
  // a buffer for normals
  var triangleNormalBuffer_weapon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_weapon);
  gl.bufferData(gl.ARRAY_BUFFER, normals_weapon, gl.STATIC_DRAW);
  triangleNormalBuffer_weapon.itemSize = 3;
  triangleNormalBuffer_weapon.numItems = normals_weapon.length/3;
  
  // a buffer for textures
  var textureBuffer_weapon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_weapon);
  gl.bufferData(gl.ARRAY_BUFFER, textureCord_weapon, gl.STATIC_DRAW);
  textureBuffer_weapon.itemSize = 2;
  textureBuffer_weapon.numItems = textureCord_weapon.length/2;
  
  // a buffer for indices
  var indexBuffer_weapon = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_weapon);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices_weapon, gl.STATIC_DRAW);    
  
  // Set up texture
  var texture_weapon = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture_weapon);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image1 = new Image();
  
  //cube-----------------------------------------------------------------------------------
  //set position
  var cube_positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cube_positionBuffer);
  setGeometry(gl);

  //set normal
  var cube_normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cube_normalBuffer);
  setNormals(gl);

  //skybox-----------------------------------------------------------------------------------
  var sky_positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sky_positionBuffer);
  setGeometry_skyBox(gl);


  //framebuffer!!!----------------------------------------------------------------------------
  
  //set texture for sky
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  faceInfos.forEach((faceInfo) => {
    const {target, url} = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      //console.log("loaded");
    });
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  const level = 0;
  const targetTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);

  const cubemapSize = 512;
  const internalFormat = gl.RGBA;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  
  // Allocate space for all 6 faces
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 
      level, 
      internalFormat, 
      cubemapSize, 
      cubemapSize, 
      0, 
      format, 
      type, 
      null
    );
  }
  
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, cubemapSize, cubemapSize);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
  
  

  //set up values-----------------------------------------------------
  var fieldOfViewRadians = degToRad(60);
  var then = 0;
  var x = 800;
  var y = 100;
  var z = -800;
  var t_x = 0;
  var t_y = 100;
  var t_z = 0;
  const speed = 5;
  var t_x = 0;
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  requestAnimationFrame(drawScene);


    
  function renderCubemap(aspect, angle2) {
    faceInfos.forEach(({ target, eye, up }) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      // Attach the current cubemap face
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, target, targetTexture, level);

      // Check framebuffer completeness
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        console.error("Framebuffer is incomplete for cubemap face:", target);
        return;
      }

      // Set viewport and clear the framebuffer
      gl.viewport(0, 0, cubemapSize, cubemapSize);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Render the scene
      drawCube(aspect, eye, up, angle2);
    });
  }

  function drawCube(aspect, eye, up, angle2){
    var target = [0,0,0];
        //Matrix formation
        var worldMat = mat4.create();
        mat4.fromScaling(worldMat,[5.0,5.0,5.0]);
        //mat4.rotate(worldMat,worldMat,degToRad(60),[1,1,1]);
    
        var matProjection = mat4.create();
        mat4.perspective(matProjection, fieldOfViewRadians, aspect, 10, 4000);
    
        var matLookAt = mat4.create();
        mat4.lookAt(matLookAt, eye, target, up);
    
        //set up texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_weapon);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_dummy_1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texture_dummy_2);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texture_dummy_3);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, texture_dummy_4);
        gl.activeTexture(gl.TEXTURE5);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        
        //Set main
        //Dummy specific
        gl.useProgram(mainProgram);
        var tModel = mat4.create();
        mat4.scale(tModel,worldMat,[7.0,7.0,7.0]);
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,matLookAt,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,matProjection,tMV);
    
        gl.uniformMatrix4fv(mainProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(mainProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(mainProgram.MVPmatrix,false,tMVP);
    
        var type = 0; //type = 0 for dummy
        gl.uniform1i(mainProgram.type, type);
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_dummy);
        gl.vertexAttribPointer(mainProgram.PositionAttribute, trianglePosBuffer_dummy.itemSize,
          gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_dummy);
        gl.vertexAttribPointer(mainProgram.NormalAttribute, triangleNormalBuffer_dummy.itemSize,
          gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_dummy);
        gl.vertexAttribPointer(mainProgram.texcoordAttribute, textureBuffer_dummy.itemSize,
          gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_dummy);
        gl.drawElements(gl.TRIANGLES, triangleIndices_dummy.length, gl.UNSIGNED_SHORT, 0);
    

        //Weapon specific
        type = 1;
        //dealing the fact that the weapon is too large
        mat4.scale(tModel, worldMat, [0.15, 0.15, 0.15]);
        if(equip === 1){
          mat4.translate(tModel, tModel,[0, -200, -200]);
        }
        mat4.rotate(tModel, tModel, angle2, [1, 1, 1]);  
        tMV = mat4.create();
        tMVn = mat3.create();
        tMVP = mat4.create();
        
        //mat4.multiply(tMV, matLookAt, tModel);
        if (equip === 0) {
          mat4.multiply(tMV, matLookAt, tModel); // "modelView" matrix
        } else {
          tMV = mat4.clone(tModel);
        }
        mat3.normalFromMat4(tMVn, tMV);
        mat4.multiply(tMVP, matProjection, tMV);

        gl.uniformMatrix4fv(mainProgram.MVmatrix, false, tMV);
        gl.uniformMatrix3fv(mainProgram.MVNormalmatrix, false, tMVn);
        gl.uniformMatrix4fv(mainProgram.MVPmatrix, false, tMVP);
        gl.uniform1i(mainProgram.type, type);
       
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_weapon);
        gl.vertexAttribPointer(mainProgram.PositionAttribute, trianglePosBuffer_weapon.itemSize, 
            gl.FLOAT, false, 0, 0
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_weapon);
        gl.vertexAttribPointer(mainProgram.NormalAttribute, triangleNormalBuffer_weapon.itemSize, 
            gl.FLOAT, false, 0, 0
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_weapon);
        gl.vertexAttribPointer(mainProgram.texcoordAttribute, textureBuffer_weapon.itemSize, 
            gl.FLOAT, false, 0, 0
        );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_weapon);
        gl.drawElements(gl.TRIANGLES, triangleIndices_weapon.length, gl.UNSIGNED_SHORT, 0);
        
        //cube
        gl.useProgram(refProgram);
        var tWorld = mat4.create();
        mat4.scale(tWorld, worldMat, [25.0,25.0,25.0]);
        mat4.rotate(tWorld, tWorld, modelXRotationRadians, [1,0,0]);
        mat4.rotate(tWorld, tWorld, modelYRotationRadians, [0,1,0]);
        var viewMatrix = mat4.create();
        mat4.invert(viewMatrix, matLookAt);
    
        var positionLocation_cube = gl.getAttribLocation(refProgram, "vPosition");
        gl.enableVertexAttribArray(positionLocation_cube);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube_positionBuffer);
        gl.vertexAttribPointer(positionLocation_cube,3, gl.FLOAT, false, 0,0);
    
        var normalLocation_cube = gl.getAttribLocation(refProgram, "vNormal");
        gl.enableVertexAttribArray(normalLocation_cube);
        gl.bindBuffer(gl.ARRAY_BUFFER, cube_normalBuffer);
        gl.vertexAttribPointer(normalLocation_cube, 3, gl.FLOAT, false, 0, 0);
    
        gl.uniformMatrix4fv(refProgram.Projectionmatrix, false, matProjection);
        gl.uniformMatrix4fv(refProgram.Viewmatrix, false, viewMatrix);
        gl.uniformMatrix4fv(refProgram.Worldmatrix, false, tWorld);
        gl.uniform3fv(refProgram.CameraPos, eye);
    
        gl.uniform1i(refProgram.texReflection, 5);
        gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
        
        //skybox
        gl.useProgram(skyProgram);
        gl.enableVertexAttribArray(skyProgram.PositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, sky_positionBuffer);
        gl.vertexAttribPointer(skyProgram.PositionAttribute,2, gl.FLOAT, false, 0,0);
    
        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;
        var viewDirectionProjectionInverseMatrix = mat4.create();
        mat4.multiply(viewDirectionProjectionInverseMatrix, matProjection, viewMatrix);
        mat4.invert(viewDirectionProjectionInverseMatrix, viewDirectionProjectionInverseMatrix);
        
        gl.uniformMatrix4fv(skyProgram.invMat, false, viewDirectionProjectionInverseMatrix);
        gl.uniform1i(skyProgram.texSky, 5);
        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
  }

  function drawScene(time){
    //time for animation
    if (time === undefined) time = then;
    time *= 0.001;
    var deltaTime = time - then;
    then = time;
    modelYRotationRadians += -0.7 * deltaTime;
    modelXRotationRadians += -0.4 * deltaTime;

    var angle1 = slider1.value*0.01*Math.PI;
    var angle2 = slider2.value*0.01*Math.PI;


    //Clear screen, prepare for rendering
    gl.clearColor(255.0, 255.0, 255.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //data for calculation
    var eye = [x*Math.sin(angle1),y,z*Math.cos(angle1)];
    //console.log(eye);
    //var eye = [x,y,z];
    var target = [t_x,t_y,t_z];
    var up = [0,1,0];
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    
    renderCubemap(aspect, angle2);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, targetTexture);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(255.0, 255.0, 255.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Matrix formation
    var worldMat = mat4.create();
    mat4.fromScaling(worldMat,[5.0,5.0,5.0]);
    //mat4.rotate(worldMat,worldMat,degToRad(60),[1,1,1]);

    var matProjection = mat4.create();
    mat4.perspective(matProjection, fieldOfViewRadians, aspect, 10, 4000);

    var matLookAt = mat4.create();
    mat4.lookAt(matLookAt, eye, target, up);

    //set up texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture_weapon);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture_dummy_1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture_dummy_2);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture_dummy_3);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, texture_dummy_4);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    
    //Set main
    //Dummy specific
    gl.useProgram(mainProgram);
    var tModel = mat4.create();
    mat4.scale(tModel,worldMat,[7.0,7.0,7.0]);
    var tMV = mat4.create();
    var tMVn = mat3.create();
    var tMVP = mat4.create();
    mat4.multiply(tMV,matLookAt,tModel); // "modelView" matrix
    mat3.normalFromMat4(tMVn,tMV);
    mat4.multiply(tMVP,matProjection,tMV);

    gl.uniformMatrix4fv(mainProgram.MVmatrix,false,tMV);
    gl.uniformMatrix3fv(mainProgram.MVNormalmatrix,false,tMVn);
    gl.uniformMatrix4fv(mainProgram.MVPmatrix,false,tMVP);

    var type = 0; //type = 0 for dummy
    gl.uniform1i(mainProgram.type, type);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_dummy);
    gl.vertexAttribPointer(mainProgram.PositionAttribute, trianglePosBuffer_dummy.itemSize,
      gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_dummy);
    gl.vertexAttribPointer(mainProgram.NormalAttribute, triangleNormalBuffer_dummy.itemSize,
      gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_dummy);
    gl.vertexAttribPointer(mainProgram.texcoordAttribute, textureBuffer_dummy.itemSize,
      gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_dummy);
    gl.drawElements(gl.TRIANGLES, triangleIndices_dummy.length, gl.UNSIGNED_SHORT, 0);

    //Weapon specific
    type = 1;
    //dealing the fact that the weapon is too large
    mat4.scale(tModel, worldMat, [0.15, 0.15, 0.15]);
    if(equip === 1){
      mat4.translate(tModel, tModel,[0, -200, -200]);
    }
    mat4.rotate(tModel, tModel, angle2, [1, 1, 1]);  
    tMV = mat4.create();
    tMVn = mat3.create();
    tMVP = mat4.create();
    
    //mat4.multiply(tMV, matLookAt, tModel);
    if (equip === 0) {
      mat4.multiply(tMV, matLookAt, tModel); // "modelView" matrix
    } else {
      tMV = mat4.clone(tModel);
    }
    mat3.normalFromMat4(tMVn, tMV);
    mat4.multiply(tMVP, matProjection, tMV);

    gl.uniformMatrix4fv(mainProgram.MVmatrix, false, tMV);
    gl.uniformMatrix3fv(mainProgram.MVNormalmatrix, false, tMVn);
    gl.uniformMatrix4fv(mainProgram.MVPmatrix, false, tMVP);
    gl.uniform1i(mainProgram.type, type);

    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer_weapon);
    gl.vertexAttribPointer(mainProgram.PositionAttribute, trianglePosBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer_weapon);
    gl.vertexAttribPointer(mainProgram.NormalAttribute, triangleNormalBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer_weapon);
    gl.vertexAttribPointer(mainProgram.texcoordAttribute, textureBuffer_weapon.itemSize, 
        gl.FLOAT, false, 0, 0
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer_weapon);
    gl.drawElements(gl.TRIANGLES, triangleIndices_weapon.length, gl.UNSIGNED_SHORT, 0);
    
    //cube
    gl.useProgram(refProgram);
    var tWorld = mat4.create();
    mat4.scale(tWorld, worldMat, [25.0,25.0,25.0]);
    mat4.rotate(tWorld, tWorld, modelXRotationRadians, [1,0,0]);
    mat4.rotate(tWorld, tWorld, modelYRotationRadians, [0,1,0]);
    mat4.translate(tWorld, tWorld, [1,1,1]);
    var viewMatrix = mat4.create();
    mat4.invert(viewMatrix, matLookAt);

    var positionLocation_cube = gl.getAttribLocation(refProgram, "vPosition");
    gl.enableVertexAttribArray(positionLocation_cube);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_positionBuffer);
    gl.vertexAttribPointer(positionLocation_cube,3, gl.FLOAT, false, 0,0);

    var normalLocation_cube = gl.getAttribLocation(refProgram, "vNormal");
    gl.enableVertexAttribArray(normalLocation_cube);
    gl.bindBuffer(gl.ARRAY_BUFFER, cube_normalBuffer);
    gl.vertexAttribPointer(normalLocation_cube, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(refProgram.Projectionmatrix, false, matProjection);
    gl.uniformMatrix4fv(refProgram.Viewmatrix, false, viewMatrix);
    gl.uniformMatrix4fv(refProgram.Worldmatrix, false, tWorld);
    gl.uniform3fv(refProgram.CameraPos, eye);

    gl.uniform1i(refProgram.texReflection, 6);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
    
    //skybox
    gl.useProgram(skyProgram);
    gl.enableVertexAttribArray(skyProgram.PositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, sky_positionBuffer);
    gl.vertexAttribPointer(skyProgram.PositionAttribute,2, gl.FLOAT, false, 0,0);

    viewMatrix[12] = 0;
    viewMatrix[13] = 0;
    viewMatrix[14] = 0;
    var viewDirectionProjectionInverseMatrix = mat4.create();
    mat4.multiply(viewDirectionProjectionInverseMatrix, matProjection, viewMatrix);
    mat4.invert(viewDirectionProjectionInverseMatrix, viewDirectionProjectionInverseMatrix);
    
    gl.uniformMatrix4fv(skyProgram.invMat, false, viewDirectionProjectionInverseMatrix);
    gl.uniform1i(skyProgram.texSky, 5);
    gl.depthFunc(gl.LEQUAL);
    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);


    p.innerText = " x: "+x + " y: "+y+" z: "+z;
    //update
    requestAnimationFrame(drawScene);
  }
  function initTexture()
{
  image1.onload = function() { loadTexture(image1,texture_weapon); };
  image1.crossOrigin = "anonymous";
  image1.src = "https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/Assignment7/wuqi.png";
  
  image_d_1.onload = function() { loadTexture(image_d_1,texture_dummy_1); };
  image_d_1.crossOrigin = "anonymous";
  image_d_1.src = "https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/Assignment7/Dummy_BaseColor_compressed.jpg";

  image_d_2.onload = function() { loadTexture(image_d_2,texture_dummy_2); };
  image_d_2.crossOrigin = "anonymous";
  image_d_2.src = "https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/Assignment7/Dummy_Metallic_compressed.jpg";
  
  image_d_3.onload = function() { loadTexture(image_d_3,texture_dummy_3); };
  image_d_3.crossOrigin = "anonymous";
  image_d_3.src = "https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/Assignment7/Dummy_Normal_compressed.jpg";

  image_d_4.onload = function() { loadTexture(image_d_4,texture_dummy_4); };
  image_d_4.crossOrigin = "anonymous";
  image_d_4.src = "https://raw.githubusercontent.com/LoucOoc/CourseProjects/refs/heads/main/cs559%20Computer%20Graphics/Assignment7/Dummy_Roughness_compressed.jpg";
  
  //window.setTimeout(drawScene,500);
}

function loadTexture(image,texture)
{
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}

  initTexture();

  document.addEventListener("keydown", function(event) {
    console.log(event.key);
    switch (event.key){
      case 'e' || 'E': {
        y -= speed;
        break;
      }
      case 'q' || 'Q': {
        y += speed;
        break;
      }
      case 'w' || 'W': {
          z += speed;
        break;
      }
      case 's' || 'S': {
          z -= speed;
        break;
      }
      case 'a' || 'A': {
          x -= 10 * speed;
        break;
      }
      case 'd' || 'D': {
          x += 10 * speed;
        break;
      }
      case 'f' || 'F': {
        equip = equip===0 ? 1 : 0;
        slider2.value = 0;
      break;
    }
    }
  });
}

window.onload = start;

