import { Geometry } from '../core/Geometry';

export class Plane extends Geometry {
  constructor(gl: WebGL2RenderingContext) {
    const positions = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]);

    const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);

    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    super(gl, {
      positions: { size: 3, data: positions },
      uv: { size: 2, data: uvs },
      index: { size: 1, data: indices },
    });
  }
}
