import { Excalidraw, type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useEffect, useRef } from 'react';

interface Props {
  elements: readonly ExcalidrawElement[];
}

export default function ExcalidrawViewer({ elements }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      apiRef.current?.scrollToContent(elements, { fitToViewport: true, viewportZoomFactor: 0.9 });
    });
    return () => cancelAnimationFrame(raf);
  }, [elements]);

  return (
    <div style={{ height: '500px', width: '100%' }}>
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
