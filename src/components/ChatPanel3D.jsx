import React, { useState, useEffect, useCallback } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useChat } from '@livekit/components-react';

export default function ChatPanel3D({
  position = [3.5, 2, 0],
  rotation = [0, -0.2, 0],
  onHoverChange,
}) {
  const { chatMessages, send } = useChat();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const handleSend = useCallback(async () => {
    if (!text.trim()) return;
    await send(text);
    setText('');
  }, [text, send]);

  // Blink the caret so there's visual feedback that the field is "active"
  // even without a native browser cursor.
  useEffect(() => {
    if (!focused) return;
    const id = setInterval(() => setCursorOn((v) => !v), 500);
    return () => clearInterval(id);
  }, [focused]);

  // Capture real keyboard input while the field is "focused".
  // This is what replaces a native <input> — no DOM overlay needed.
  useEffect(() => {
    if (!focused) return;

    const onKeyDown = (e) => {
      // Prevent page scroll / other shortcuts while typing into the panel
      if (e.key !== 'F5' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        handleSend();
        return;
      }
      if (e.key === 'Escape') {
        setFocused(false);
        return;
      }
      if (e.key === 'Backspace') {
        setText((t) => t.slice(0, -1));
        return;
      }
      // Only accept single printable characters (ignores Shift, Alt, arrows, etc.)
      if (e.key.length === 1) {
        setText((t) => t + e.key);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focused, handleSend]);

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerOver={() => onHoverChange?.(true)}
      onPointerOut={() => onHoverChange?.(false)}
      // Clicking anywhere on the panel that isn't the input box blurs it
      onPointerMissed={() => setFocused(false)}
    >
      {/* Backing Board Mesh */}
      <mesh position={[1, 0, 0]}>
        <planeGeometry args={[4.0, 2.5]} />
        <meshStandardMaterial color="#111119" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Header Title */}
      <Text
        position={[-1.3, 1.05, 0.02]}
        fontSize={0.16}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        Room Chat
      </Text>

      {/* Chat Messages Display Box 
      <mesh position={[0, 0.1, 0.01]}>
        <planeGeometry args={[2.7, 1.6]} />
        <meshStandardMaterial color="#0e0e17" roughness={0.7} />
      </mesh>*/}

      {/* Message List Rendered as 3D Text */}
      <group position={[0.8, 0.75, 0.02]}>
        {chatMessages.length === 0 ? (
          <Text
            position={[0.7, -0.65, 0]}
            fontSize={0.15}
            color="#666666"
            anchorX="center"
            anchorY="middle"
          >
            No messages yet. Say hello!
          </Text>
        ) : (
          chatMessages.slice(-5).map((msg, index) => (
            <Text
              key={msg.id ?? index}
              position={[0, -index * 0.28, 0]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="left"
              anchorY="top"
              maxWidth={2.5}
            >
              {`${msg.from?.identity || 'Anonymous'}: ${msg.message}`}
            </Text>
          ))
        )}
      </group>

      {/* Input Field Simulator Box — click to focus, click elsewhere to blur */}
      <mesh
        position={[0.8, -0.9, 0.02]}
        onClick={(e) => {
          e.stopPropagation();
          setFocused(true);
        }}
        onPointerOver={() => (document.body.style.cursor = 'text')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[1.8, 0.35]} />
        <meshStandardMaterial
          color="#1e1e2f"
          emissive={focused ? '#0070f3' : '#000000'}
          emissiveIntensity={focused ? 0.3 : 0}
          roughness={0.4}
        />
      </mesh>

      <Text
        position={[0.2, -0.9, 0.03]}
        fontSize={0.12}
        color={text ? '#ffffff' : '#777777'}
        anchorX="left"
        anchorY="middle"
        maxWidth={1.6}
      >
        {text
          ? `${text}${focused && cursorOn ? '|' : ''}`
          : focused
          ? (cursorOn ? '|' : '')
          : 'Type a message...'}
      </Text>

      {/* Send Button Mesh */}
      <mesh
        position={[2.5, -0.9, 0.02]}
        onClick={(e) => {
          e.stopPropagation();
          handleSend();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <planeGeometry args={[0.8, 0.35]} />
        <meshStandardMaterial color="#0070f3" roughness={0} />
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Send
        </Text>
      </mesh>
    </group>
  );
}