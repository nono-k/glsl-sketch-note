#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415926;
vec3 g_BoxColor = vec3(0.95, 0.95, 0.93);

// 3Dの疑似乱数生成(セルの個別ID用)
float hash3(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p.xyz, p.yzx + 19.19);
  return fract(p.x * p.y * p.z);
}

// ボックスのSDF
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// 3D空間のマップ(距離関数)
float map(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  vec3 baseOffset = step(0.5, f) - 1.0;
  float d = 1e10;

  for (int x = 0; x <= 1; x++) {
    for (int y = 0; y <= 1; y++) {
      for (int z = 0; z <=1; z++) {
        vec3 cellOffset = baseOffset + vec3(float(x), float(y), float(z));
        vec3 cellId = i + cellOffset;

        float h = hash3(cellId);
        float h2 = fract(h * 123.456);
        float h3 = fract(h * 789.101);

        vec3 boxScale = vec3(
          sin(h * 6.28),
          sin(h2 * 6.28),
          sin(uTime * 0.5 + h3 * 6.28)
        ) * 0.5 + 0.5;

        boxScale *= 0.42;

        vec3 localP = p - (cellId + 0.5);

        float r = step(0.5, h);
        vec3 rotP = localP;
        rotP.xz = mix(localP.xz, vec2(-localP.z, localP.x), r);

        float boxD = sdBox(rotP, boxScale);

        if (boxD < d) {
          d = boxD;
          float colorHue = fract(h + boxScale.x * 0.2);

          if (colorHue < 0.35) {
            g_BoxColor = vec3(0.9412, 0.7176, 0.7294); // 優美なロゼピンク
          } else if (colorHue < 0.65) {
            g_BoxColor = vec3(0.6549, 0.749, 0.8275); // 柔らかなノスタルジックブルー
          } else {
            g_BoxColor = vec3(0.7529, 0.7961, 0.6863); // くすんだ淡いグリーン
          }
        }
      }
    }
  }
  return d;
}

// 法線ベクトルの計算
vec3 getNormal(vec3 p, float d) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - d,
    map(p + e.yxy) - d,
    map(p + e.yyx) - d
  ));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

  // 平行投影カメラのセットアップ
  vec3 rd = normalize(vec3(-1.0, -1.2, -1.0));
  vec3 targetUp = vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(rd, targetUp));
  vec3 up = cross(right, rd);

  // ズーム(視野の広さ)の調整
  float orthoScale = 1.5;
  vec3 ro = right * pos.x * orthoScale + up * pos.y * orthoScale - rd * 40.0;

  float t = 0.0;
  float maxD = 65.0;
  bool hit = false;
  float lastD = 0.0;

  for (int i = 0; i < 10; i++) {
    vec3 p = ro + rd * t;
    lastD = map(p);

    if (lastD < 0.005) {
      hit = true;
      break;
    }
    t += lastD;
    if (t > maxD) break;
  }

  vec3 sceneColor = vec3(0.05, 0.06, 0.08);

  if (hit) {
    vec3 p = ro + rd * t;
    vec3 baseColor = g_BoxColor;
    vec3 n = getNormal(p, lastD);

    vec3 lightDir1 = normalize(vec3(1.0, 2.0, 0.5));
    vec3 lightDir2 = normalize(vec3(-1.0, 1.0, -1.0));

    float diff1 = max(dot(n, lightDir1), 0.0);
    float diff2 = max(dot(n, lightDir2), 0.0) * 0.3;
    float amp = 0.25;

    sceneColor = baseColor * (diff1 + diff2 + amp);

    // 奥行きに応じたかすかなフォグ効果
    // sceneColor = mix(sceneColor, vec3(0.05, 0.06, 0.08), smoothstep(20.0, maxD, t));
  }

  float grain = hash3(vec3(gl_FragCoord.xy, 1.0)) * 0.05;
  sceneColor += grain;

  // sceneColor = pow(sceneColor, vec3(0.9));

  fragColor = vec4(sceneColor, 1.0);
}