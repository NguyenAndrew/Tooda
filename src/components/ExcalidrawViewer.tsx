import { Excalidraw, type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useEffect, useRef } from 'react';

interface Props {
  elements: readonly ExcalidrawElement[];
}

export default function ExcalidrawViewer({ elements }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} style={{ height: '500px', width: '100%' }}>
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
          apiRef.current = api;
        }}
        initialData={{ elements, appState: { viewBackgroundColor: '#ffffff' } }}
        viewModeEnabled={true}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
}
