import { getExchangeRate, getAllAssets } from './coinapi';

/**
 * Institutional Market Service Integrity Test
 * 
 * Verifies connectivity to high-fidelity data nodes and 
 * ensures sequential ledger resolution.
 */
async function runIntegrityTest() {
  console.log("INITIALIZING_MARKET_NODE_TEST...");

  try {
    // 1. Verify Real-Time Exchange Rate Depth
    const btcRate = await getExchangeRate('BTC', 'USD');
    if (btcRate && btcRate.rate > 0) {
      console.log(`[PASS] Exchange Rate Node Synchronized: BTC/USD @ $${btcRate.rate}`);
    } else {
      throw new Error("Exchange Rate Depth Failure");
    }

    // 2. Verify Asset Metadata Mesh
    const assets = await getAllAssets();
    if (assets && assets.length > 0) {
      console.log(`[PASS] Asset Metadata Mesh Established: ${assets.length} nodes active`);
    } else {
      throw new Error("Asset Metadata Mesh Failure");
    }

    console.log("INTEGRITY_TEST_COMPLETE: NODE_STATUS_OPERATIONAL");
  } catch (error) {
    console.error("INTEGRITY_TEST_TERMINAL_FAILURE:", error);
    process.exit(1);
  }
}

// In a real project, this would be part of a Vitest/Jest suite
// For this environment, we provide it as a standalone verification node
const isMain = process.argv[1].endsWith('coinapi.test.ts');
if (isMain) {
  runIntegrityTest();
}

export { runIntegrityTest };
