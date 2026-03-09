import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLogger } from '../utils/logger';
import type { Connection } from '../utils/excalidrawToMermaid';

const logger = createLogger('HealthcarePlatform3D');

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

interface DiagramNode {
  label: string;
  icon: string;
  color: number;
  description: string;
  /** Excalidraw element ID – used to map Excalidraw arrow bindings to nodes. */
  excalidrawId: string;
}

const LEVEL_NODES: Record<number, DiagramNode[]> = {
  1: [
    { label: 'Patient',             icon: '👤', color: 0x6366f1, description: 'Books appointments and views medical records.',            excalidrawId: 'l1-patient'  },
    { label: 'Doctor',              icon: '🩺', color: 0x6366f1, description: 'Views patient records and orders tests.',                  excalidrawId: 'l1-doctor'   },
    { label: 'Admin',               icon: '👑', color: 0x6366f1, description: 'Manages users and platform configuration.',               excalidrawId: 'l1-admin'    },
    { label: 'Healthcare Platform', icon: '🏥', color: 0x8b5cf6, description: 'Provides appointment scheduling, EMR, and billing.',       excalidrawId: 'l1-platform' },
    { label: 'Pharmacy',            icon: '💊', color: 0x64748b, description: 'Receives prescriptions and dispenses medication.',         excalidrawId: 'l1-pharmacy' },
    { label: 'Insurance',           icon: '🛡️', color: 0x64748b, description: 'Verifies patient coverage and processes claims.',          excalidrawId: 'l1-insurance'},
    { label: 'Lab',                 icon: '🔬', color: 0x64748b, description: 'Receives test orders and returns results.',                excalidrawId: 'l1-lab'      },
  ],
  2: [
    { label: 'Patient',         icon: '👤', color: 0x6366f1, description: 'Books appointments and views medical records.',    excalidrawId: 'l2-patient' },
    { label: 'Doctor',          icon: '🩺', color: 0x6366f1, description: 'Views patient records and orders tests.',          excalidrawId: 'l2-doctor'  },
    { label: 'Web App',         icon: '🌐', color: 0x0ea5e9, description: 'Delivers the web front-end to users via their browser.', excalidrawId: 'l2-webapp'  },
    { label: 'Mobile App',      icon: '📱', color: 0x0ea5e9, description: 'Provides healthcare access on mobile devices.',    excalidrawId: 'l2-mobile'  },
    { label: 'API Gateway',     icon: '🔀', color: 0x0ea5e9, description: 'Routes requests and enforces authentication.',      excalidrawId: 'l2-api'     },
    { label: 'EMR Service',     icon: '📋', color: 0x0ea5e9, description: 'Manages electronic medical records.',              excalidrawId: 'l2-emr'     },
    { label: 'Appt Service',    icon: '📅', color: 0x0ea5e9, description: 'Handles appointment scheduling and reminders.',    excalidrawId: 'l2-appt'    },
    { label: 'Billing Service', icon: '💳', color: 0x0ea5e9, description: 'Processes billing and insurance claims.',          excalidrawId: 'l2-billing' },
    { label: 'Database',        icon: '🗄️', color: 0x06b6d4, description: 'Stores patient records, appointments, and billing data.', excalidrawId: 'l2-db'      },
    { label: 'Message Queue',   icon: '📨', color: 0x0ea5e9, description: 'Decouples async communication between services.',  excalidrawId: 'l2-queue'   },
  ],
  3: [
    { label: 'API Gateway',       icon: '🔀', color: 0x64748b, description: 'Routes authenticated requests to the EMR Service.', excalidrawId: 'l3-gateway' },
    { label: 'Database',          icon: '🗄️', color: 0x64748b, description: 'Stores medical records.',                           excalidrawId: 'l3-db'      },
    { label: 'Record Controller', icon: '🎮', color: 0x10b981, description: 'Exposes REST endpoints for medical records.',        excalidrawId: 'l3-ctrl'    },
    { label: 'Record Service',    icon: '⚙️', color: 0x10b981, description: 'Business logic for creating and retrieving records.', excalidrawId: 'l3-svc'     },
    { label: 'Record Repo',       icon: '📦', color: 0x10b981, description: 'Abstracts database access for medical records.',     excalidrawId: 'l3-repo'    },
    { label: 'Auth Module',       icon: '🔐', color: 0x10b981, description: 'Validates JWT tokens on incoming requests.',         excalidrawId: 'l3-auth'    },
    { label: 'Audit Logger',      icon: '📝', color: 0x10b981, description: 'Logs all record access for compliance.',             excalidrawId: 'l3-audit'   },
    { label: 'Cache Client',      icon: '⚡', color: 0x10b981, description: 'Caches frequently accessed records.',                excalidrawId: 'l3-cache'   },
  ],
  4: [
    { label: 'RecordController',  icon: '🎮', color: 0x8b5cf6, description: 'Exposes REST endpoints for medical records.',               excalidrawId: 'l4-ctrl'  },
    { label: 'RecordService',     icon: '⚙️', color: 0x8b5cf6, description: 'Business logic for creating and retrieving records.',       excalidrawId: 'l4-svc'   },
    { label: 'RecordRepository',  icon: '📦', color: 0x8b5cf6, description: 'Implements IRecordRepository using PostgreSQL.',            excalidrawId: 'l4-repo'  },
    { label: 'MedicalRecord',     icon: '📄', color: 0x8b5cf6, description: 'Entity representing a medical record.',                     excalidrawId: 'l4-model' },
    { label: 'CacheClient',       icon: '⚡', color: 0x8b5cf6, description: 'Caches frequently accessed records.',                       excalidrawId: 'l4-cache' },
  ],
};

interface Props {
  level: 1 | 2 | 3 | 4;
  /** Directed connections derived from Excalidraw arrow bindings. */
  connections: Connection[];
}

export default function HealthcarePlatform3D({ level, connections }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const nodes = LEVEL_NODES[level];
    logger.info(`Initializing 3D healthcare diagram for level ${level}`);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
        roughness: 0.15,
        metalness: 0.3,
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
    logger.info(`3D healthcare diagram level ${level} started`);

    // ── Cleanup ────────────────────────────────────────────────────────────────
    return () => {
      logger.info(`3D healthcare diagram level ${level} unmounted`);
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
  }, [level]);

  const nodes = LEVEL_NODES[level];

  return (
    <div className="relative w-full" style={{ height: 'clamp(280px, 55vh, 500px)' }}>
      <div
        ref={mountRef}
        data-testid={`three-canvas-container-level${level}`}
        className="size-full"
      />
      {/* Always-visible node labels */}
      {nodes.map((node, i) => (
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
