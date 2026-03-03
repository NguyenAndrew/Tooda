import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

interface Props {
  elements: readonly ExcalidrawElement[];
}

export default function ExcalidrawViewer({ elements }: Props) {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Excalidraw
        initialData={{ elements, appState: { viewBackgroundColor: '#ffffff' } }}
        viewModeEnabled={true}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
}
