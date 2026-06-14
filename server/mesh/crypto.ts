import * as coinapi from '../services/coinapi';
import { storeMetadata } from './metadatabse';
import { generateNodeId } from './id_node';

/**
 * Crypto Node: Handles real-time asset data pulls and metadata synchronization.
 */
export const syncCryptoAsset = async (symbol: string) => {
  try {
    console.log(`[CRYPTO_MESH] Pulling real-time data for: ${symbol}`);
    const rateData = await coinapi.getExchangeRate(symbol, 'NGN');
    const assetData = await coinapi.getAllAssets();
    
    const assetMetadata = assetData.find((a: any) => a.asset_id === symbol);
    
    const payload = {
      symbol,
      priceNGN: rateData?.rate || 0,
      name: assetMetadata?.name || symbol,
      lastUpdated: new Date()
    };
    
    const nodeId = `CRY-${symbol}`;
    await storeMetadata(nodeId, 'CRYPTO', payload);
    
    return payload;
  } catch (error) {
    console.error(`[CRYPTO_MESH_ERROR] Sync failed for ${symbol}:`, error);
    throw error;
  }
};

export const getMarketOverview = async () => {
  const topAssets = ['BTC', 'ETH', 'SOL', 'USDT'];
  return await Promise.all(topAssets.map(asset => syncCryptoAsset(asset)));
};
