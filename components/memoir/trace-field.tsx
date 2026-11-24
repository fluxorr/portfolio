"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}
`;

const fragmentSource = `
precision highp float;
uniform vec2 u_size;
uniform vec2 u_pointer;
uniform float u_energy;
uniform float u_pitch;
uniform float u_pulse;

float bayer2(vec2 p) {
  vec2 cell=mod(p,2.0);
  return (2.0*cell.x+3.0*cell.y-4.0*cell.x*cell.y);
}

void main(){
  vec2 pos=vec2(gl_FragCoord.x,u_size.y-gl_FragCoord.y);
  vec2 tile=floor(pos/u_pitch);
  vec2 uv=(tile+.5)*u_pitch/u_size;
  float aspect=u_size.x/u_size.y;
  vec2 scale=vec2(aspect,1.0);
  float compact=1.0-smoothstep(0.8,1.4,aspect);
  vec2 anchor=mix(vec2(.74,.49),vec2(.78,.56),compact);
  vec2 q=(uv-anchor)*scale;
  vec2 pointerDelta=(uv-u_pointer)*scale;
  float distanceToPointer=length(pointerDelta);
  float local=exp(-18.0*dot(pointerDelta,pointerDelta))*u_energy;
  q-=pointerDelta*local*.42;

  q.x+=q.y*.31;
  q.y*=1.3;
  float angle=atan(q.y,q.x);
  float radius=length(q);
  float displacement=.052*sin(angle*3.0+radius*6.0)+.036*cos(angle*2.0-radius*3.0);
  float fold=pow(.5+.5*cos((radius+displacement)*47.0-angle*1.15),3.0);
  float edge=smoothstep(.055,.16,radius)*(1.0-smoothstep(.43,.69,radius));
  float inkSide=smoothstep(.36,.68,uv.x);
  float lighting=.48+.52*pow(.5+.5*cos(angle+.85),.8);
  float echo=exp(-80.0*abs(distanceToPointer-(1.0-u_pulse)*.34))*u_pulse*.53;
  float ink=clamp(fold*edge*lighting*inkSide*(.94+local*.50)+echo*inkSide*edge,0.0,1.0);

  float threshold=(4.0*bayer2(tile)+bayer2(floor(tile/2.0))+.5)/16.0;
  float dotMask=1.0-smoothstep(.34,.49,length(fract(pos/u_pitch)-.5));
  float grain=fract(sin(dot(tile,vec2(127.1,311.7)))*43758.5453);
  float base=.052+grain*.007;
  float value=base + step(threshold,ink)*dotMask*(.12+.72*ink);
  gl_FragColor=vec4(vec3(value),1.0);
}
`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const result = gl.createShader(type);
  if (!result) return null;
  gl.shaderSource(result, source);
  gl.compileShader(result);
  if (gl.getShaderParameter(result, gl.COMPILE_STATUS)) return result;
  gl.deleteShader(result);
  return null;
}

export function TraceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = canvas?.parentElement?.parentElement;
    if (!canvas || !surface) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertex = shader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    const geometry = gl.createBuffer();
    const release = () => {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      if (geometry) gl.deleteBuffer(geometry);
      if (program) gl.deleteProgram(program);
    };
    if (!vertex || !fragment || !program || !geometry) {
      release();
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      return;
    }
    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL program binding is not a React hook.
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, geometry);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const locations = {
      size: gl.getUniformLocation(program, "u_size"),
      pointer: gl.getUniformLocation(program, "u_pointer"),
      energy: gl.getUniformLocation(program, "u_energy"),
      pitch: gl.getUniformLocation(program, "u_pitch"),
      pulse: gl.getUniformLocation(program, "u_pulse"),
    };
    let width = 0;
    let height = 0;
    let pitch = 3;
    let frame = 0;
    let visible = true;
    let lost = false;
    let x = 0.75;
    let y = 0.5;
    let strength = 0;
    let targetX = x;
    let targetY = y;
    let targetStrength = 0;
    let pulseStarted = -1000;

    function queue() {
      if (!frame && visible && !lost && !document.hidden)
        frame = requestAnimationFrame(draw);
    }
    function draw(time: number) {
      frame = 0;
      if (
        !visible ||
        lost ||
        document.hidden ||
        !gl ||
        !canvas ||
        width === 0 ||
        height === 0
      )
        return;
      const pulse = reduced.matches
        ? 0
        : Math.max(0, 1 - (time - pulseStarted) / 620);
      x += (targetX - x) * 0.24;
      y += (targetY - y) * 0.24;
      strength += (targetStrength - strength) * 0.19;
      gl.uniform2f(locations.size, width, height);
      gl.uniform2f(locations.pointer, x, y);
      gl.uniform1f(locations.pitch, pitch);
      gl.uniform1f(locations.energy, reduced.matches ? 0 : strength);
      gl.uniform1f(locations.pulse, pulse);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.live = "true";

      if (
        !reduced.matches &&
        (pulse > 0 ||
          Math.abs(strength - targetStrength) > 0.006 ||
          (targetStrength > 0 &&
            Math.abs(x - targetX) + Math.abs(y - targetY) > 0.002))
      )
        queue();
    }
    function resize() {
      if (!surface || !gl || !canvas || lost) return;
      const bounds = surface.getBoundingClientRect();
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        1.45,
        1920 / Math.max(1, bounds.width),
      );
      width = Math.max(1, Math.round(bounds.width * ratio));
      height = Math.max(1, Math.round(bounds.height * ratio));
      pitch = 3.25 * ratio;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      queue();
    }
    function point(event: PointerEvent) {
      if (!surface || reduced.matches) return;
      const bounds = surface.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width;
      targetY = (event.clientY - bounds.top) / bounds.height;
      targetStrength = 1;
      queue();
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== "touch") point(event);
    }
    function releasePointer() {
      targetStrength = 0;
      queue();
    }
    function press(event: PointerEvent) {
      if (
        reduced.matches ||
        (event.target instanceof Element &&
          event.target.closest("button,a,input"))
      )
        return;
      point(event);
      pulseStarted = performance.now();
      if (event.pointerType === "touch") releasePointer();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      canvas?.removeAttribute("data-live");
    }

    const sizes = new ResizeObserver(resize);
    sizes.observe(surface);
    const view = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) queue();
    });
    view.observe(surface);
    canvas.addEventListener("webglcontextlost", contextLost);
    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", releasePointer);
    surface.addEventListener("pointerdown", press, { passive: true });
    reduced.addEventListener("change", releasePointer);
    document.addEventListener("visibilitychange", queue);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      view.disconnect();
      canvas.removeEventListener("webglcontextlost", contextLost);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", releasePointer);
      surface.removeEventListener("pointerdown", press);
      document.removeEventListener("visibilitychange", queue);
      reduced.removeEventListener("change", releasePointer);
      canvas.removeAttribute("data-live");
      release();
    };
  }, []);

  return (
    <div className="mm-trace-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
