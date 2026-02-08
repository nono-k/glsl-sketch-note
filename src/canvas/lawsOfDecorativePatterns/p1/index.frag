#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform bool isUv;
uniform float offsetX;

in vec2 vUv;
out vec4 fragColor;

float triangle(vec2 uv, vec2 p0, vec2 p1, vec2 p2) {
  vec2 v0 = p1 - p0;
  vec2 v1 = p2 - p0;
  vec2 v2 = uv - p0;

  float d00 = dot(v0, v0);
  float d01 = dot(v0, v1);
  float d11 = dot(v1, v1);
  float d20 = dot(v2, v0);
  float d21 = dot(v2, v1);

  float denom = d00 * d11 - d01 * d01;

  float v = (d11 * d20 - d01 * d21) / denom;
  float w = (d00 * d21 - d01 * d20) / denom;
  float u = 1.0 - v - w;

  return step(0.0, u) * step(0.0, v) * step(0.0, w);
}

vec2 repeatP1(vec2 uv, vec2 tile, float offsetX) {
  vec2 p = uv * tile;

  float row = floor(p.y);
  p.x += mod(row, 2.0) == 0.0 ? offsetX : 0.0; // 偶数行のみ移動させる

  return fract(p);
}

void main() {
  vec2 uv = vUv;

  vec2 tile = vec2(6.0);
  vec2 tuv = repeatP1(uv, tile, offsetX);

  vec2 p0 = vec2(0.0, 0.0);
  vec2 p1 = vec2(0.0, 1.0);
  vec2 p2 = vec2(1.0, 1.0);

  vec3 color = isUv ?
    vec3(tuv, 0.0) :
    vec3(triangle(tuv, p0, p1, p2));

  fragColor = vec4(color, 1.0);
}
