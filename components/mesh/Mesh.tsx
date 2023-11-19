import { OrbitControls } from "@react-three/drei";
import Model from "../model/Model";

export default function MeshComponent() {
  return (
    <mesh rotation={[-0.2, -0.2, 0]} position={[0, -0.8, 0]}>
      <Model />
      <ambientLight intensity={1} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={1}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={1} />
      <OrbitControls
        enableZoom
        enablePan={false}
        enableRotate={false}
        enableDamping={false}
      />
      <gridHelper />
    </mesh>
  );
}
