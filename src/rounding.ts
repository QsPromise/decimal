export enum RoundingMode {
  UP = 0,
  DOWN = 1,
  CEIL = 2,
  FLOOR = 3,
  HALF_UP = 4,
  HALF_DOWN = 5,
  HALF_EVEN = 6,
}

const POW10_CACHE: bigint[] = [1n];

function pow10(n: number): bigint {
  if (n < 0) return 0n;
  if (n < POW10_CACHE.length) return POW10_CACHE[n];
  for (let i = POW10_CACHE.length; i <= n; i++) {
    POW10_CACHE[i] = POW10_CACHE[i - 1] * 10n;
  }
  return POW10_CACHE[n];
}

export function roundBigInt(value: bigint, scaleDiff: number, rm: RoundingMode): bigint {
  if (scaleDiff <= 0) return value;

  const divisor = pow10(scaleDiff);
  const quotient = value / divisor;
  const remainder = value % divisor;

  if (remainder === 0n) return quotient;

  const isPositive = value > 0n;
  const absRem = remainder < 0n ? -remainder : remainder;
  const half = divisor / 2n;
  const isHalf = absRem === half;
  const isAboveHalf = absRem > half;

  switch (rm) {
    case RoundingMode.UP:
      return isPositive ? quotient + 1n : quotient - 1n;
    case RoundingMode.DOWN:
      return quotient;
    case RoundingMode.CEIL:
      return isPositive ? quotient + 1n : quotient;
    case RoundingMode.FLOOR:
      return isPositive ? quotient : quotient - 1n;
    case RoundingMode.HALF_UP:
      return isAboveHalf || isHalf ? (isPositive ? quotient + 1n : quotient - 1n) : quotient;
    case RoundingMode.HALF_DOWN:
      return isAboveHalf ? (isPositive ? quotient + 1n : quotient - 1n) : quotient;
    case RoundingMode.HALF_EVEN:
      if (isAboveHalf) {
        return isPositive ? quotient + 1n : quotient - 1n;
      }
      if (isHalf) {
        const absQuotient = quotient < 0n ? -quotient : quotient;
        return (absQuotient % 2n === 0n) ? quotient : (isPositive ? quotient + 1n : quotient - 1n);
      }
      return quotient;
    default:
      return quotient;
  }
}

export { pow10 };
