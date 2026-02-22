#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform bool isUv;
uniform float offsetY;

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

vec2 repeatPg(vec2 uv, vec2 tile, float offsetY) {
  vec2 p = uv * tile;

  vec2 cellSize = vec2(0.5, 1.0); // 基本セルサイズ

  vec2 q = p;

  // X基本並進
  q.x = mod(q.x, cellSize.x);

  // 2セル周期で判定
  if (mod(p.x, cellSize.x * 2.0) >= cellSize.x) {
    q.y += cellSize.y * offsetY;
    q.x = cellSize.x - q.x;
  }

  // Y基本並進
  q.y = mod(q.y, cellSize.y);

  return q;
}

void main() {
  vec2 uv = vUv;

  vec2 tile = vec2(6.0);
  vec2 tuv = repeatPg(uv, tile, offsetY);

  float e = 0.03;

  vec2 p0 = vec2(0.0+e, 0.1+e);
  vec2 p1 = vec2(0.0+e, 0.9-e);
  vec2 p2 = vec2(0.5-e, 0.1+e);

  vec3 color = isUv ?
    vec3(tuv, 0.0) :
    vec3(1.0 - triangle(tuv, p0, p1, p2));

  fragColor = vec4(color, 1.0);
}
