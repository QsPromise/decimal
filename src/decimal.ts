import { RoundingMode, roundBigInt, pow10 } from './rounding';
import { parse, stripTrailingZeros, alignScale, type ParsedDecimal } from './parse';

type DecimalInput = string | number | bigint | Decimal;

class Decimal {
  static DP = 20;
  static RM = RoundingMode.HALF_UP;

  readonly _value: bigint;
  readonly _scale: number;

  constructor(input: DecimalInput) {
    const parsed = parse(input);
    this._value = parsed.value;
    this._scale = parsed.scale;
  }

  static from(input: DecimalInput): Decimal {
    return new Decimal(input);
  }

  // --- Arithmetic ---

  add(n: DecimalInput): Decimal {
    const p = parse(n);
    const [a, b] = alignScale({ value: this._value, scale: this._scale }, p);
    return fromInternal(a.value + b.value, a.scale);
  }

  sub(n: DecimalInput): Decimal {
    const p = parse(n);
    const [a, b] = alignScale({ value: this._value, scale: this._scale }, p);
    return fromInternal(a.value - b.value, a.scale);
  }

  mul(n: DecimalInput): Decimal {
    const p = parse(n);
    const value = this._value * p.value;
    const scale = this._scale + p.scale;
    return fromInternal(value, scale);
  }

  div(n: DecimalInput, dp?: number): Decimal {
    const p = parse(n);
    if (p.value === 0n) {
      throw new Error('Decimal: division by zero');
    }

    const targetDp = dp ?? Decimal.DP;
    const scaleDiff = targetDp + p.scale - this._scale;
    let resultValue: bigint;
    let resultScale: number;

    if (scaleDiff >= 0) {
      const scaled = this._value * pow10(scaleDiff + 1);
      const quotient = scaled / p.value;
      resultValue = roundBigInt(quotient, 1, Decimal.RM);
      resultScale = targetDp;
    } else {
      const scaled = this._value * pow10(1);
      const divisor = p.value * pow10(-scaleDiff);
      const quotient = scaled / divisor;
      resultValue = roundBigInt(quotient, 1, Decimal.RM);
      resultScale = targetDp;
    }

    return fromInternal(resultValue, resultScale);
  }

  mod(n: DecimalInput): Decimal {
    const p = parse(n);
    if (p.value === 0n) {
      throw new Error('Decimal: division by zero');
    }
    const [a, b] = alignScale({ value: this._value, scale: this._scale }, p);
    return fromInternal(a.value % b.value, a.scale);
  }

  abs(): Decimal {
    if (this._value < 0n) {
      return fromInternal(-this._value, this._scale);
    }
    return this;
  }

  neg(): Decimal {
    if (this._value === 0n) return this;
    return fromInternal(-this._value, this._scale);
  }

  // --- Comparison ---

  eq(n: DecimalInput): boolean {
    return this.cmp(n) === 0;
  }

  gt(n: DecimalInput): boolean {
    return this.cmp(n) > 0;
  }

  gte(n: DecimalInput): boolean {
    return this.cmp(n) >= 0;
  }

  lt(n: DecimalInput): boolean {
    return this.cmp(n) < 0;
  }

  lte(n: DecimalInput): boolean {
    return this.cmp(n) <= 0;
  }

  cmp(n: DecimalInput): number {
    const p = parse(n);
    const [a, b] = alignScale({ value: this._value, scale: this._scale }, p);
    if (a.value > b.value) return 1;
    if (a.value < b.value) return -1;
    return 0;
  }

  // --- Formatting ---

  toFixed(dp?: number, rm?: RoundingMode): string {
    const targetDp = dp ?? 0;
    const roundingMode = rm ?? Decimal.RM;

    if (targetDp < 0) {
      throw new TypeError(`Decimal: toFixed dp must be >= 0: ${targetDp}`);
    }

    let value = this._value;
    let scale = this._scale;

    if (targetDp < scale) {
      const scaleDiff = scale - targetDp;
      value = roundBigInt(value, scaleDiff, roundingMode);
      scale = targetDp;
    } else if (targetDp > scale) {
      const diff = targetDp - scale;
      value = value * pow10(diff);
      scale = targetDp;
    }

    const isNeg = value < 0n;
    const absValue = isNeg ? -value : value;
    let str = absValue.toString();

    if (scale > 0) {
      while (str.length <= scale) {
        str = '0' + str;
      }
      str = str.slice(0, -scale) + '.' + str.slice(-scale);
    }

    return isNeg ? '-' + str : str;
  }

  toString(): string {
    if (this._value === 0n) return '0';

    const isNeg = this._value < 0n;
    const absValue = isNeg ? -this._value : this._value;
    let str = absValue.toString();

    if (this._scale > 0) {
      while (str.length <= this._scale) {
        str = '0' + str;
      }
      const intPart = str.slice(0, -this._scale) || '0';
      const fracPart = str.slice(-this._scale).replace(/0+$/, '');
      str = fracPart ? intPart + '.' + fracPart : intPart;
    }

    return isNeg ? '-' + str : str;
  }

  toNumber(): number {
    return Number(this.toString());
  }

  // --- Static ---

  static abs(n: DecimalInput): Decimal {
    return new Decimal(n).abs();
  }

  static min(...args: DecimalInput[]): Decimal {
    if (args.length === 0) throw new TypeError('Decimal: min requires at least one argument');
    let result = new Decimal(args[0]);
    for (let i = 1; i < args.length; i++) {
      const d = new Decimal(args[i]);
      if (d.lt(result)) result = d;
    }
    return result;
  }

  static max(...args: DecimalInput[]): Decimal {
    if (args.length === 0) throw new TypeError('Decimal: max requires at least one argument');
    let result = new Decimal(args[0]);
    for (let i = 1; i < args.length; i++) {
      const d = new Decimal(args[i]);
      if (d.gt(result)) result = d;
    }
    return result;
  }
}

function fromInternal(value: bigint, scale: number): Decimal {
  const d = Object.create(Decimal.prototype) as Decimal;
  const stripped = stripTrailingZeros({ value, scale });
  (d as any)._value = stripped.value;
  (d as any)._scale = stripped.scale;
  return d;
}

export { Decimal, type DecimalInput };
