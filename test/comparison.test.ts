import { describe, it, expect } from 'vitest';
import { Decimal } from '../src/index';

describe('comparison', () => {
  describe('eq', () => {
    it('same value', () => {
      expect(new Decimal('3.14').eq('3.14')).toBe(true);
    });

    it('different scale but same value', () => {
      expect(new Decimal('1.0').eq('1.00')).toBe(true);
    });

    it('integer vs decimal', () => {
      expect(new Decimal('1').eq('1.0')).toBe(true);
      expect(new Decimal('1.0').eq('1')).toBe(true);
    });

    it('-0 eq 0', () => {
      expect(new Decimal('-0').eq('0')).toBe(true);
    });

    it('not equal values', () => {
      expect(new Decimal('3.14').eq('3.15')).toBe(false);
    });

    it('positive vs negative', () => {
      expect(new Decimal('5').eq('-5')).toBe(false);
    });

    it('eq with Decimal input', () => {
      const a = new Decimal('3.14');
      const b = new Decimal('3.14');
      expect(a.eq(b)).toBe(true);
    });

    it('eq with number input', () => {
      expect(new Decimal('3').eq(3)).toBe(true);
    });

    it('eq with bigint input', () => {
      expect(new Decimal('42').eq(42n)).toBe(true);
    });

    it('very close numbers are not equal', () => {
      expect(new Decimal('0.001').eq('0.002')).toBe(false);
    });
  });

  describe('gt', () => {
    it('greater', () => {
      expect(new Decimal('5').gt('3')).toBe(true);
    });

    it('not greater', () => {
      expect(new Decimal('3').gt('5')).toBe(false);
    });

    it('equal is not greater', () => {
      expect(new Decimal('5').gt('5')).toBe(false);
    });

    it('decimal greater than integer', () => {
      expect(new Decimal('3.1').gt('3')).toBe(true);
    });

    it('positive greater than negative', () => {
      expect(new Decimal('1').gt('-1')).toBe(true);
    });

    it('negative close to zero not greater than positive', () => {
      expect(new Decimal('-0.001').gt('0')).toBe(false);
    });
  });

  describe('gte', () => {
    it('greater', () => {
      expect(new Decimal('5').gte('3')).toBe(true);
    });

    it('equal', () => {
      expect(new Decimal('5').gte('5')).toBe(true);
    });

    it('less', () => {
      expect(new Decimal('3').gte('5')).toBe(false);
    });
  });

  describe('lt', () => {
    it('less', () => {
      expect(new Decimal('3').lt('5')).toBe(true);
    });

    it('not less', () => {
      expect(new Decimal('5').lt('3')).toBe(false);
    });

    it('equal is not less', () => {
      expect(new Decimal('5').lt('5')).toBe(false);
    });

    it('negative less than positive', () => {
      expect(new Decimal('-1').lt('1')).toBe(true);
    });
  });

  describe('lte', () => {
    it('less', () => {
      expect(new Decimal('3').lte('5')).toBe(true);
    });

    it('equal', () => {
      expect(new Decimal('5').lte('5')).toBe(true);
    });

    it('greater', () => {
      expect(new Decimal('5').lte('3')).toBe(false);
    });
  });

  describe('cmp', () => {
    it('greater returns 1', () => {
      expect(new Decimal('5').cmp('3')).toBe(1);
    });

    it('less returns -1', () => {
      expect(new Decimal('3').cmp('5')).toBe(-1);
    });

    it('equal returns 0', () => {
      expect(new Decimal('5').cmp('5')).toBe(0);
    });

    it('compares different scales', () => {
      expect(new Decimal('1.0').cmp('1.00')).toBe(0);
    });

    it('compares negative numbers', () => {
      expect(new Decimal('-5').cmp('-3')).toBe(-1);
      expect(new Decimal('-3').cmp('-5')).toBe(1);
    });

    it('compares very close decimals', () => {
      expect(new Decimal('0.0000001').cmp('0.0000002')).toBe(-1);
    });

    it('compares zero with negative zero', () => {
      expect(new Decimal('0').cmp('-0')).toBe(0);
    });

    it('compares large numbers', () => {
      expect(new Decimal('999999999999999999').cmp('999999999999999998')).toBe(1);
    });
  });
});
