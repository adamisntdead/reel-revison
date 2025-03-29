import { Tune } from '@/types/tune';

export function parseABC(abc: string): Partial<Tune> {
  // Extract metadata from ABC header
  const titleMatch = abc.match(/T:(.*)/);
  const keyMatch = abc.match(/K:(.*)/);
  const typeMatch = abc.match(/R:(.*)/);
  
  const title = titleMatch ? titleMatch[1].trim() : '';
  const key = keyMatch ? keyMatch[1].trim() : 'D';
  const type = typeMatch ? typeMatch[1].trim().toLowerCase() : 'other';
  
  // Map ABC type to our type system
  const typeMap: Record<string, Tune['type']> = {
    'reel': 'reel',
    'jig': 'jig',
    'hornpipe': 'hornpipe',
    'polka': 'polka',
    'barndance': 'barndance',
    'slip jig': 'slip jig',
    'slide': 'slide',
    'waltz': 'waltz',
    'strathspey': 'strathspey',
    'three-two': 'three-two',
    'mazurka': 'mazurka',
    'march': 'march',
    'other': 'other'
  };

  return {
    title,
    key,
    type: typeMap[type] || 'other',
    abc
  };
}

export function generateABC(tune: Tune): string {
  // Check if the ABC notation already has headers
  const hasHeaders = /^[A-Z]:/.test(tune.abc.split('\n')[0]);
  
  if (hasHeaders) {
    return tune.abc;
  }
  
  // If no headers, add them
  const lines = [
    `X: 1`,
    `T:${tune.title}`,
    `R:${tune.type}`,
    `K:${tune.key}`,
    `M:4/4`,
    `L:1/8`,
    `Q:120`,
    `Z:Reel Revision`,
    tune.abc
  ];
  
  return lines.join('\n');
}

export function exportTunebook(tunes: Tune[]): string {
  return tunes.map((tune, index) => {
    const abc = generateABC(tune);
    // Replace the X: number with the sequential index + 1, handling optional space after X:
    return abc.replace(/^X:\s*\d+/, `X: ${index + 1}`);
  }).join('\n\n');
} 