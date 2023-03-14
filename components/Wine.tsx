import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
export default function Wine() {
  return (
    <div
      className={
        "w-[350px] h-[500px] md:h-[300px] md:w-[100%] flex justify-center  "
      }
    >
      <Canvas
        camera={{
          fov: 15,
          near: 0.1,
          far: 2000,
          position: [-3, 1.5, 4],
        }}
      >
        <color args={["#94a3b8"]} attach="background" />
        <Experience />
      </Canvas>
    </div>
  );
}
