#version 300 es
precision mediump float;

uniform vec2 uResolution;
in vec2 vUv;
out vec4 fragColor;

float circle(vec2 p, vec2 c, float r){
    return length(p - c) - r;
}

vec2 tileUv(vec2 uv, float repeat){
    uv *= repeat;
    return fract(uv);
}

float lensShape(vec2 p){
  float r = 1.0 - 0.005;
  float c1 = circle(p, vec2(0.0, 1.0), r);
  float c2 = circle(p, vec2(1.0, 0.0), r);
  return max(c1, c2);
}

vec3 pattern(vec2 uv){
  vec3 red  = vec3(0.92,0.35,0.30);
  vec3 blue = vec3(0.10,0.35,0.60);
  vec3 white= vec3(0.95);

  float lens = lensShape(uv);

  if(lens < 0.0) return white;

  return (uv.y > uv.x) ? red : blue;
}

vec2 repeatP1(vec2 uv, vec2 tile){
  vec2 p = tileUv(uv, 6.0);
  return fract(p);
}

void main(){
    vec2 uv = vUv;
    vec2 tile = vec2(6.0);
    vec2 tuv = repeatP1(uv, tile);

    vec3 color = pattern(tuv);
    fragColor = vec4(color, 1.0);
}