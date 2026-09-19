import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import CombinedPanel3D from './CombinedPanel3D';

function Loader() {
  const { progress } = useProgress();
  return <Html center><div style={{ color: '#fff' }}>{progress.toFixed(0)}% loaded</div></Html>;
}

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
}

export default function Scene3D() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 1.5, 6.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={<Loader />}>
          <Model url="/scene.glb" />
          <Environment files="/hdr/std.hdr" background blur={0} />

          {/* Unified 3D Panel containing Video, Chat, and Control Buttons */}
          <CombinedPanel3D 
            position={[-9, 1.3, 0]} 
            rotation={[0, -80.1, 0]} 
            onHoverChange={setHovered} 
          />
        </Suspense>

        {/* Orbit Controls disable camera dragging while interacting with the combined panel */}
        <OrbitControls  />
      </Canvas>
    </div>
  );
}