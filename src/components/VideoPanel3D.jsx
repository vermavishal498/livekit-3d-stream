import React from 'react';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTracks, VideoTrack, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

export default function VideoPanel3D({
  position = [-3, 1.5, 0],
  rotation = [0, 0, 0],
  onHoverChange,
}) {
  const { localParticipant } = useLocalParticipant();

  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const activePublisher = tracks.find(
    (t) => t.publication && !t.publication.isMuted
  );

  const isCurrentSpeaker = activePublisher?.participant.identity === localParticipant.identity;

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => onHoverChange?.(true)}
      onPointerOut={() => onHoverChange?.(false)}
    >
      {/* Outer Panel Mesh */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#111119" roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Header Title Text */}
      <Text
        position={[-1.8, 1.05, 0.01]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="left"
        anchorY="top"
      >
        Live Broadcast Screen
      </Text>

      {/* Video Screen Viewport Mesh / HTML Overlay */}
      <group position={[0, 0.05, 0.01]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[3.6, 1.7]} />
          <meshStandardMaterial color="#000000" roughness={0.8} />
        </mesh>

        {activePublisher && (
          <Html
            transform
            wrapperClass="video-panel-html"
            position={[0, -0.3, 0.01]}
            distanceFactor={2.5}
            style={{
              width: '500px',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backgroundColor: '#000',
            }}
          >
            <VideoTrack
              trackRef={activePublisher}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Html>
        )}
      </group>

      {/* Placeholder Text / Active Speaker Badge */}
      {activePublisher ? (
        <group position={[-1.6, -0.65, 0.02]}>
          <mesh position={[0.7, 0, 0]}>
            <planeGeometry args={[1.5, 0.2]} />
            <meshBasicMaterial color="#000000" opacity={0.75} transparent />
          </mesh>
          <Text
            position={[0.7, 0, 0.01]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {`Broadcasting: ${activePublisher.participant.identity}`}
          </Text>
        </group>
      ) : (
        <group position={[0, 0.05, 0.02]}>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.10}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            No active video stream.
          </Text>
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.10}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            Use the 3D controls panel to publish your camera or screen.
          </Text>
        </group>
      )}

      {/* Warning Notification Banner Mesh */}
      {activePublisher && !isCurrentSpeaker && (
        <group position={[0, -0.95, 0.01]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.6, 0.25]} />
            <meshBasicMaterial color="#4a3b00" />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.08}
            color="#ffda66"
            anchorX="center"
            anchorY="middle"
          >
            {`⚠️ ${activePublisher.participant.identity} is broadcasting. You cannot publish until they finish.`}
          </Text>
        </group>
      )}
    </group>
  );
}