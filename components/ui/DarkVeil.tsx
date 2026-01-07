import React, { useEffect, useRef } from 'react';

interface DarkVeilProps {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DarkVeil: React.FC<DarkVeilProps> = ({
  hueShift = 0,
  noiseIntensity = 0.5,
  scanlineIntensity = 0.5,
  speed = 1.0,
  scanlineFrequency = 500,
  warpAmount = 1.0,
  resolutionScale = 1.0,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform float iHueShift;
      uniform float iNoiseIntensity;
      uniform float iScanlineIntensity;
      uniform float iScanlineFrequency;
      uniform float iWarpAmount;

      // Simple pseudo-random function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // 2D Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // FBM for fluid fog look
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        
        // Warp effect
        vec2 warp = vec2(
          fbm(uv * 3.0 + iTime * 0.1),
          fbm(uv * 3.0 - iTime * 0.1)
        ) * iWarpAmount * 0.2;
        
        vec2 distortedUV = uv + warp;

        // Base fog pattern
        float fog = fbm(distortedUV * 3.0 + vec2(0.0, iTime * 0.05));
        
        // Dark, moody base color
        vec3 color = vec3(0.05, 0.05, 0.08);
        
        // Add fog lights
        color += vec3(0.2, 0.1, 0.3) * fog;
        
        // Hue shift
        float angle = radians(iHueShift);
        float s = sin(angle);
        float c = cos(angle);
        mat3 rot = mat3(
          vec3(0.299, 0.587, 0.114) + vec3(0.701, -0.587, -0.114) * c + vec3(-0.168, 0.330, -0.497) * s,
          vec3(0.299, 0.587, 0.114) + vec3(-0.299, 0.299, -0.114) * c + vec3(-0.328, 0.035, 0.292) * s,
          vec3(0.299, 0.587, 0.114) + vec3(-0.300, -0.588, 0.886) * c + vec3(1.250, -1.050, -0.203) * s
        );
        color = rot * color;

        // Noise/Grain
        float grain = hash(uv * iTime) * iNoiseIntensity * 0.1;
        color += grain;

        // Scanlines
        float scanline = sin(uv.y * iScanlineFrequency + iTime * 5.0) * 0.5 + 0.5;
        color *= 1.0 - (scanline * iScanlineIntensity * 0.2);

        // Vignette
        float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Shader setup helpers
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const hueShiftLocation = gl.getUniformLocation(program, 'iHueShift');
    const noiseIntensityLocation = gl.getUniformLocation(program, 'iNoiseIntensity');
    const scanlineIntensityLocation = gl.getUniformLocation(program, 'iScanlineIntensity');
    const scanlineFrequencyLocation = gl.getUniformLocation(program, 'iScanlineFrequency');
    const warpAmountLocation = gl.getUniformLocation(program, 'iWarpAmount');

    // Resize handler
    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr * resolutionScale;
      canvas.height = height * dpr * resolutionScale;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = (time: number) => {
      const elapsedTime = (time - startTime) * 0.001 * speed;
      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform1f(hueShiftLocation, hueShift);
      gl.uniform1f(noiseIntensityLocation, noiseIntensity);
      gl.uniform1f(scanlineIntensityLocation, scanlineIntensity);
      gl.uniform1f(scanlineFrequencyLocation, scanlineFrequency);
      gl.uniform1f(warpAmountLocation, warpAmount);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);

  return (
    <div ref={containerRef} className={`w-full h-full absolute inset-0 -z-10 ${className}`} style={style}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};