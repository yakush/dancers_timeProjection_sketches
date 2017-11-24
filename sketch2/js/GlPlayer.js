class GlPlayer {

    constructor(canvas) {
        console.log("const'");
        if (!(canvas instanceof Element)) {
            canvas = document.getElementById(canvas);
        }
        this.canvas = canvas;

        this.gl = getGlContext(canvas);
        console.log(this.gl.getParameter(this.gl.VERSION));

        this.isRunning = false;
        this.isInit = false;

        this.vidSource1 = document.getElementById("vid1");
    }

    //-------------------------------------------------------

    init() {

        //--prepare
        let vsSource;
        let fsSource;
        loadTextFile("res/simple.vs.glsl").then(txt => {
            vsSource = txt;
            return loadTextFile("res/simple.fs.glsl");
        }).then(txt => {
            fsSource = txt;

            //textures
            this.texVid1 = createTexture(this.gl);

            //rectArr
            this.initBuffers();

            //program
            this.shaderProgram = createShaderProgram(this.gl, vsSource, fsSource);
            this.programInfo = {
                attrib: {
                    position: this.gl.getAttribLocation(this.shaderProgram, 'a_position'),
                    uv: this.gl.getAttribLocation(this.shaderProgram, 'a_uv'),
                },
                uniform: {
                    u_texture: this.gl.getUniformLocation(this.shaderProgram, 'u_texture'),
                }
            };

            console.log("initing");
            this.isInit = true;

        }).catch(err => {
            alert('failed to init\n' + err);
            console.error(err);
        });
    }

    destroy() {
        //--destroy

        //textures
        this.gl.deleteTexture(this.texVid1);

        //rectArr
        this.gl.deleteBuffer(this.positionBuffer);
        this.gl.deleteBuffer(this.uvBuffer);
        this.gl.deleteBuffer(this.indexBuffer);

        //program
        this.gl.deleteProgram(this.shaderProgram);

        console.log("destroying");
        this.isInit = false;
    }

    //-------------------------------------------------------

    draw() {
        if (!this.isInit || !this.isRunning)
            return;
        let gl = this.gl;
        // update vids
        updateVideoTexture(this.gl, this.texVid1, this.vidSource1);

        //init gl
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        //gl.clearDepth(1.0);                 // Clear everything
        //gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        //gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // use program
        gl.useProgram(this.shaderProgram);

        //pos
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.programInfo.attrib.position,
            2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.programInfo.attrib.position);

        //uv
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(
            this.programInfo.attrib.uv,
            2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.programInfo.attrib.uv);

        //indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // textures (unit 0)
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texVid1);
        gl.uniform1i(this.programInfo.uniform.u_texture, 0);

        //draw !!!
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        //unbind all
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.useProgram(null);
    }

    //-------------------------------------------------------

    start() {
        if (!this.isInit)
            this.init();

        this.isRunning = true;
        requestAnimationFrame(x => this.animate());
    }

    stop() {
        this.isRunning = false;

        if (this.isInit)
            this.destroy();
    }

    //-------------------------------------------------------

    animate() {
        if (this.isRunning) {
            this.draw();
            requestAnimationFrame(x => this.animate());
        }
    }

    //-------------------------------------------------------
    //-------------------------------------------------------
    initBuffers() {

        //vertices

        const positions = [
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0,
        ];
        this.positionBuffer = createArrayBufferFloat32(this.gl, positions);

        //uvs
        const uvs = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];
        this.uvBuffer = createArrayBufferFloat32(this.gl, uvs);

        //indices
        const indices = [
            0, 1, 2,
            0, 2, 3,
        ];
        this.indexBuffer = createElementsBufferUint16(this.gl, indices);
    }
}