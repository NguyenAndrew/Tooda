import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLogger } from '../utils/logger';

const logger = createLogger('FeaturesVisualization3D');

/** Pixels the label floats above the node's screen-space centre */
const LABEL_VERTICAL_OFFSET = 68;

/** Shared styles for always-visible node labels */
const LABEL_ICON_STYLE: React.CSSProperties = { fontSize: '1.1rem', lineHeight: 1 };
const LABEL_TEXT_STYLE: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#cbd5e1',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  marginTop: '2px',
};

interface FeatureNode {
  label: string;
  icon: string;
  color: number;
  description: string;
  href: string;
}

const FEATURE_NODES: FeatureNode[] = [
  {
    label: 'C4 Diagrams',
    icon: '🏗️',
    color: 0x6366f1,
    description: 'Interactive C4 architecture diagrams powered by Mermaid.',
    href: '/Tooda/c4?example=banking',
  },
  {
    label: 'Freehand Diagrams',
    icon: '✏️',
    color: 0x8b5cf6,
    description: 'Sketch architecture freely with Excalidraw.',
    href: '/Tooda/excalidraw',
  },
  {
    label: 'API Explorer',
    icon: '🔌',
    color: 0x38bdf8,
    description: 'Inspect and test API endpoints interactively.',
    href: '/Tooda/api',
  },
  {
    label: 'Platform',
    icon: '⚙️',
    color: 0xa78bfa,
    description: 'Static, zero-install, auto-deployed to GitHub Pages.',
    href: '/Tooda/features',
  },
];

