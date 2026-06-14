import { v4 as uuidv4 } from 'uuid';

/**
 * ID Node: Core identification logic for the Institutional Mesh.
 * Ensures every entity in the ecosystem has a unique, verifiable identifier.
 */
export const generateNodeId = (prefix: string = 'NODE'): string => {
  const shortId = uuidv4().substring(0, 8).toUpperCase();
  return `${prefix}-${shortId}`;
};

export const validateNodeId = (id: string): boolean => {
  return /^[A-Z]+-[A-Z0-9]{8}$/.test(id);
};

export const alignNodeMetadata = (source: any, target: any) => {
  return {
    ...target,
    ...source,
    alignedAt: new Date(),
    nodeHash: Buffer.from(JSON.stringify(source)).toString('base64').substring(0, 12)
  };
};
