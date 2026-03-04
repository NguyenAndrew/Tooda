import { Excalidraw, type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useEffect, useRef, useState } from 'react';

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
      <div className="flex justify-end gap-2 bg-slate-100 p-2">
        <button
          onClick={() => setEditMode(m => !m)}
          className={`cursor-pointer rounded-[0.4rem] border border-slate-400 px-[0.9rem] py-[0.35rem] text-sm ${editMode ? 'bg-indigo-500 text-white' : 'bg-white text-slate-800'}`}
        >
          {editMode ? 'View' : 'Edit'}
        </button>
        <button
          onClick={handleExport}
          data-testid="export-json-btn"
          className="cursor-pointer rounded-[0.4rem] border border-slate-400 bg-white px-[0.9rem] py-[0.35rem] text-sm text-slate-800"
        >
          Export JSON
        </button>
      </div>
      <div ref={containerRef} className="relative h-[500px] w-full">
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
