import { VRMHumanBoneList, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader';
import { GLTFParser } from "three/examples/jsm/Addons.js";

export default function ModelComponent() {
  const [gltf, setGltf] = useState<GLTF>();
  const [progress, setProgress] = useState<number>(0);

  const modelPath = "/models/alicia.vrm";

  function getSin(
    elapsedTime: number,
    speed: number,
    scale: number,
    delay = 0
  ) {
    const s = Math.PI * Math.sin(Math.PI * elapsedTime * speed - delay) * scale;
    return s;
  }

  function getCos(
    elapsedTime: number,
    speed: number,
    scale: number,
    delay = 0
  ) {
    const c = Math.PI * Math.cos(Math.PI * elapsedTime * speed - delay) * scale;
    return c;
  }

  useFrame((state, delta) => {
    if (gltf) {
      const {vrm} = gltf.userData;
      const t = state.clock.elapsedTime;

      // 動く
      const hips = vrm.humanoid.getNormalizedBoneNode("hips");
      hips.position.x = getSin(t, 0.1, 1);
      hips.position.z = getCos(t, 0.1, 1);
      hips.rotation.y = -Math.atan2(getCos(t, 0.1, 1), getSin(t, 0.1, 1));

      // 歩く
      const leftUpperLeg = vrm.humanoid.getNormalizedBoneNode("leftUpperLeg");
      const rightUpperLeg = vrm.humanoid.getNormalizedBoneNode("rightUpperLeg");
      leftUpperLeg.rotation.x = getSin(t, 1, 0.06);
      rightUpperLeg.rotation.x = -getSin(t, 1, 0.07);

      // 体を上下に揺らす
      hips.position.y = getSin(t, 2, 0.005) + 1;

      // 腕を振る
      const leftUpperArm = vrm.humanoid.getNormalizedBoneNode("leftUpperArm");
      const rightUpperArm = vrm.humanoid.getNormalizedBoneNode("rightUpperArm");
      leftUpperArm.rotation.z = 1;
      leftUpperArm.rotation.y = getSin(t, 1, 0.1);
      rightUpperArm.rotation.z = -1;
      rightUpperArm.rotation.y = getSin(t, 1, 0.1);

      // 膝を曲げる
      const leftLowerLeg = vrm.humanoid.getNormalizedBoneNode("leftLowerLeg");
      const rightLowerLeg = vrm.humanoid.getNormalizedBoneNode("rightLowerLeg");
      leftLowerLeg.rotation.x = getSin(t, 1, 0.1, 0.5) - 0.2;
      rightLowerLeg.rotation.x = -getSin(t, 1, 0.1, 0.5) - 0.2;

      // update vrm
      vrm.update(delta);
    }
  });

  useEffect(() => {
    if (!gltf) {
      const loader = new GLTFLoader();

      loader.register((parser: GLTFParser) => new VRMLoaderPlugin(parser));

      loader.load(
        modelPath,
        (tmpGltf) => {
          const bones = VRMHumanBoneList.map((boneName) => boneName);
          console.log(bones);

          VRMUtils.removeUnnecessaryVertices(tmpGltf.scene);
          VRMUtils.removeUnnecessaryJoints(tmpGltf.scene);

          setGltf(tmpGltf);
        },
        (xhr) => setProgress((xhr.loaded / xhr.total) * 100),
        (error) => console.log(error)
      );
    }
  }, [gltf]);

  return (
    <>
      {gltf ? (
        <primitive object={gltf.scene} />
      ) : (
        <Html center>{progress} % loaded</Html>
      )}
    </>
  );
}
