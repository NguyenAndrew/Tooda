import { useState, useEffect } from 'react';
import HealthcarePlatform3D from './HealthcarePlatform3D';
import type { DiagramNode } from '../data/healthcare/nodes';
import type { Connection } from '../utils/excalidrawToMermaid';

interface Props {
  allNodes: Record<string, DiagramNode[]>;
  allConnections: Record<string, Connection[]>;
  initialExample: string;
  level: 1 | 2 | 3 | 4;
}

export default function C4Platform3D({ allNodes, allConnections, initialExample, level }: Props) {
  const [example, setExample] = useState(initialExample);

  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent<{ example: string }>).detail?.example;
      if (key && allNodes[key]) setExample(key);
    };
    window.addEventListener('c4-example-changed', handler);
    return () => window.removeEventListener('c4-example-changed', handler);
  }, [allNodes]);

  return (
    <HealthcarePlatform3D
      level={level}
      connections={allConnections[example] ?? []}
      nodes={allNodes[example] ?? []}
    />
  );
}
