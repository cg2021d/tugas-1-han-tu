function main() {
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('myCanvas');
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext('webgl');
    
    var vertices = [] ;
    
    vertices = vertices.concat(getCubeVertices(0)) ;
    // Mata 3 (Kiri)
    vertices = vertices.concat(makeElips(-0.47, 0.30, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(-0.52, 0.22, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(-0.57, 0.14, 0.04, 0)) ;
    // Mata 2 (Kiri)
    vertices = vertices.concat(makeElips(-0.52, -0.10, 0.05, 0)) ;
    vertices = vertices.concat(makeElips(-0.32, -0.05, 0.05, 0)) ;
    // Mata 6 (Kiri)
    vertices = vertices.concat(makeElips(-0.645, -0.035, 0.035, 0)) ;
    vertices = vertices.concat(makeElips(-0.715, 0.021, 0.035, 0)) ;
    vertices = vertices.concat(makeElips(-0.785, 0.077, 0.035, 0)) ;
    vertices = vertices.concat(makeElips(-0.645, -0.035-0.13, 0.035, 0)) ;
    vertices = vertices.concat(makeElips(-0.715, 0.021-0.13, 0.035, 0)) ;
    vertices = vertices.concat(makeElips(-0.785, 0.077-0.13, 0.035, 0)) ;

    var lengthBendaKiri = vertices.length / 5 ;

    vertices = vertices.concat(getCubeVertices(1)) ;
    // Mata 3 (Kanan)
    vertices = vertices.concat(makeElips(0.48, 0.26, 0.05, 0)) ;
    vertices = vertices.concat(makeElips(0.28, 0.23, 0.05, 0)) ;
    vertices = vertices.concat(makeElips(0.68, 0.29, 0.05, 0)) ;
    // Mata 5 (Kanan)
    vertices = vertices.concat(makeElips(0.23, 0.05, 0.06, 0)) ;
    vertices = vertices.concat(makeElips(0.26, -0.22, 0.06, 0)) ;
    vertices = vertices.concat(makeElips(0.38, -0.1, 0.06, 0)) ;
    vertices = vertices.concat(makeElips(0.51, -0.01, 0.06, 0)) ;
    vertices = vertices.concat(makeElips(0.53, -0.25, 0.06, 0)) ;
    // Mata 6 (Kanan)
    vertices = vertices.concat(makeElips(0.665, -0.02, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(0.725, 0.06, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(0.785, 0.14, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(0.672, -0.02-0.18, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(0.732, 0.06-0.18, 0.04, 0)) ;
    vertices = vertices.concat(makeElips(0.792, 0.14-0.18, 0.04, 0)) ;

    var lengthBendaKanan = (vertices.length - lengthBendaKiri * 5) / 5 ;

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform mat4 u_matrix;
    void main(){
        gl_Position = u_matrix * vec4(aPosition, 0.0, 1.0);
        vColor = aColor;
    }`;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, `aPosition`);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, `aColor`);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    let speed = 0.0100 ;
    let change = 0 ;
    console.log(vertices.length, lengthBendaKiri, lengthBendaKanan) ;
    function drawScene() {
        if(change >= 0.55 || change <=-0.55) speed = -speed;
        change += speed;
        gl.useProgram(shaderProgram);
        const leftObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];
        
        const rightObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, change, 0.0, 1.0,
        ];
        
        gl.clearColor(0.5, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');
        gl.uniformMatrix4fv(u_matrix, false, leftObject);
    
        gl.drawArrays(gl.TRIANGLES, 0, lengthBendaKiri);
        
        gl.uniformMatrix4fv(u_matrix, false, rightObject);
        gl.drawArrays(gl.TRIANGLES, lengthBendaKiri, lengthBendaKanan);
        requestAnimationFrame(drawScene);
    }

    drawScene();

    // gl.clearColor(0.5, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // for (var i = 0 ; i < vertices.length ; i+=3) {
    //     gl.drawArrays(gl.TRIANGLES, i, i+3) ;
    // }
}

function makeElips(x, y, s, st) {
    var vertices = [] ;
    for(var i = 0; i<=180; i+=1)
    {
        var j = (i + 270) * Math.PI / 180;
        var k = (i+271) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * s , Math.cos(j) * s, 0, 0, 0,
        ];

        var vert2 = [
            0, 0, 0, 0, 0,
        ];

        var vert3 = [
            Math.sin(k) * s , Math.cos(k) * s, 0, 0, 0,
        ];

        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);
        vertices = vertices.concat(vert3);
    }

    for(var i = 0; i<=180; i+=1)
    {
        var j = (i + 90) * Math.PI / 180;
        var k = (i+91) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * s, Math.cos(j) * s, 0, 0, 0,
        ];

        var vert2 = [
            0, 0, 0, 0, 0,
        ];

        var vert3 = [
            Math.sin(k) * s , Math.cos(k) * s, 0, 0, 0,
        ];

        vertices = vertices.concat(vert1);
        vertices = vertices.concat(vert2);
        vertices = vertices.concat(vert3);
    }

    // Untuk memutar elips (Ga bisa)
    for (var i = 0 ; i < vertices.length ; i+=5) {
        thisX = vertices[i] ; thisY = vertices[i+1] ;

        vertices[i] = thisX * Math.cos(st * Math.PI / 180) - thisY * Math.sin(st * Math.PI / 180) ;
        vertices[i+1] = thisY * Math.cos(st * Math.PI / 180) + thisX * Math.sin(st * Math.PI / 180) ;
    }

    // Untuk menggeser pusat
    for (var i = 0 ; i < vertices.length ; i+=5) {
        vertices[i] += x ;
        vertices[i+1] += y ;
    }

    return vertices ;
}

function getCubeVertices(POSITION) {
    if (POSITION == 0) {
        var vertices = [
            // Gambar Kiri
            // Setengah Segitiga Atas (Atas)
            0.05, 0.36, 0.5, 0.5, 0.5, 
            0.275, 0.16, 0.5, 0.5, 0.5, 
            -0.32, 0.26, 0.5, 0.5, 0.5, 
            // Setengah Segitiga Atas (Bawah)
            0.275, 0.16, 0.5, 0.5, 0.5, 
            -0.32, 0.26, 0.5, 0.5, 0.5,
            -0.1, 0.06, 0.5, 0.5, 0.5,
            // Setengah Segitiga Kiri (Atas)
            -0.32, 0.26, 0.6, 0.6, 0.6,
            -0.1, 0.06, 0.6, 0.6, 0.6,
            -0.11, -0.335, 0.6, 0.6, 0.6,
            // Setengah Segitiga Kiri (Bawah)
            -0.32, 0.26, 0.6, 0.6, 0.6,
            -0.11, -0.335, 0.6, 0.6, 0.6,
            -0.332, -0.125, 0.6, 0.6, 0.6,
            // Setengah Segitiga Kanan (Atas)
            -0.1, 0.06, 0.7, 0.7, 0.7,
            0.275, 0.16, 0.7, 0.7, 0.7,
            -0.11, -0.335, 0.7, 0.7, 0.7,
            // Setengah Segitiga Kanan (Bawah)
            0.275, 0.16, 0.7, 0.7, 0.7,
            -0.11, -0.335, 0.7, 0.7, 0.7,
            0.259, -0.2137, 0.7, 0.7, 0.7
        ] ;

        for (var i = 0 ; i < vertices.length ; i+=5) {
            vertices[i] -= 0.5 ;
        }
    }
    else {
        var vertices = [
            // Gambar Kanan
            // Setengah Segitiga Atas (Atas)
            -0.635, 0.429, 0.5, 0.5, 0.5,
            -0.18, 0.345, 0.5, 0.5, 0.5,
            -0.8886, 0.166, 0.5, 0.5, 0.5,
            // Setengah Segitiga Atas (Bawah)
            -0.18, 0.345, 0.5, 0.5, 0.5,
            -0.8886, 0.166, 0.5, 0.5, 0.5,
            -0.3825, 0.052, 0.5, 0.5, 0.5,
            // Setengah Segitiga Kiri (Atas)
            -0.8886, 0.166, 0.6, 0.6, 0.6,
            -0.3825, 0.052, 0.6, 0.6, 0.6,
            -0.36, -0.402, 0.6, 0.6, 0.6,
            // Setengah Segitiga Kiri (Bawah)
            -0.8886, 0.166, 0.6, 0.6, 0.6,
            -0.36, -0.402, 0.6, 0.6, 0.6,
            -0.82, -0.305, 0.6, 0.6, 0.6,
            // Setengah Segitiga Kanan (Atas)
            -0.3825, 0.052, 0.7, 0.7, 0.7,
            -0.18, 0.345, 0.7, 0.7, 0.7,
            -0.36, -0.402, 0.7, 0.7, 0.7,
            // Setengah Segitiga Kanan (Bawah)
            -0.18, 0.345, 0.7, 0.7, 0.7,
            -0.36, -0.402, 0.7, 0.7, 0.7,
            -0.162, -0.085, 0.7, 0.7, 0.7
        ] ;
    
        for (var i = 0 ; i < vertices.length ; i+=5) {
            vertices[i] += 1 ;
        }
    }
    return vertices ;
}