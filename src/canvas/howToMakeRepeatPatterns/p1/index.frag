#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform bool isUv;

in vec2 vUv;
out vec4 fragColor;

float circle(vec2 p, vec2 center, float radius) {
  float d = length(p - center);
  return 1.0 - smoothstep(radius - 0.001, radius + 0.001, d);
}

vec3 getCellColor(vec2 id) {
  if (id.x < 0.5 && id.y < 0.5) return vec3(0.898039, 0.901960, 0.894117);
  if (id.x > 0.5 && id.y < 0.5) return vec3(0.921568, 0.352941, 0.30196);
  if (id.x < 0.5 && id.y > 0.5) return vec3(0.109803, 0.411764, 0.615686);
  return vec3(0.53725, 0.533333, 0.752941);
}

vec3 circleRepeat(vec2 uv) {
  vec2 gridUv = uv * 2.0;
  vec2 cellUv = fract(gridUv);
  vec2 cellId = floor(gridUv);

  vec2 center = vec2(0.5);
  float radius = 0.49;

  vec3 bg = vec3(1.0);
  float c = circle(cellUv, center, radius);
  vec3 color = getCellColor(cellId);

  return mix(bg, color, c);
}

vec2 repeatP1(vec2 uv, vec2 tile, float offsetX) {
  vec2 p = uv * tile;

  float row = floor(p.y);
  p.x += row * offsetX;

  return fract(p);
}

void main() {
  vec2 uv = vUv;

  vec2 tile = vec2(6.0);
  float offsetX = 0.0;

  vec2 tuv = repeatP1(uv, tile, offsetX);

  vec3 color = isUv ?
    vec3(tuv, 0.0) :
    circleRepeat(tuv);

  fragColor = vec4(color, 1.0);
}
