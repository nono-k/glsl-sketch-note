#version 300 es
precision mediump float;

uniform vec2 uResolution;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415926;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  return fract(
    sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123
  );
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
  return a + b*cos( 6.283185*(c*t+d) );
}

void main() {
  vec2 uv = vUv;
  vec2 pos = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

  float radius = length(pos);
  float angle = atan(pos.y, pos.x);

  angle += PI;

  float ringCount = 4.0;
  float ringId = floor(radius * ringCount);

  float ringInner = ringId / ringCount;
  float ringOuter = (ringId + 1.0) / ringCount;

  float ringMask = step(ringInner, radius) * (1.0 - step(ringOuter, radius));

  float segCount = ringCount + ringId * 2.0;
  float offset = hash(ringId) * 2.0 * PI + sin(ringId) * 0.3;
  float seg = floor(fract((angle + offset) / (2.0 * PI)) * segCount);

  float visible = step(0.15, hash(seg + ringId * 31.0));

  float localA = fract((angle + offset) / (2.0 * PI) * segCount);

  float grad = smoothstep(0.0, 1.0, localA);

  float col = ringMask * visible * grad;

  vec3 color = palette(col, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.1, 0.2));

  float grain = noise(gl_FragCoord.xy);
  grain = (grain - 0.5) * 0.25;

  fragColor = vec4(color * grad + grain, 1.0);
  // fragColor = vec4(vec3(col), 1.0);
}