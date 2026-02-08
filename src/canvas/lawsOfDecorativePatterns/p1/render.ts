import { Gui } from '@/lib/Gui/Gui';
import { Geometry, Mesh, Program, Render, Scene } from '@/lib/webgl';

import fragment from './index.frag?raw';
import vertex from './index.vert?raw';

export const onload = () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreenSquare();
  const gl = render.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const scene = new Scene();

  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  const plane = new Geometry(gl, {
    position: { size: 3, data: positions },
    uv: { size: 2, data: uvs },
    index: { size: 1, data: indices },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uResolution: { value: [canvas.width, canvas.height] },
      isUv: { value: false },
      offsetX: { value: 0.5 },
    },
  });

  const mesh = new Mesh(gl, { geometry: plane, program });

  scene.add(mesh);

  const update = () => {
    render.render({ scene });

    requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  const isUv = program.uniforms.isUv;
  const offsetX = program.uniforms.offsetX;
  const offsetY = program.uniforms.offsetY;

  const PARAMS = {
    isUv: isUv.value,
    offsetX: offsetX.value,
  };

  // biome-ignore format: este array no debe ser formateado
  const pane = new Gui();
  pane.addBinding(PARAMS, 'isUv', { label: 'uv' });
  pane.addBinding(PARAMS, 'offsetX', { min: 0, max: 1, step: 0.01 });
  pane.addSaveBtn(render, scene, { width: 800, height: 800 });

  pane.on('change', e => {
    isUv.value = PARAMS.isUv;
    offsetX.value = PARAMS.offsetX;
  });
};
