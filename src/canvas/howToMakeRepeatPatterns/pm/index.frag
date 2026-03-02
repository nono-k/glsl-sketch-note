#version 300 es
precision mediump float;

uniform vec2 uResolution;
uniform bool isUv;

in vec2 vUv;
out vec4 fragColor;

vec3 red = vec3(0.921568, 0.352941, 0.30196);
vec3 white = vec3(0.898039, 0.901960, 0.894117);
vec3 blue = vec3(0.109803, 0.411764, 0.615686);
vec3 purple = vec3(0.53725, 0.533333, 0.752941);

vec2 repeatP1(vec2 uv, vec2 tile, float offsetX) {
  vec2 p = uv * tile;

  float row = floor(p.y);
  p.x += row * offsetX;

  return fract(p);
}

vec2 repeatPm(vec2 uv) {
  vec2 f = fract(uv);

  if (f.x > 0.5) {
    f.x = 1.0 - f.x;
  }

  return f;
}

// 4点 → 射影行列
mat3 homographyFromQuad(vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
  // p2 → p1の方向
  float dx1 = p1.x - p2.x;
  float dy1 = p1.y - p2.y;
  // p2 → p3の方向
  float dx2 = p3.x - p2.x;
  float dy2 = p3.y - p2.y;
  // 歪み量
  float dx3 = p0.x - p1.x + p2.x - p3.x;
  float dy3 = p0.y - p1.y + p2.y - p3.y;

  // 2つのベクトルの外積(p2を基準にした面積)
  float det = dx1 * dy2 - dx2 * dy1;
  // 射影成分
  float a13 = (dx3 * dy2 - dx2 * dy3) / det;
  float a23 = (dx1 * dy3 - dx3 * dy1) / det;

  return mat3(
    p1.x - p0.x + a13 * p1.x,
    p1.y - p0.y + a13 * p1.y,
    a13,

    p3.x - p0.x + a23 * p3.x,
    p3.y - p0.y + a23 * p3.y,
    a23,

    p0.x,
    p0.y,
    1.0
  );
}

// 同次座標で逆射影変換を行い、w成分で正規化する
vec2 project(mat3 H, vec2 p) {
  vec3 q = inverse(H) * vec3(p, 1.0);
  return q.xy / q.z;
}

vec3 getCellColor(vec2 id) {
  if (id.y < 1.0) {
    if (id.x < 0.5) return red;
    if (id.x > 0.5 && id.x < 1.0) return white;
    if (id.x > 1.0 && id.x < 1.5) return purple;
    return blue;
  } else {
    if (id.x < 0.5) return purple;
    if (id.x > 0.5 && id.x < 1.0) return blue;
    if (id.x > 1.0 && id.x < 1.5) return red;
    return white;
  }
}

vec3 getCellOutColor(vec2 id) {
  if (id.x < 0.5) return purple;
  if (id.x > 0.5 && id.x < 1.0) return blue;
  if (id.x > 1.0 && id.x < 1.5) return red;
  return white;
}

vec3 boxRepeat(vec2 uv) {
  vec2 gridUv = uv * 2.0;
  vec2 cellUv = fract(gridUv);
  vec2 cellId = floor(gridUv);

  vec3 color = vec3(0.0);

  vec2 tmv = repeatPm(cellUv);

  // 4点の初期設定
  vec2 P0 = vec2(0.0, 0.2); // 左下
  vec2 P1 = vec2(0.5, 0.0); // 右下
  vec2 P2 = vec2(0.5, 0.8); // 右上
  vec2 P3 = vec2(0.0, 1.0); // 左上

  // 射影変換
  mat3 H = homographyFromQuad(P0, P1, P2, P3);
  vec2 src = project(H, tmv);

  // 座標外の背景色セット
  if (src.x < 0.0 || src.x > 1.0 || src.y < 0.0 || src.y > 1.0) {
    color = getCellOutColor(gridUv);

    if (mod(cellId.y, 2.0) == 0.0 && src.y > 0.5) {
      color = getCellColor(gridUv);
    } else if (mod(cellId.y, 2.0) == 1.0 && src.y < 0.5) {
      color = getCellColor(gridUv - vec2(0.0, 0.5));
    }

    return color;
  }

  color = getCellColor(gridUv);

  return color;
}

void main() {
  vec2 uv = vUv;

  vec2 tile = vec2(3.0);
  float offsetX = 0.0;

  vec2 tuv = repeatP1(uv, tile, offsetX);

  vec3 color = isUv ?
    vec3(tuv, 0.0) :
    boxRepeat(tuv);

  fragColor = vec4(color, 1.0);
}
