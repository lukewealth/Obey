import { describe, it, expect } from 'vitest';
import { getExchangeRate, getAllAssets } from './coinapi';

/**
 * Institutional Market Service Integrity Test
 * 
 * Verifies connectivity to high-fidelity data nodes and 
 * ensures sequential ledger resolution.
 */
describe('CoinAPI Service', () => {
  it('should fetch BTC exchange rate', async () => {
    const btcRate = await getExchangeRate('BTC', 'USD');
    expect(btcRate).toBeDefined();
    expect(btcRate?.rate).toBeGreaterThan(0);
  });

  it('should fetch all assets', async () => {
    const assets = await getAllAssets();
    expect(assets).toBeDefined();
    expect(Array.isArray(assets)).toBe(true);
    expect(assets.length).toBeGreaterThan(0);
  });
});
