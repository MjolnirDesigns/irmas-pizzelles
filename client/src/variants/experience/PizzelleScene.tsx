import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { FlavorId, PackSize } from "@shared/catalog";

function waferGeometry() {
  const shape = new THREE.Shape();
  const scallops = 18;
  const steps = scallops * 6;
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = 1 + Math.sin(angle * scallops) * 0.045;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.006,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.center();
  const position = geometry.attributes.position;
  const uvs = new Float32Array(position.count * 2);
  for (let index = 0; index < position.count; index += 1) {
    uvs[index * 2] = position.getX(index) / 2.15 + 0.5;
    uvs[index * 2 + 1] = position.getZ(index) / 2.15 + 0.5;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

function waferTexture(flavor: FlavorId) {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not draw the pizzelle pattern.");
  const tint = flavor === "vanilla" ? "#f4d7ae" : "#efe2cc";
  const ink = flavor === "vanilla" ? "#6a4528" : "#4a3422";
  context.fillStyle = tint;
  context.fillRect(0, 0, size, size);
  context.translate(size / 2, size / 2);

  const toast = context.createRadialGradient(0, 0, size * 0.22, 0, 0, size * 0.5);
  toast.addColorStop(0, "rgba(255,244,220,0.2)");
  toast.addColorStop(0.72, "rgba(180,120,50,0)");
  toast.addColorStop(1, "rgba(90,52,18,0.38)");
  context.fillStyle = toast;
  context.beginPath();
  context.arc(0, 0, size * 0.5, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = ink;
  context.lineCap = "round";
  context.globalAlpha = 0.88;
  for (const radius of [90, 170, 260, 350, 430]) {
    context.lineWidth = radius > 300 ? 3 : 2;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();
  }
  context.lineWidth = 1.7;
  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2;
    context.beginPath();
    context.moveTo(Math.cos(angle) * 36, Math.sin(angle) * 36);
    context.lineTo(Math.cos(angle) * 460, Math.sin(angle) * 460);
    context.stroke();
  }
  for (let i = 0; i < 8; i += 1) {
    context.save();
    context.rotate((i / 8) * Math.PI * 2);
    context.lineWidth = 2.4;
    context.beginPath();
    context.ellipse(0, 150, 34, 86, 0, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
  context.lineWidth = 2.6;
  context.beginPath();
  context.arc(0, 0, 22, 0, Math.PI * 2);
  context.stroke();
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    context.save();
    context.translate(Math.cos(angle) * 250, Math.sin(angle) * 250);
    context.rotate(angle);
    context.beginPath();
    context.moveTo(0, -18);
    context.lineTo(12, 0);
    context.lineTo(0, 18);
    context.lineTo(-12, 0);
    context.closePath();
    context.stroke();
    context.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function PressedBatch({
  progressRef,
  flavor,
  pack,
  still,
}: {
  progressRef: React.MutableRefObject<number>;
  flavor: FlavorId;
  pack: PackSize;
  still: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const iron = useRef<THREE.Mesh>(null);
  const glass = useRef<THREE.Mesh>(null);
  const cylinder = useRef<THREE.Group>(null);
  const stack = useRef<THREE.Group>(null);
  const geometry = useMemo(() => waferGeometry(), []);
  const texture = useMemo(() => waferTexture(flavor), [flavor]);
  const cookies = pack === "12" ? 12 : 6;
  const spacing = pack === "12" ? 0.042 : 0.055;
  const stackHeight = (cookies - 1) * spacing;
  const tubeHeight = stackHeight + 0.34;

  useFrame((state) => {
    const progress = still ? 1 : THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const ease = progress * progress * (3 - 2 * progress);
    const camera = state.camera;
    const lookY = THREE.MathUtils.lerp(0, stackHeight * 0.45, ease);
    if (still) {
      const spin = state.clock.elapsedTime * 0.22;
      camera.position.set(Math.sin(spin) * 0.7, 2.35, 3.5);
      camera.lookAt(0, stackHeight * 0.45, 0);
    } else {
      camera.position.set(
        Math.sin(ease * 0.6) * 0.45,
        THREE.MathUtils.lerp(2.2, 2.7, ease),
        THREE.MathUtils.lerp(3.25, 4.05, ease),
      );
      camera.lookAt(0, lookY, 0);
    }

    if (group.current && !still) {
      group.current.rotation.y = ease * 0.4;
    }
    if (group.current && still) {
      group.current.rotation.y = state.clock.elapsedTime * 0.12;
    }

    if (iron.current) {
      const press = THREE.MathUtils.smoothstep(progress, 0.04, 0.38);
      iron.current.position.y = THREE.MathUtils.lerp(0.55, 1.8, press);
      iron.current.visible = press < 0.98;
      const material = iron.current.material as THREE.MeshStandardMaterial;
      material.opacity = 1 - press;
    }

    if (stack.current) {
      const reveal = THREE.MathUtils.smoothstep(progress, 0.04, 0.5);
      const shown = Math.max(
        1,
        Math.round(THREE.MathUtils.lerp(1, cookies, THREE.MathUtils.smoothstep(progress, 0.3, 0.82))),
      );
      stack.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        mesh.visible = index < shown;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material) material.bumpScale = 0.02 + reveal * 0.2;
      });
    }

    if (cylinder.current) {
      cylinder.current.visible = still || progress > 0.4;
    }
    if (glass.current) {
      const material = glass.current.material as THREE.MeshStandardMaterial;
      material.opacity = (still ? 1 : THREE.MathUtils.smoothstep(progress, 0.42, 0.75)) * 0.24;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={iron} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.05, 64]} />
        <meshStandardMaterial color="#3a322a" metalness={0.62} roughness={0.34} transparent />
        <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.46, 0.012, 8, 48]} />
          <meshStandardMaterial color="#9a9086" metalness={0.7} roughness={0.28} />
        </mesh>
      </mesh>
      <group ref={stack}>
        {Array.from({ length: cookies }).map((_, index) => (
          <mesh
            key={index}
            geometry={geometry}
            position={[0, index * spacing, 0]}
            rotation={[0, index * 0.2, 0]}
            visible={still || index === 0}
          >
            <meshStandardMaterial
              map={texture}
              bumpMap={texture}
              bumpScale={still ? 0.16 : 0.04}
              color="#fff8ee"
              roughness={0.72}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[1.05, 48]} />
        <meshStandardMaterial color="#1c1713" roughness={1} />
      </mesh>
      <group ref={cylinder} visible={still}>
        <mesh ref={glass} position={[0, stackHeight / 2, 0]}>
          <cylinderGeometry args={[1.16, 1.16, tubeHeight, 64, 1, true]} />
          <meshStandardMaterial
            color="#d5e3ea"
            transparent
            opacity={still ? 0.24 : 0}
            roughness={0.12}
            metalness={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, stackHeight + 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.16, 0.018, 12, 64]} />
          <meshStandardMaterial color="#e0c27a" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.16, 0.022, 12, 64]} />
          <meshStandardMaterial color="#e0c27a" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function Stage({
  progressRef,
  flavor,
  pack,
  still,
}: {
  progressRef?: React.MutableRefObject<number>;
  flavor: FlavorId;
  pack: PackSize;
  still: boolean;
}) {
  const fallback = useRef(still ? 1 : 0);
  return (
    <>
      <ambientLight intensity={0.72} />
      <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.7} color="#fff1dc" />
      <directionalLight position={[-3.4, 1.6, -2]} intensity={0.4} color="#b7c9d6" />
      <PressedBatch
        progressRef={progressRef ?? fallback}
        flavor={flavor}
        pack={pack}
        still={still}
      />
    </>
  );
}

export default function PizzelleScene({
  progressRef,
  flavor,
  pack,
}: {
  progressRef: React.MutableRefObject<number>;
  flavor: FlavorId;
  pack: PackSize;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      camera={{ position: [0.35, 2.2, 3.25], fov: 30 }}
      onCreated={({ gl }) => gl.setClearColor("#14110e")}
    >
      <Stage progressRef={progressRef} flavor={flavor} pack={pack} still={false} />
    </Canvas>
  );
}

export function StillScene({ flavor, pack }: { flavor: FlavorId; pack: PackSize }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      camera={{ position: [0.2, 1.5, 2.2], fov: 36 }}
      onCreated={({ gl }) => gl.setClearColor("#14110e")}
    >
      <Stage flavor={flavor} pack={pack} still />
    </Canvas>
  );
}
