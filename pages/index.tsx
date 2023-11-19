import { Canvas } from "@react-three/fiber";
import Mesh from "@/components/mesh/Mesh";

export default function Home() {
  return (
    <Canvas
    frameloop="always"
    camera={{ fov: 20, near: 0.1, far: 300, position: [0, 1, -10] }}
    style={{ height: "100vh", width: "100vw" }}
    >
      <Mesh />
    </Canvas>
  );
}
