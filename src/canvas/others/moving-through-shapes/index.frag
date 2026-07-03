#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415926;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
  float fl = floor(p);
  float fc = fract(p);
  return mix(hash(fl), hash(fl + 1.0), fc);
}

float sBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

  vec3 col = vec3(0.0);

  float fovFactor = tan(radians(130.0 / 2.0));

  const int N = 40;
  int halfN = N / 2;
  float matZ = 460.0;

  for (int i = 0; i < N; i++) {
    float zOffset = 0.0;
    vec2 center = vec2(0.0);
    vec2 size = vec2(0.0);

    float glitchTrigger = 0.0;
    float glitchSeed = 0.0;

    if (i < halfN) {
      zOffset = float(i) * 2.0;
      center = vec2(40.0, 0.0);
      size = vec2(50.0, 120.0);

      // glitchTrigger = noise(uTime * 3.5);
      glitchTrigger = hash(floor(uTime * 20.0));
      glitchSeed = 0.0;
    } else {
      zOffset = 560.0 + float(i - halfN) * 5.0;
      center = vec2(-80.0, 0.0);
      size = vec2(140.0, 40.0);

      // glitchTrigger = noise(uTime * 5.0 + 100.0);
      glitchTrigger = hash(floor(uTime * 24.0) + 500.0);
      glitchSeed = 50.0;
    }

    float z = mod(zOffset - uTime * 120.0, matZ);

    if (z < 5.0) continue;

    vec2 centerScreen = center / (z * fovFactor);
    vec2 sizeScreen = size / (z * fovFactor);

    vec2 distortedPos = pos;

    if (glitchTrigger > 0.8) {
      float freq = 800.0;
      float amp = 0.1;

      float waveX = noise(pos.y * freq + uTime * 40.0 + float(i) * 0.5 + glitchSeed);
      float waveY = noise(pos.x * freq + uTime * 400.0 + float(i) * 0.5 + glitchSeed + 15.0);

      // distortedPos.x += (waveX - 0.5) * amp;
      distortedPos.y += (waveY - 0.5) * amp;
    }

    float d = abs(sBox(distortedPos - centerScreen, sizeScreen));

    float tichness = 0.004;
    float lineIntensity = smoothstep(tichness, 0.0, d);

    float fade = smoothstep(5.0, 80.0, z) * smoothstep(matZ, matZ * 0.8, z);

    float alpha = 0.25 * fade * lineIntensity;

    vec3 wireColor = vec3(1.0);

    col += wireColor * alpha;
  }

  col = pow(col, vec3(0.8));

  fragColor = vec4(col, 1.0);
}