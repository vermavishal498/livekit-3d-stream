import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLocalParticipant } from '@livekit/components-react';

// Import child 3D panels
import VideoPanel3D from './VideoPanel3D';
import ChatPanel3D from './ChatPanel3D';

export default function CombinedPanel3D({
  position = [0, 1, 0],
  rotation = [0, 0, 0],
  onHoverChange,
}) {
  // LiveKit Controls State
  const { 
    localParticipant, 
    isMicrophoneEnabled, 
    isCameraEnabled, 
    isScreenShareEnabled 
  } = useLocalParticipant();

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => onHoverChange?.(true)}
      onPointerOut={() => onHoverChange?.(false)}
    >
      {/* Main Backing Frame for Combined Dashboard */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[7.8, 4.2]} />
        <meshStandardMaterial 
          color="#181824" 
          roughness={0.4} 
          metalness={0.1} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Main Header Title */}
      <Text 
        position={[0, 1.75, 0.02]} 
        fontSize={0.22} 
        color="#ffffff" 
        anchorX="center" 
        anchorY="middle"
      >
        3D Interactive Workspace
      </Text>

      {/* Left Column: Video Stream Component */}
      <VideoPanel3D position={[-1.85, 0.2, 0.02]} />

      {/* Right Column: Interactive Chat Component */}
      <ChatPanel3D position={[0.3, 0.2, 0.02]} />

      {/* ================= BOTTOM CONTROL BAR ================= */}
      <group position={[0, -1.5, 0.02]}>
        {/* Background Bar Mesh */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[7.2, 0.6]} />
          <meshStandardMaterial color="#0e0e17" roughness={0.5} />
        </mesh>

        {/* Mic Toggle Button */}
        <mesh
          position={[-2.2, 0, 0.02]}
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <planeGeometry args={[2.1, 0.45]} />
          <meshStandardMaterial color={isMicrophoneEnabled ? '#16a34a' : '#dc2626'} />
          <Text position={[0, 0, 0.01]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
            {isMicrophoneEnabled ? '🎙️ Mic On' : '🎙️ Mic Off'}
          </Text>
        </mesh>

        {/* Camera Toggle Button */}
        <mesh
          position={[0, 0, 0.02]}
          onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <planeGeometry args={[2.1, 0.45]} />
          <meshStandardMaterial color={isCameraEnabled ? '#16a34a' : '#2563eb'} />
          <Text position={[0, 0, 0.01]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
            {isCameraEnabled ? '📷 Stop Camera' : '📷 Start Camera'}
          </Text>
        </mesh>

        {/* Screen Share Toggle Button */}
        <mesh
          position={[2.2, 0, 0.02]}
          onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <planeGeometry args={[2.1, 0.45]} />
          <meshStandardMaterial color={isScreenShareEnabled ? '#ca8a04' : '#7c3aed'} />
          <Text position={[0, 0, 0.01]} fontSize={0.11} color="#ffffff" anchorX="center" anchorY="middle">
            {isScreenShareEnabled ? '🖥️ Stop Share' : '🖥️ Share Screen'}
          </Text>
        </mesh>
      </group>
    </group>
  );
}