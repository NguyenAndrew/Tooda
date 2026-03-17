import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLogger } from '../utils/logger';
import type { Connection } from '../utils/excalidrawToMermaid';
import type { DiagramNode } from '../data/excalidraw/healthcare/nodes';
import {
  LABEL_CONTAINER_STYLE,
  LABEL_ICON_STYLE,
  LABEL_TEXT_STYLE,
  LABEL_VERTICAL_OFFSET,
  TOOLTIP_BASE_STYLE,
} from './diagramStyles';

const logger = createLogger('C4Diagram3D');

interface Props {
  /** Nodes to render, derived from the diagram's node data. */
  nodes: DiagramNode[];
  /** Directed connections derived from Excalidraw arrow bindings. */
  connections: Connection[];
}

export default function C4Diagram3D({ nodes, connections }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    logger.info(`Initializing 3D diagram`);

    // Build a map from Excalidraw element ID → node index for O(1) lookups.
    const idToIndex = new Map<string, number>(
      nodes.map((n, i) => [n.excalidrawId, i]),
    );

    // Resolve Excalidraw connections to [fromIndex, toIndex] pairs, skipping
    // any connection whose endpoint doesn't appear in this level's node list.
    const connectionPairs: [number, number][] = connections.flatMap(({ from, to }) => {
      const fromIdx = idToIndex.get(from);
      const toIdx = idToIndex.get(to);
      return fromIdx !== undefined && toIdx !== undefined
        ? [[fromIdx, toIdx] as [number, number]]
        : [];
    });

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    // Prevent the browser from capturing touch events for page scroll/zoom so
    // that pointer events (drag-to-rotate) work on mobile.
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    // ── Lighting ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);
    // Fill light from the opposite side to differentiate faces
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    // ── Node meshes ────────────────────────────────────────────────────────────
    const radius = Math.max(3.5, nodes.length * 0.55);
    const meshes: THREE.Mesh[] = [];
    const edgeMeshes: THREE.LineSegments[] = [];

    // Shared geometry for all C4 boxes (depth increased for visible 3D edges)
    const boxGeo = new THREE.BoxGeometry(1.6, 1.0, 0.4);
    const sharedEdgeGeo = new THREE.EdgesGeometry(boxGeo);

    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i % 2 === 0 ? 0.6 : -0.6); // slight vertical stagger

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.5,
        metalness: 0,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
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

    // ── Connecting arrows between nodes ────────────────────────────────────────
    const ARROW_OPACITY = 0.75;
    const arrowHelpers: THREE.ArrowHelper[] = [];
    for (let i = 0; i < connectionPairs.length; i++) {
      const arrowHelper = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(),
        1,
        0xe2e8f0,
        0.35,
        0.22,
      );
      (arrowHelper.line.material as THREE.LineBasicMaterial).transparent = true;
      (arrowHelper.line.material as THREE.LineBasicMaterial).opacity = ARROW_OPACITY;
      (arrowHelper.cone.material as THREE.MeshBasicMaterial).transparent = true;
      (arrowHelper.cone.material as THREE.MeshBasicMaterial).opacity = ARROW_OPACITY;
      scene.add(arrowHelper);
      arrowHelpers.push(arrowHelper);
    }

    // ── Raycaster for hover ────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);

    function updatePointer(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    renderer.domElement.addEventListener('pointermove', updatePointer);

    // ── Orbit rotation ─────────────────────────────────────────────────────────
    let isDragging = false;
    let lastX = 0;
    const autoRotateSpeed = 0.003;
    let groupAngle = 0;

    function handlePointerDown(e: PointerEvent) {
      isDragging = true;
      lastX = e.clientX;
      updatePointer(e);
    }
    function handlePointerUp() {
      isDragging = false;
    }
    function handlePointerMoveDrag(e: PointerEvent) {
      if (!isDragging) return;
      groupAngle += (e.clientX - lastX) * 0.005;
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

      // Reposition boxes & edge outlines along the rotating orbit
      nodes.forEach((_, i) => {
        const baseAngle = (i / nodes.length) * Math.PI * 2;
        const a = baseAngle + groupAngle;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        const originalY = meshes[i].userData.originalY as number;
        const bobY = originalY + Math.sin(elapsed * 1.2 + i * 1.5) * 0.15;

        meshes[i].position.set(x, bobY, z);
        meshes[i].lookAt(camera.position);
        // Tilt slightly to reveal the top face, making depth clearly visible
        meshes[i].rotateX(-0.25);

        edgeMeshes[i].position.set(x, bobY, z);
        edgeMeshes[i].lookAt(camera.position);
        edgeMeshes[i].rotateX(-0.25);
      });

      // Update always-visible node labels
      const labelRect = renderer.domElement.getBoundingClientRect();
      nodes.forEach((_, i) => {
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

      // Update connecting arrows each frame using Excalidraw-derived connections
      connectionPairs.forEach(([fromIdx, toIdx], ci) => {
        const from = meshes[fromIdx].position.clone();
        const to = meshes[toIdx].position.clone();
        const dir = to.clone().sub(from);
        const dist = dir.length();
        dir.normalize();
        // Shorten arrow so it doesn't overlap the boxes (0.8 units per side)
        const arrowLength = Math.max(0.1, dist - 1.6);
        arrowHelpers[ci].position.copy(from.clone().addScaledVector(dir, 0.8));
        arrowHelpers[ci].setDirection(dir);
        arrowHelpers[ci].setLength(arrowLength, 0.35, 0.22);
      });

      // Raycasting for hover highlight
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes);
      const tooltip = tooltipRef.current;

      if (hits.length > 0) {
        const idx = hits[0].object.userData.index as number;
        renderer.domElement.style.cursor = 'pointer';

        // Highlight hovered box
        meshes.forEach((m, i) => {
          (m.material as THREE.MeshStandardMaterial).emissive.setHex(
            i === idx ? nodes[i].color : 0x000000
          );
          (m.material as THREE.MeshStandardMaterial).emissiveIntensity = i === idx ? 0.5 : 0;
        });

        // Show tooltip
        if (tooltip) {
          const node = nodes[idx];
          tooltip.innerHTML = `<span style="font-size:1.4rem">${node.icon}</span>
            <strong style="display:block;margin-top:4px;color:#e2e8f0">${node.label}</strong>
            <span style="font-size:0.75rem;color:#94a3b8">${node.description}</span>`;
          tooltip.style.display = 'block';

          // Position relative to the box on screen
          const vec = meshes[idx].position.clone().project(camera);
          const rx = renderer.domElement.getBoundingClientRect();
          const sx = ((vec.x + 1) / 2) * rx.width;
          const sy = ((-vec.y + 1) / 2) * rx.height;
          tooltip.style.left = `${sx + 20}px`;
          tooltip.style.top = `${sy - 30}px`;
        }
      } else {
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
    logger.info(`3D diagram started`);

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      logger.info(`3D diagram unmounted`);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', updatePointer);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMoveDrag);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [nodes, connections]);

  return (
    <div className="relative w-full" style={{ height: 'clamp(280px, 55vh, 500px)' }}>
      <div
        ref={mountRef}
        data-testid={`three-canvas-container`}
        className="size-full"
      />
      {/* Always-visible node labels */}
      {nodes.map((node, i) => (
        <div
          key={node.label}
          ref={(el) => { labelRefs.current[i] = el; }}
          style={LABEL_CONTAINER_STYLE}
        >
          <div style={LABEL_ICON_STYLE}>{node.icon}</div>
          <div style={LABEL_TEXT_STYLE}>{node.label}</div>
        </div>
      ))}
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          ...TOOLTIP_BASE_STYLE,
          display: 'none',
        }}
      />
    </div>
  );
}
