
import { expect, test, describe } from 'vitest';

// Mock routing logic for testing
const getRouteForAction = (action: string) => {
  if (action === "fund" || action === "withdraw" || action === "transfer") return "WALLET";
  if (action === "buy-giftcard" || action === "sell-giftcard" || action === "Giftcard") return "TRADE_GIFTCARD";
  if (action === "Crypto") return "TRADE_CRYPTO";
  if (action === "airtime" || action === "buy-airtime") return "SERVICES_AIRTIME";
  if (action === "data" || action === "buy-data") return "SERVICES_DATA";
  return "SERVICES";
};

describe('Dashboard Routing Logic', () => {
  test('should route Crypto to TRADE_CRYPTO', () => {
    expect(getRouteForAction('Crypto')).toBe('TRADE_CRYPTO');
  });

  test('should route Giftcard to TRADE_GIFTCARD', () => {
    expect(getRouteForAction('Giftcard')).toBe('TRADE_GIFTCARD');
    expect(getRouteForAction('buy-giftcard')).toBe('TRADE_GIFTCARD');
  });

  test('should route Wallet actions to WALLET', () => {
    expect(getRouteForAction('fund')).toBe('WALLET');
    expect(getRouteForAction('withdraw')).toBe('WALLET');
  });

  test('should route Services actions correctly', () => {
    expect(getRouteForAction('airtime')).toBe('SERVICES_AIRTIME');
    expect(getRouteForAction('data')).toBe('SERVICES_DATA');
  });
});
