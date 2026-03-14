function afterload()
{
    let can = document.getElementById('can');
    const gl  = can.getContext('webgl2'); 

    function resize() {

        can = document.getElementById('can');

        if(can != null)
        {
            can.width = window.innerWidth;
            can.height = window.innerHeight;

            gl.viewport(0, 0, can.width, can.height);
        }
    }

    function draw(dt, obj) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(obj.prog);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0);
    }

    let oldtime;
    function framegen(newtime, obj) {
        let dt = (newtime - oldtime);
        oldtime = newtime;

        gl.uniform1f(obj.uniforms.time, newtime);
        gl.uniform1f(obj.uniforms.dt, dt);
        gl.uniform2f(obj.uniforms.resolution, can.width, can.height);

        const emission = document.getElementById('background-img').style.background;

        let thing;

        if(emission[0] == '#')
        {
            thing = [0, 0, 0];
            thing[0] = parseInt('0x' + emission.substring(1, 3)) / 255.0;
            thing[1] = parseInt('0x' + emission.substring(3, 5)) / 255.0;
            thing[2] = parseInt('0x' + emission.substring(5, 7)) / 255.0;
        }
        else
        {
            thing = eval(emission.substring(3).replace('(', '[').replace(')', ']'));
        }

        const r = thing[0] / 255.0; 
        const g = thing[1] / 255.0;
        const b = thing[2] / 255.0;

        gl.uniform4f(obj.uniforms.glowColor, r, g, b, 1.0);

        draw(dt, obj);

        window.requestAnimationFrame((dt) => framegen(dt, obj));
    }

    resize();
    window.addEventListener('resize', resize);

    async function init() {

        /*
        let res = await fetch('shader/background.vert')
        if(!res.ok)
            throw new Error(`Response Status: ${res.status}`);
*/
        const vertSource = `
        #version 100

precision highp float;

attribute vec3 aPos;

varying vec2 orig_uv;

void main() {
	gl_Position = vec4(aPos, 1.0);
	orig_uv = aPos.xy;
}

        `;

        /*
        res = await fetch('shader/background.frag')
        if(!res.ok)
            throw new Error(`Response Status: ${res.status}`);
*/
        const fragSource = `
        #version 100

precision highp float;

varying vec2 orig_uv;

uniform float uTime;
uniform float uDt;
uniform vec2 uResolution;

uniform vec4 uGlowColor;

uniform sampler2D uTexture0;

void main() {

	float aspect = uResolution.x / uResolution.y;
	vec2 uv = vec2(orig_uv.x * aspect, orig_uv.y);

	// TODO: this is a botch fix this with real math
	float hei = 3.; 
	float rad = sqrt(pow(aspect, 2.) + pow(hei - 1., 2.)) + exp(-aspect * 2.) / aspect;

	vec2 orig = vec2(0.0, -hei + 0.01 * sin(uTime/ 1000.)); 

	float dist = distance(uv, orig);

	if(dist > rad)
	{
		// Background

		float ang = uTime / 50000.;
		mat2 rot = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));

		vec2 ruv = rot * (uv - orig) + orig;

		gl_FragColor = mix(texture2D(uTexture0, (ruv + vec2(1., aspect)) / 2.), vec4(uGlowColor.xyz * pow(rad / dist, 10.), 1.0), 0.3);
	}
	else
	{
		// The circle
		gl_FragColor = mix(uGlowColor, vec4(0.0, 0.0, 0.0, 1.0), pow(1. - dist / rad, 0.15));
	}

}

        `;

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertSource);
        gl.compileShader(vs);

        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragSource);
        gl.compileShader(fs);

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        const img = document.getElementById('background-img');

        const buffer = new Float32Array([
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0,  1.0, 0.0,
            -1.0,  1.0, 0.0
        ]);

        const indeces = new Int32Array([
            0, 1, 2,
            0, 2, 3
        ]);

        const vao = gl.createVertexArray();
        const vbo = gl.createBuffer();
        const ibo = gl.createBuffer();

        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indeces, gl.STATIC_DRAW);

        const aPos = gl.getAttribLocation(prog, 'aPos');
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPos);

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        gl.useProgram(prog);

        const texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        const uTexture0 = gl.getUniformLocation(prog, 'uTexture0');
        gl.uniform1i(uTexture0, 0);

        const uTime = gl.getUniformLocation(prog, 'uTime');
        const uResolution = gl.getUniformLocation(prog, 'uResolution');
        const uDt = gl.getUniformLocation(prog, 'uDt');
        const uGlowColor = gl.getUniformLocation(prog, 'uGlowColor');

        return { vao: vao, vbo: vbo, ibo: ibo, prog: prog, uniforms: {
            time: uTime,
            dt: uDt,
            glowColor: uGlowColor,
            resolution: uResolution
        }};
    }

    init().then((obj) => {
        oldtime = Date.now();
        window.requestAnimationFrame((dt) => framegen(dt, obj));
    })

}

window.onload = afterload;
