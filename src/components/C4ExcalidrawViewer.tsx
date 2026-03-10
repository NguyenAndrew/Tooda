import { useState, useEffect } from 'react';
import ExcalidrawViewer from './ExcalidrawViewer';

interface Props {
  allElements: Record<string, any[]>;
  initialExample: string;
}

export default function C4ExcalidrawViewer({ allElements, initialExample }: Props) {
  const [example, setExample] = useState(initialExample);

  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent<{ example: string }>).detail?.example;
      if (key && allElements[key]) setExample(key);
    };
    window.addEventListener('c4-example-changed', handler);
    return () => window.removeEventListener('c4-example-changed', handler);
  }, [allElements]);

  return <ExcalidrawViewer elements={allElements[example] ?? []} />;
}
