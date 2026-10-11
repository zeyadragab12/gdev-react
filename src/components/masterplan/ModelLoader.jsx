import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';

// Frees GPU memory held by a loaded scene.
function disposeScene(scene) {
  scene.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry?.dispose();
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => {
      if (!m) return;
      Object.values(m).forEach((v) => v?.isTexture && v.dispose());
      m.dispose();
    });
  });
}

// Loads one phase's GLB/GLTF (suspends until ready), centres it on the origin and
// scales it to a fixed size so every model frames the same way regardless of how
// it was exported. `scale` is a per-phase multiplier from the data file.
// Compressed assets work out of the box: drei's useGLTF handles Draco and Meshopt.
export default function ModelLoader({ url, scale = 1, position = [0, 0, 0], onReady }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(true), [scene]);

  const { fit, offset } = useMemo(() => {
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const fit = 3 / (Math.max(size.x, size.y, size.z) || 1);
    // sit the model on the ground plane (y = 0)
    return { fit, offset: [-center.x * fit, -box.min.y * fit, -center.z * fit] };
  }, [model]);

  useLayoutEffect(() => {
    model.traverse((o) => {
      if (o.isMesh) o.frustumCulled = true;
    });
  }, [model]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // drop the cached GLTF and its GPU resources when the viewer closes
  useEffect(
    () => () => {
      disposeScene(scene);
      useGLTF.clear(url);
    },
    [scene, url],
  );

  return (
    <group position={position} scale={scale}>
      <primitive object={model} scale={fit} position={offset} />
    </group>
  );
}
