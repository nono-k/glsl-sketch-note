#version 300 es
precision mediump float;

uniform vec2 uResolution;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec2 pos = gl_FragCoord.xy / uResolution;

  vec3 color = vec3(pos, 0.0);
  fragColor = vec4(color, 1.0);
}
