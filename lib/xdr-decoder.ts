import { SorobanXdrParsedEvent } from '@/types';

/**
 * Parses raw Soroban XDR hex string or topic array into human-readable event parameters.
 */
export function parseSorobanXdrEvent(
  contractId: string,
  topicsHex: string[],
  dataHex: string,
  ledgerSequence: number
): SorobanXdrParsedEvent {
  const decodedTopics = topicsHex.map((hex) => {
    try {
      const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex;
      if (!cleaned) return '';
      const str = Buffer.from(cleaned, 'hex').toString('utf8').replace(/[^\x20-\x7E]/g, '');
      return str || cleaned;
    } catch {
      return hex;
    }
  });

  let decodedValue: string | number | object = dataHex;
  try {
    if (dataHex.startsWith('0x') && dataHex.length <= 18) {
      decodedValue = parseInt(dataHex, 16);
    } else {
      const rawStr = Buffer.from(dataHex.replace(/^0x/, ''), 'hex').toString('utf8').replace(/[^\x20-\x7E]/g, '');
      if (rawStr.trim()) {
        decodedValue = rawStr;
      }
    }
  } catch {
    decodedValue = dataHex;
  }

  return {
    contractId,
    topics: decodedTopics,
    dataHex,
    decodedValue,
    ledgerSequence,
    timestamp: Date.now(),
  };
}

export function formatXdrHash(hash: string): string {
  if (!hash) return '';
  return hash.startsWith('0x') ? hash.slice(2).toLowerCase() : hash.toLowerCase();
}
