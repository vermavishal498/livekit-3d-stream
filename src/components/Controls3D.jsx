import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLocalParticipant, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function Controls3D({
  position = [0, -0.5, 2],
  rotation = [-0.2, 0, 0],
  onHoverChange,
}) {
  const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } = useLocalParticipant();

  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const activeVideoTrack = tracks.find(
    (t) => t.publication && !t.publication.isMuted
  );

  const isSomeoneElsePublishing = Boolean(
    activeVideoTrack && activeVideoTrack.participant.identity !== localParticipant.identity
  );

  return (
    <mesh
      position={position}
      rotation={rotation}
      onPointerOver={() => onHoverChange?.(true)}
      onPointerOut={() => onHoverChange?.(false)}
    >
      <planeGeometry args={[3, 0.8]} />
      <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />

      <Html
        transform
        distanceFactor={3}
        position={[0, 0, 0.01]}
        style={{
          width: '600px',
          height: '140px',
          background: '#111119',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          padding: '10px 20px',
          boxSizing: 'border-box',
          border: '1px solid #333',
        }}
      >
        <button
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: isMicrophoneEnabled ? '#22c55e' : '#ef4444',
            color: '#fff',
            fontSize: '15px',
          }}
        >
          {isMicrophoneEnabled ? '🎙️ Mic On' : '🎙️ Mic Off'}
        </button>

        <button
          onClick={() => localParticipant.setCameraEnabled(!isCameraEnabled)}
          disabled={isSomeoneElsePublishing && !isCameraEnabled}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: isSomeoneElsePublishing && !isCameraEnabled ? 'not-allowed' : 'pointer',
            background: isCameraEnabled ? '#22c55e' : '#3b82f6',
            opacity: isSomeoneElsePublishing && !isCameraEnabled ? 0.4 : 1,
            color: '#fff',
            fontSize: '15px',
          }}
        >
          {isCameraEnabled ? '📷 Stop Camera' : '📷 Start Camera'}
        </button>

        <button
          onClick={() => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)}
          disabled={isSomeoneElsePublishing && !isScreenShareEnabled}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: isSomeoneElsePublishing && !isScreenShareEnabled ? 'not-allowed' : 'pointer',
            background: isScreenShareEnabled ? '#eab308' : '#8b5cf6',
            opacity: isSomeoneElsePublishing && !isScreenShareEnabled ? 0.4 : 1,
            color: '#fff',
            fontSize: '15px',
          }}
        >
          {isScreenShareEnabled ? '🖥️ Stop Share' : '🖥️ Share Screen'}
        </button>
      </Html>
    </mesh>
  );
}