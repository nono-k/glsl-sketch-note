#version 300 es
precision mediump float;

uniform vec2 uResolution;

in vec2 vUv;
out vec4 fragColor;

vec3 red = vec3(0.921568, 0.352941, 0.30196);
vec3 white = vec3(0.898039, 0.901960, 0.894117);
vec3 black = vec3(0.066406, 0.035156, 0.03125);
vec3 glay = vec3(0.757656, 0.791093, 0.78906);

float circle(vec2 p, vec2 center, float radius) {
  float d = length(p - center);
  return 1.0 - smoothstep(radius - 0.001, radius + 0.001, d);
}

vec3 pattern(vec2 uv){
  vec2 center = vec2(0.25);
  float radius = 0.16;

  float c = circle(uv, center, radius);

  vec3 color = glay;
  vec3 bg = black;

  if (uv.y < uv.x) {
    color = red;
    bg = white;
  }

  return mix(bg, color, c);
}

vec2 repeatPmm(vec2 uv, vec2 tile) {
  vec2 offset = vec2(0.25);
  vec2 p = uv * tile + offset;
  vec2 f = fract(p);

  f.x = f.x > 0.5 ? 1.0 - f.x : f.x;
  f.y = f.y > 0.5 ? 1.0 - f.y : f.y;

  return f;
}

void main() {
  vec2 uv = vUv;

  vec2 tile = vec2(5.0);
  vec2 tuv = repeatPmm(uv, tile);

  vec3 color = pattern(tuv);

  fragColor = vec4(color, 1.0);
}
