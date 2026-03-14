import { Excalidraw, exportToBlob, type ExcalidrawImperativeAPI } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { useEffect, useRef, useState } from 'react';
import { createLogger } from '../utils/logger';

declare global {
  interface Window {
    _excalidrawApis?: Record<string, () => Promise<Blob>>;
  }
}

const logger = createLogger('ExcalidrawViewer');

interface Props {
  elements: readonly ExcalidrawElement[];
  /** Optional key used to register this instance's export function on
   *  `window._excalidrawApis[registrationKey]` so that the page-level JS
   *  can trigger a PNG export without going through React. */
  registrationKey?: string;
}

export default function ExcalidrawViewer({ elements, registrationKey }: Props) {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    logger.info(`Mounted with ${elements.length} element(s)`);
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const observer = new ResizeObserver(() => {
      if (el.offsetWidth > 0) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          logger.debug('Scene updated on resize');
          apiRef.current?.updateScene({ elements });
          apiRef.current?.scrollToContent(elements, { fitToViewport: true, viewportZoomFactor: 0.9 });
          rafId = null;
        });
      }
    });

    observer.observe(el);

    return () => {
      logger.info('ExcalidrawViewer unmounted');
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [elements]);

  function handleExport() {
    const api = apiRef.current;
    if (!api) return;
    const currentElements = api.getSceneElements();
    logger.info(`Exporting ${currentElements.length} element(s) to JSON`);
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
          onClick={() => setEditMode(m => {
            const next = !m;
            logger.info(`Edit mode toggled to: ${next}`);
            return next;
          })}
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
            if (registrationKey) {
              window._excalidrawApis = window._excalidrawApis ?? {};
              window._excalidrawApis[registrationKey] = () =>
                exportToBlob({
                  elements: api.getSceneElements(),
                  appState: {
                    exportBackground: true,
                    viewBackgroundColor: '#ffffff',
                  },
                  files: api.getFiles(),
                });
            }
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
