export interface ParsedDecimal {
  value: bigint;
  scale: number;
}

const DECIMAL_RE = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

function parseString(s: string): ParsedDecimal {
  const trimmed = s.trim();
  if (trimmed === '') {
    throw new TypeError(`Decimal: invalid argument: "${s}"`);
  }

  const match = trimmed.match(DECIMAL_RE);
  if (!match) {
    throw new TypeError(`Decimal: invalid argument: "${s}"`);
  }

  const [, signStr, intPart = '', fracPart = '', expStr] = match;

  if (!intPart && !fracPart) {
    throw new TypeError(`Decimal: invalid argument: "${s}"`);
  }

  const sign = signStr === '-' ? -1n : 1n;

  const combined = fracPart ? (intPart || '0') + fracPart : (intPart || '0');
  const rawValue = BigInt(combined);
  const rawScale = fracPart.length;

  const exp = expStr ? parseInt(expStr, 10) : 0;
  const adjustedScale = rawScale - exp;

  let value: bigint;
  let scale: number;

  if (adjustedScale >= 0) {
    value = sign * rawValue;
    scale = adjustedScale;
  } else {
    const multiplier = 10n ** BigInt(-adjustedScale);
    value = sign * rawValue * multiplier;
    scale = 0;
  }

  if (value === -0n) value = 0n;

  return stripTrailingZeros({ value, scale });
}

function parseNumber(n: number): ParsedDecimal {
  if (!Number.isFinite(n)) {
    throw new TypeError(`Decimal: invalid argument: ${n}`);
  }

  if (n === 0) {
    return { value: 0n, scale: 0 };
  }

  const s = parseFloat(n.toPrecision(15)).toString();
  return parseString(s);
}

export function parse(input: unknown): ParsedDecimal {
  if (typeof input === 'string') return parseString(input);
  if (typeof input === 'number') return parseNumber(input);
  if (typeof input === 'bigint') {
    if (input === -0n) return { value: 0n, scale: 0 };
    return { value: input, scale: 0 };
  }
  if (hasDecimalFields(input)) {
    return { value: input._value, scale: input._scale };
  }
  throw new TypeError(`Decimal: invalid argument: ${input}`);
}

function hasDecimalFields(obj: unknown): obj is { _value: bigint; _scale: number } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '_value' in obj &&
    '_scale' in obj &&
    typeof (obj as any)._value === 'bigint' &&
    typeof (obj as any)._scale === 'number'
  );
}

export function stripTrailingZeros(d: ParsedDecimal): ParsedDecimal {
  if (d.value === 0n) return { value: 0n, scale: 0 };

  let { value, scale } = d;
  while (scale > 0 && value % 10n === 0n) {
    value /= 10n;
    scale--;
  }
  return { value, scale };
}

export function alignScale(a: ParsedDecimal, b: ParsedDecimal): [ParsedDecimal, ParsedDecimal] {
  if (a.scale === b.scale) return [a, b];

  const maxScale = Math.max(a.scale, b.scale);
  const diffA = maxScale - a.scale;
  const diffB = maxScale - b.scale;

  const alignedA: ParsedDecimal = diffA > 0
    ? { value: a.value * 10n ** BigInt(diffA), scale: maxScale }
    : a;
  const alignedB: ParsedDecimal = diffB > 0
    ? { value: b.value * 10n ** BigInt(diffB), scale: maxScale }
    : b;

  return [alignedA, alignedB];
}