export default function FeaturesVisualization3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    logger.info('Initializing 3D features visualization');

    // ── Scene setup ────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null; // transparent – page background shows through

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // ── Feature node meshes ────────────────────────────────────────────────────
    const radius = 3.5; // orbit radius in the XZ plane
    const meshes: THREE.Mesh[] = [];
    const edgeMeshes: THREE.LineSegments[] = [];

    // Shared geometry for all C4 boxes (all nodes use the same dimensions)
    const boxGeo = new THREE.BoxGeometry(1.6, 1.0, 0.15);
    const sharedEdgeGeo = new THREE.EdgesGeometry(boxGeo);

    FEATURE_NODES.forEach((node, i) => {
      const angle = (i / FEATURE_NODES.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i % 2 === 0 ? 0.6 : -0.6); // slight vertical stagger

      // C4-style flat rectangular box (card-like, faces the camera)
      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { index: i, originalY: y };
      scene.add(mesh);
      meshes.push(mesh);

      // Box edge outline (C4 diagram border style)
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
      });
      const edgeMesh = new THREE.LineSegments(sharedEdgeGeo, edgeMat);
      edgeMesh.position.copy(mesh.position);
      scene.add(edgeMesh);
      edgeMeshes.push(edgeMesh);
    });

    // ── Connecting lines between nodes ─────────────────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.25,
    });
    for (let i = 0; i < meshes.length; i++) {
      const next = (i + 1) % meshes.length;
      const points = [meshes[i].position.clone(), meshes[next].position.clone()];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      scene.add(new THREE.Line(lineGeo, lineMat));
    }

    // ── Raycaster for hover / click ────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);
    let hoveredIndex = -1;

    function updatePointer(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function handleClick() {
      if (hoveredIndex >= 0) {
        logger.info(`Feature node clicked: ${FEATURE_NODES[hoveredIndex].label}`);
        window.location.href = FEATURE_NODES[hoveredIndex].href;
      }
    }

    renderer.domElement.addEventListener('pointermove', updatePointer);
    renderer.domElement.addEventListener('click', handleClick);

    // ── Orbit rotation ─────────────────────────────────────────────────────────
    let isDragging = false;
    let lastX = 0;
    const autoRotateSpeed = 0.003;
    let groupAngle = 0;
    let dragDelta = 0;

    function handlePointerDown(e: PointerEvent) {
      isDragging = true;
      lastX = e.clientX;
    }
    function handlePointerUp() {
      isDragging = false;
    }
    function handlePointerMoveDrag(e: PointerEvent) {
      if (!isDragging) return;
      dragDelta = (e.clientX - lastX) * 0.005;
      groupAngle += dragDelta;
      lastX = e.clientX;
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMoveDrag);

    // ── Resize observer ────────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ── Animation loop ─────────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto-rotate the whole group
      if (!isDragging) {
        groupAngle += autoRotateSpeed;
      }

      // Reposition C4 boxes & edge outlines along the rotating orbit
      FEATURE_NODES.forEach((_, i) => {
        const baseAngle = (i / FEATURE_NODES.length) * Math.PI * 2;
        const a = baseAngle + groupAngle;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        const originalY = meshes[i].userData.originalY as number;
        const bobY = originalY + Math.sin(elapsed * 1.2 + i * 1.5) * 0.15;

        meshes[i].position.set(x, bobY, z);
        meshes[i].lookAt(camera.position);

        edgeMeshes[i].position.set(x, bobY, z);
        edgeMeshes[i].lookAt(camera.position);
      });

      // Update always-visible node labels
      const labelRect = renderer.domElement.getBoundingClientRect();
      FEATURE_NODES.forEach((_, i) => {
        const labelEl = labelRefs.current[i];
        if (!labelEl) return;
        const vec = meshes[i].position.clone().project(camera);
        if (vec.z > 1) {
          labelEl.style.visibility = 'hidden';
        } else {
          const lx = ((vec.x + 1) / 2) * labelRect.width;
          const ly = ((-vec.y + 1) / 2) * labelRect.height;
          labelEl.style.visibility = 'visible';
          labelEl.style.left = `${lx}px`;
          labelEl.style.top = `${Math.max(0, ly - LABEL_VERTICAL_OFFSET)}px`;
        }
      });

      // Rebuild connecting lines each frame
      scene.children
        .filter(c => c instanceof THREE.Line)
        .forEach(l => scene.remove(l));

      for (let i = 0; i < meshes.length; i++) {
        const next = (i + 1) % meshes.length;
        const pts = [meshes[i].position.clone(), meshes[next].position.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        scene.add(new THREE.Line(geo, lineMat));
      }

      // Raycasting for hover highlight
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes);
      const tooltip = tooltipRef.current;

      if (hits.length > 0) {
        const idx = hits[0].object.userData.index as number;
        hoveredIndex = idx;
        renderer.domElement.style.cursor = 'pointer';

        // Highlight hovered C4 box
        meshes.forEach((m, i) => {
          (m.material as THREE.MeshStandardMaterial).emissive.setHex(
            i === idx ? FEATURE_NODES[i].color : 0x000000
          );
          (m.material as THREE.MeshStandardMaterial).emissiveIntensity = i === idx ? 0.5 : 0;
        });

        // Show tooltip
        if (tooltip) {
          const node = FEATURE_NODES[idx];
          tooltip.innerHTML = `<span style="font-size:1.4rem">${node.icon}</span>
            <strong style="display:block;margin-top:4px;color:#e2e8f0">${node.label}</strong>
            <span style="font-size:0.75rem;color:#94a3b8">${node.description}</span>`;
          tooltip.style.display = 'block';

          // Position relative to the C4 box on screen
          const vec = meshes[idx].position.clone().project(camera);
          const rx = renderer.domElement.getBoundingClientRect();
          const sx = ((vec.x + 1) / 2) * rx.width;
          const sy = ((-vec.y + 1) / 2) * rx.height;
          tooltip.style.left = `${sx + 20}px`;
          tooltip.style.top = `${sy - 30}px`;
        }
      } else {
        hoveredIndex = -1;
        renderer.domElement.style.cursor = 'default';
        meshes.forEach(m => {
          (m.material as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
          (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
        });
        if (tooltip) tooltip.style.display = 'none';
      }

      renderer.render(scene, camera);
    }

    animate();
    logger.info('3D features visualization started');

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      logger.info('3D features visualization unmounted');
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', updatePointer);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMoveDrag);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: 'clamp(280px, 55vh, 500px)' }}>
      <div
        ref={mountRef}
        data-testid="three-canvas-container"
        className="size-full"
      />
      {/* Always-visible node labels */}
      {FEATURE_NODES.map((node, i) => (
        <div
          key={node.label}
          ref={(el) => { labelRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            textAlign: 'center',
            visibility: 'hidden',
          }}
        >
          <div style={LABEL_ICON_STYLE}>{node.icon}</div>
          <div style={LABEL_TEXT_STYLE}>{node.label}</div>
        </div>
      ))}
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          display: 'none',
          position: 'absolute',
          pointerEvents: 'none',
          background: 'rgba(15,23,42,0.92)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: '0.75rem',
          padding: '10px 14px',
          maxWidth: '220px',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
          lineHeight: '1.4',
          textAlign: 'center',
        }}
      />

    </div>
  );
}
