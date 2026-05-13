import { describe, it, expect } from 'vitest';
import { Decimal } from '../src/index';

describe('constructor', () => {
  // --- 基本解析 ---
  it('parses string with decimal', () => {
    const d = new Decimal('3.14');
    expect(d._value).toBe(314n);
    expect(d._scale).toBe(2);
  });

  it('parses integer string', () => {
    const d = new Decimal('42');
    expect(d._value).toBe(42n);
    expect(d._scale).toBe(0);
  });

  it('parses negative string', () => {
    const d = new Decimal('-0.5');
    expect(d._value).toBe(-5n);
    expect(d._scale).toBe(1);
  });

  it('parses zero', () => {
    const d = new Decimal('0');
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  // --- 前导/尾部零 ---
  it('strips leading zeros', () => {
    const d = new Decimal('001.200');
    expect(d._value).toBe(12n);
    expect(d._scale).toBe(1);
  });

  it('strips trailing zeros after decimal', () => {
    const d = new Decimal('5.00');
    expect(d._value).toBe(5n);
    expect(d._scale).toBe(0);
  });

  it('strips all trailing zeros leaving integer', () => {
    const d = new Decimal('100.000');
    expect(d._value).toBe(100n);
    expect(d._scale).toBe(0);
  });

  // --- 负零 ---
  it('normalizes negative zero (number) to positive zero', () => {
    const d = new Decimal(-0);
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  it('normalizes "-0" string to positive zero', () => {
    const d = new Decimal('-0');
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  // --- 科学计数法 ---
  it('parses scientific notation 1e-7', () => {
    const d = new Decimal('1e-7');
    expect(d._value).toBe(1n);
    expect(d._scale).toBe(7);
  });

  it('parses scientific notation 5e3', () => {
    const d = new Decimal('5e3');
    expect(d._value).toBe(5000n);
    expect(d._scale).toBe(0);
  });

  it('parses scientific notation with decimal mantissa 1.5e2', () => {
    const d = new Decimal('1.5e2');
    expect(d._value).toBe(150n);
    expect(d._scale).toBe(0);
    expect(d.toString()).toBe('150');
  });

  it('parses scientific notation 1.5e-2', () => {
    const d = new Decimal('1.5e-2');
    expect(d._value).toBe(15n);
    expect(d._scale).toBe(3);
    expect(d.toString()).toBe('0.015');
  });

  it('parses scientific notation with uppercase E', () => {
    const d = new Decimal('3E5');
    expect(d._value).toBe(300000n);
    expect(d._scale).toBe(0);
    expect(d.toString()).toBe('300000');
  });

  it('parses negative exponent with sign 2.5e-4', () => {
    const d = new Decimal('2.5e-4');
    expect(d.toString()).toBe('0.00025');
  });

  // --- 特殊格式 ---
  it('parses string with leading + sign', () => {
    const d = new Decimal('+3.14');
    expect(d._value).toBe(314n);
    expect(d._scale).toBe(2);
  });

  it('parses string with whitespace', () => {
    const d = new Decimal('  3.14  ');
    expect(d._value).toBe(314n);
    expect(d._scale).toBe(2);
  });

  it('parses "0.0" as zero', () => {
    const d = new Decimal('0.0');
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  it('parses ".5" as 0.5', () => {
    const d = new Decimal('.5');
    expect(d._value).toBe(5n);
    expect(d._scale).toBe(1);
  });

  it('parses "5." as 5', () => {
    const d = new Decimal('5.');
    expect(d._value).toBe(5n);
    expect(d._scale).toBe(0);
  });

  // --- number 输入 ---
  it('parses number input', () => {
    const d = new Decimal(3.14);
    expect(d._value).toBe(314n);
    expect(d._scale).toBe(2);
  });

  it('normalizes float input 0.1 + 0.2 to 0.3 via toPrecision(15)', () => {
    const d = new Decimal(0.1 + 0.2);
    expect(d.toString()).toBe('0.3');
  });

  it('parses number 0', () => {
    const d = new Decimal(0);
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  it('parses negative number', () => {
    const d = new Decimal(-2.5);
    expect(d._value).toBe(-25n);
    expect(d._scale).toBe(1);
  });

  // --- bigint 输入 ---
  it('parses bigint input', () => {
    const d = new Decimal(100n);
    expect(d._value).toBe(100n);
    expect(d._scale).toBe(0);
  });

  it('parses negative bigint', () => {
    const d = new Decimal(-999n);
    expect(d._value).toBe(-999n);
    expect(d._scale).toBe(0);
  });

  it('parses bigint zero', () => {
    const d = new Decimal(0n);
    expect(d._value).toBe(0n);
    expect(d._scale).toBe(0);
  });

  // --- Decimal 输入 ---
  it('parses Decimal input', () => {
    const original = new Decimal('3.14');
    const copy = new Decimal(original);
    expect(copy._value).toBe(314n);
    expect(copy._scale).toBe(2);
  });

  it('Decimal input is independent (immutability)', () => {
    const original = new Decimal('3.14');
    const copy = new Decimal(original);
    expect(copy.toString()).toBe('3.14');
  });

  // --- 大数 ---
  it('parses very large integer string', () => {
    const d = new Decimal('999999999999999999999999999999');
    expect(d._value).toBe(999999999999999999999999999999n);
    expect(d._scale).toBe(0);
  });

  it('parses very small decimal string', () => {
    const d = new Decimal('0.0000000001');
    expect(d._value).toBe(1n);
    expect(d._scale).toBe(10);
    expect(d.toString()).toBe('0.0000000001');
  });

  // --- 错误输入 ---
  it('throws on NaN', () => {
    expect(() => new Decimal(NaN)).toThrow(TypeError);
  });

  it('throws on Infinity', () => {
    expect(() => new Decimal(Infinity)).toThrow(TypeError);
  });

  it('throws on -Infinity', () => {
    expect(() => new Decimal(-Infinity)).toThrow(TypeError);
  });

  it('throws on empty string', () => {
    expect(() => new Decimal('')).toThrow(TypeError);
  });

  it('throws on invalid string', () => {
    expect(() => new Decimal('abc')).toThrow(TypeError);
  });

  it('throws on multiple decimal points', () => {
    expect(() => new Decimal('1.2.3')).toThrow(TypeError);
  });

  it('throws on letters mixed with digits', () => {
    expect(() => new Decimal('12ab34')).toThrow(TypeError);
  });

  it('throws on whitespace-only string', () => {
    expect(() => new Decimal('   ')).toThrow(TypeError);
  });

  it('throws on object input', () => {
    expect(() => new Decimal({} as any)).toThrow(TypeError);
  });

  it('throws on undefined input', () => {
    expect(() => new Decimal(undefined as any)).toThrow(TypeError);
  });

  it('throws on null input', () => {
    expect(() => new Decimal(null as any)).toThrow(TypeError);
  });

  // --- 工厂方法 ---
  it('Decimal.from works as factory', () => {
    const d = Decimal.from('2.5');
    expect(d._value).toBe(25n);
    expect(d._scale).toBe(1);
  });

  it('Decimal.from with number', () => {
    const d = Decimal.from(3.14);
    expect(d.toString()).toBe('3.14');
  });

  it('Decimal.from with bigint', () => {
    const d = Decimal.from(100n);
    expect(d.toString()).toBe('100');
  });
});
