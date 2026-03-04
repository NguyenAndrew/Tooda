import { Excalidraw, type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  elements: readonly ExcalidrawElement[];
}

export default function ExcalidrawViewer({ elements }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const observer = new ResizeObserver(() => {
      if (el.offsetWidth > 0) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          apiRef.current?.updateScene({ elements });
          apiRef.current?.scrollToContent(elements, { fitToViewport: true, viewportZoomFactor: 0.9 });
          rafId = null;
        });
      }
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [elements]);

  const btnStyle: React.CSSProperties = {
    padding: '0.35rem 0.9rem',
    borderRadius: '0.4rem',
    border: '1px solid #94a3b8',
    background: '#fff',
    color: '#1e293b',
    cursor: 'pointer',
    fontSize: '0.875rem',
  };

  function handleExport() {
    const api = apiRef.current;
    if (!api) return;
    const currentElements = api.getSceneElements();
    const json = JSON.stringify(currentElements, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `diagram-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', justifyContent: 'flex-end', background: '#f1f5f9' }}>
        <button
          onClick={() => setEditMode(m => !m)}
          style={{ ...btnStyle, background: editMode ? '#6366f1' : '#fff', color: editMode ? '#fff' : '#1e293b' }}
        >
          {editMode ? 'View' : 'Edit'}
        </button>
        <button
          onClick={handleExport}
          data-testid="export-json-btn"
          style={btnStyle}
        >
          Export JSON
        </button>
      </div>
      <div ref={containerRef} style={{ height: '500px', width: '100%', position: 'relative' }}>
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
            apiRef.current = api;
          }}
          initialData={{ elements, appState: { viewBackgroundColor: '#ffffff' } }}
          viewModeEnabled={!editMode}
          zenModeEnabled={false}
          gridModeEnabled={false}
        />
      </div>
    </div>
  );
}
