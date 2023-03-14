/*
 * this is main page for creating 3d wine bottle
 */
import { useGLTF } from "@react-three/drei";
import { PresentationControls } from "@react-three/drei";
import { DirectionalLight } from "three";
import { Suspense, useEffect, useRef } from "react";
export default function Experience() {
  //load the model
  const wine = useGLTF("./../static/model/wine.gltf");
  const lightref = useRef<DirectionalLight>(null);
  useEffect(() => {
    //change light position
    if (lightref.current) {
      lightref.current.position.set(0, 1, 3);
    }
  }, []);
  return (
    <>
      <directionalLight ref={lightref} intensity={1} />
      <Suspense fallback={<Loader />}>
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap
          rotation={[0, 1, 0]}
          polar={[-Math.PI / 2, Math.PI / 2]} //for vertical dragging
          azimuth={[-Math.PI / 1.4, Math.PI / 2]} //for horizontal dragging
        >
          <primitive object={wine.scene} position={[0, -0.4, 0]} />
        </PresentationControls>
      </Suspense>
    </>
  );
}
function Loader() {
  return <div>loading....</div>;
}
