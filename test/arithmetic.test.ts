import { describe, it, expect } from 'vitest';
import { Decimal, RoundingMode } from '../src/index';

describe('arithmetic', () => {
  describe('add', () => {
    it('0.1 + 0.2 = 0.3 (string input)', () => {
      expect(new Decimal('0.1').add('0.2').toString()).toBe('0.3');
    });

    it('adds integers', () => {
      expect(new Decimal('1').add('2').toString()).toBe('3');
    });

    it('adds different scales', () => {
      expect(new Decimal('1.5').add('0.25').toString()).toBe('1.75');
    });

    it('adds negative numbers', () => {
      expect(new Decimal('5').add('-3').toString()).toBe('2');
    });

    it('adds two negative numbers', () => {
      expect(new Decimal('-3').add('-7').toString()).toBe('-10');
    });

    it('adds zero', () => {
      expect(new Decimal('5').add('0').toString()).toBe('5');
    });

    it('adds negative zero', () => {
      expect(new Decimal('5').add('-0').toString()).toBe('5');
    });

    it('adds to zero', () => {
      expect(new Decimal('5').add('-5').toString()).toBe('0');
    });

    it('adds very small decimals', () => {
      expect(new Decimal('0.0001').add('0.0002').toString()).toBe('0.0003');
    });

    it('adds number input', () => {
      expect(new Decimal('5').add(3).toString()).toBe('8');
    });

    it('adds bigint input', () => {
      expect(new Decimal('5').add(10n).toString()).toBe('15');
    });

    it('adds Decimal input', () => {
      const a = new Decimal('5');
      const b = new Decimal('3');
      expect(a.add(b).toString()).toBe('8');
    });

    it('preserves immutability', () => {
      const a = new Decimal('1.5');
      const b = a.add('2.5');
      expect(a.toString()).toBe('1.5');
      expect(b.toString()).toBe('4');
    });

    it('chains additions', () => {
      const result = new Decimal('0.1').add('0.2').add('0.3');
      expect(result.toString()).toBe('0.6');
    });
  });

  describe('sub', () => {
    it('subtracts correctly', () => {
      expect(new Decimal('5').sub('3').toString()).toBe('2');
    });

    it('subtracts with different scales', () => {
      expect(new Decimal('1.5').sub('0.25').toString()).toBe('1.25');
    });

    it('handles negative result', () => {
      expect(new Decimal('3').sub('5').toString()).toBe('-2');
    });

    it('subtracts zero', () => {
      expect(new Decimal('5').sub('0').toString()).toBe('5');
    });

    it('subtracts from zero', () => {
      expect(new Decimal('0').sub('5').toString()).toBe('-5');
    });

    it('subtracts to zero', () => {
      expect(new Decimal('5').sub('5').toString()).toBe('0');
    });

    it('subtracts negative', () => {
      expect(new Decimal('5').sub('-3').toString()).toBe('8');
    });

    it('subtracts very small decimals', () => {
      expect(new Decimal('0.0005').sub('0.0002').toString()).toBe('0.0003');
    });
  });

  describe('mul', () => {
    it('multiplies correctly', () => {
      expect(new Decimal('2').mul('3').toString()).toBe('6');
    });

    it('multiplies decimals', () => {
      expect(new Decimal('1.5').mul('2').toString()).toBe('3');
    });

    it('1.005 * 1 = 1.005', () => {
      expect(new Decimal('1.005').mul('1').toString()).toBe('1.005');
    });

    it('large number multiplication', () => {
      const result = new Decimal('999999999999999999.99').mul('0.01');
      expect(result.toString()).toBe('9999999999999999.9999');
    });

    it('multiplies negative numbers', () => {
      expect(new Decimal('-2').mul('3').toString()).toBe('-6');
      expect(new Decimal('-2').mul('-3').toString()).toBe('6');
    });

    it('multiplies by zero', () => {
      expect(new Decimal('999.99').mul('0').toString()).toBe('0');
    });

    it('multiplies by one', () => {
      expect(new Decimal('3.14').mul('1').toString()).toBe('3.14');
    });

    it('multiplies two decimals', () => {
      expect(new Decimal('0.1').mul('0.2').toString()).toBe('0.02');
    });

    it('multiplies very small decimals', () => {
      expect(new Decimal('0.001').mul('0.001').toString()).toBe('0.000001');
    });

    it('multiplies negative by zero', () => {
      expect(new Decimal('-5').mul('0').toString()).toBe('0');
    });

    it('preserves immutability', () => {
      const a = new Decimal('3');
      const b = a.mul('2');
      expect(a.toString()).toBe('3');
      expect(b.toString()).toBe('6');
    });
  });

  describe('div', () => {
    it('divides correctly', () => {
      expect(new Decimal('6').div('3').toString()).toBe('2');
    });

    it('divides with decimal result', () => {
      expect(new Decimal('1').div('3').toString()).toBe('0.33333333333333333333');
    });

    it('respects custom dp', () => {
      expect(new Decimal('1').div('3', 5).toString()).toBe('0.33333');
    });

    it('throws on division by zero', () => {
      expect(() => new Decimal('1').div('0')).toThrow('division by zero');
    });

    it('divides by one', () => {
      expect(new Decimal('3.14').div('1').toString()).toBe('3.14');
    });

    it('divides zero by number', () => {
      expect(new Decimal('0').div('5').toString()).toBe('0');
    });

    it('divides smaller by larger', () => {
      expect(new Decimal('1').div('4').toString()).toBe('0.25');
    });

    it('divides negative numbers', () => {
      expect(new Decimal('-6').div('3').toString()).toBe('-2');
      expect(new Decimal('6').div('-3').toString()).toBe('-2');
      expect(new Decimal('-6').div('-3').toString()).toBe('2');
    });

    it('exact division with no remainder', () => {
      expect(new Decimal('10').div('5').toString()).toBe('2');
      expect(new Decimal('7.5').div('2.5').toString()).toBe('3');
    });

    it('HALF_UP rounding in division', () => {
      expect(new Decimal('10').div('3', 3).toString()).toBe('3.333');
      expect(new Decimal('20').div('3', 3).toString()).toBe('6.667');
    });

    it('HALF_EVEN rounding in division', () => {
      const saved = Decimal.RM;
      Decimal.RM = RoundingMode.HALF_EVEN;
      expect(new Decimal('2.5').div('1').toString()).toBe('2.5');
      Decimal.RM = saved;
    });

    it('FLOOR rounding in division', () => {
      const saved = Decimal.RM;
      Decimal.RM = RoundingMode.FLOOR;
      expect(new Decimal('10').div('3', 3).toString()).toBe('3.333');
      Decimal.RM = saved;
    });

    it('1.005.toFixed(2) via div chain', () => {
      const d = new Decimal('1.005');
      expect(d.toFixed(2)).toBe('1.01');
    });

    it('preserves immutability', () => {
      const a = new Decimal('6');
      const b = a.div('3');
      expect(a.toString()).toBe('6');
      expect(b.toString()).toBe('2');
    });
  });

  describe('mod', () => {
    it('computes modulo', () => {
      expect(new Decimal('7').mod('3').toString()).toBe('1');
    });

    it('computes modulo with zero remainder', () => {
      expect(new Decimal('6').mod('3').toString()).toBe('0');
    });

    it('computes modulo with decimals', () => {
      expect(new Decimal('7.5').mod('2.5').toString()).toBe('0');
    });

    it('modulo of smaller by larger', () => {
      expect(new Decimal('2').mod('5').toString()).toBe('2');
    });

    it('throws on modulo by zero', () => {
      expect(() => new Decimal('1').mod('0')).toThrow('division by zero');
    });
  });

  describe('abs', () => {
    it('returns absolute value of negative', () => {
      expect(new Decimal('-5').abs().toString()).toBe('5');
    });

    it('returns absolute value of positive', () => {
      expect(new Decimal('5').abs().toString()).toBe('5');
    });

    it('abs of zero is zero', () => {
      expect(new Decimal('0').abs().toString()).toBe('0');
    });

    it('abs of negative decimal', () => {
      expect(new Decimal('-3.14').abs().toString()).toBe('3.14');
    });
  });

  describe('neg', () => {
    it('negates value', () => {
      expect(new Decimal('5').neg().toString()).toBe('-5');
      expect(new Decimal('-5').neg().toString()).toBe('5');
    });

    it('zero stays zero', () => {
      expect(new Decimal('0').neg().toString()).toBe('0');
    });

    it('negates decimal', () => {
      expect(new Decimal('3.14').neg().toString()).toBe('-3.14');
      expect(new Decimal('-3.14').neg().toString()).toBe('3.14');
    });
  });

  describe('chaining', () => {
    it('chains add + sub + mul', () => {
      const result = new Decimal('1').add('2').mul('3').sub('1');
      expect(result.toString()).toBe('8');
    });

    it('chains div + add', () => {
      const result = new Decimal('10').div('3').add('1');
      expect(result.toString()).toBe('4.33333333333333333333');
    });

    it('complex expression: (0.1 + 0.2) * 3', () => {
      const result = new Decimal('0.1').add('0.2').mul('3');
      expect(result.toString()).toBe('0.9');
    });

    it('price with discount', () => {
      const result = new Decimal('99.99').mul('0.8');
      expect(result.toString()).toBe('79.992');
    });

    it('price with tax', () => {
      const result = new Decimal('100').mul('1.13');
      expect(result.toString()).toBe('113');
    });

    it('sum of prices', () => {
      const result = new Decimal('9.99').add('19.99').add('5.50');
      expect(result.toString()).toBe('35.48');
    });

    it('compound interest: 1000 * 1.05^3', () => {
      const result = new Decimal('1000').mul('1.05').mul('1.05').mul('1.05');
      expect(result.toString()).toBe('1157.625');
    });

    it('percentage calculation: 250 * 0.15', () => {
      const result = new Decimal('250').mul('0.15');
      expect(result.toString()).toBe('37.5');
    });

    it('unit price from total: 35.48 / 3', () => {
      const result = new Decimal('35.48').div('3', 2);
      expect(result.toString()).toBe('11.83');
    });
  });

  describe('static config', () => {
    it('Decimal.DP defaults to 20', () => {
      expect(Decimal.DP).toBe(20);
    });

    it('Decimal.RM defaults to HALF_UP', () => {
      expect(Decimal.RM).toBe(RoundingMode.HALF_UP);
    });

    it('changing Decimal.DP affects division', () => {
      const saved = Decimal.DP;
      Decimal.DP = 5;
      expect(new Decimal('1').div('3').toString()).toBe('0.33333');
      Decimal.DP = saved;
    });

    it('changing Decimal.RM affects rounding', () => {
      const saved = Decimal.RM;
      Decimal.RM = RoundingMode.FLOOR;
      expect(new Decimal('1').div('3', 2).toString()).toBe('0.33');
      Decimal.RM = saved;
    });
  });
});
