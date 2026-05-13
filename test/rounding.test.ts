import { describe, it, expect } from 'vitest';
import { RoundingMode, roundBigInt } from '../src/rounding';

describe('roundBigInt', () => {
  describe('HALF_UP', () => {
    it('rounds 2.5 up to 3', () => {
      expect(roundBigInt(25n, 1, RoundingMode.HALF_UP)).toBe(3n);
    });

    it('rounds 2.4 down to 2', () => {
      expect(roundBigInt(24n, 1, RoundingMode.HALF_UP)).toBe(2n);
    });

    it('rounds -2.5 away from zero to -3', () => {
      expect(roundBigInt(-25n, 1, RoundingMode.HALF_UP)).toBe(-3n);
    });

    it('rounds -2.4 toward zero to -2', () => {
      expect(roundBigInt(-24n, 1, RoundingMode.HALF_UP)).toBe(-2n);
    });

    it('no rounding when scaleDiff=0', () => {
      expect(roundBigInt(123n, 0, RoundingMode.HALF_UP)).toBe(123n);
    });

    it('no rounding when remainder is 0', () => {
      expect(roundBigInt(30n, 1, RoundingMode.HALF_UP)).toBe(3n);
    });

    it('rounds 0.5 up to 1', () => {
      expect(roundBigInt(5n, 1, RoundingMode.HALF_UP)).toBe(1n);
    });

    it('rounds -0.5 away from zero to -1', () => {
      expect(roundBigInt(-5n, 1, RoundingMode.HALF_UP)).toBe(-1n);
    });

    it('rounds with scaleDiff=2', () => {
      expect(roundBigInt(3141n, 2, RoundingMode.HALF_UP)).toBe(31n);
      expect(roundBigInt(3150n, 2, RoundingMode.HALF_UP)).toBe(32n);
    });

    it('rounds with large scaleDiff', () => {
      expect(roundBigInt(1005n, 3, RoundingMode.HALF_UP)).toBe(1n);
    });
  });

  describe('HALF_EVEN (bankers)', () => {
    it('rounds 2.5 to 2 (even)', () => {
      expect(roundBigInt(25n, 1, RoundingMode.HALF_EVEN)).toBe(2n);
    });

    it('rounds 3.5 to 4 (even)', () => {
      expect(roundBigInt(35n, 1, RoundingMode.HALF_EVEN)).toBe(4n);
    });

    it('rounds -2.5 to -2 (even)', () => {
      expect(roundBigInt(-25n, 1, RoundingMode.HALF_EVEN)).toBe(-2n);
    });

    it('rounds -3.5 to -4 (even)', () => {
      expect(roundBigInt(-35n, 1, RoundingMode.HALF_EVEN)).toBe(-4n);
    });

    it('rounds 1.5 to 2 (even)', () => {
      expect(roundBigInt(15n, 1, RoundingMode.HALF_EVEN)).toBe(2n);
    });

    it('rounds 4.5 to 4 (even)', () => {
      expect(roundBigInt(45n, 1, RoundingMode.HALF_EVEN)).toBe(4n);
    });

    it('above half still rounds up', () => {
      expect(roundBigInt(26n, 1, RoundingMode.HALF_EVEN)).toBe(3n);
    });

    it('below half still rounds down', () => {
      expect(roundBigInt(24n, 1, RoundingMode.HALF_EVEN)).toBe(2n);
    });

    it('rounds with even quotient at scaleDiff=2', () => {
      expect(roundBigInt(3250n, 2, RoundingMode.HALF_EVEN)).toBe(32n);
    });

    it('rounds with odd quotient at scaleDiff=2', () => {
      expect(roundBigInt(3150n, 2, RoundingMode.HALF_EVEN)).toBe(32n);
    });
  });

  describe('UP', () => {
    it('rounds positive away from zero', () => {
      expect(roundBigInt(21n, 1, RoundingMode.UP)).toBe(3n);
    });

    it('rounds negative away from zero', () => {
      expect(roundBigInt(-21n, 1, RoundingMode.UP)).toBe(-3n);
    });

    it('rounds exact division (no change)', () => {
      expect(roundBigInt(30n, 1, RoundingMode.UP)).toBe(3n);
    });
  });

  describe('DOWN', () => {
    it('truncates positive toward zero', () => {
      expect(roundBigInt(29n, 1, RoundingMode.DOWN)).toBe(2n);
    });

    it('truncates negative toward zero', () => {
      expect(roundBigInt(-29n, 1, RoundingMode.DOWN)).toBe(-2n);
    });

    it('truncates exact division (no change)', () => {
      expect(roundBigInt(30n, 1, RoundingMode.DOWN)).toBe(3n);
    });
  });

  describe('CEIL', () => {
    it('rounds positive up', () => {
      expect(roundBigInt(21n, 1, RoundingMode.CEIL)).toBe(3n);
    });

    it('rounds negative toward zero', () => {
      expect(roundBigInt(-21n, 1, RoundingMode.CEIL)).toBe(-2n);
    });

    it('exact division (no change)', () => {
      expect(roundBigInt(30n, 1, RoundingMode.CEIL)).toBe(3n);
    });

    it('rounds 0.5 up to 1', () => {
      expect(roundBigInt(5n, 1, RoundingMode.CEIL)).toBe(1n);
    });

    it('rounds -0.5 to 0', () => {
      expect(roundBigInt(-5n, 1, RoundingMode.CEIL)).toBe(0n);
    });
  });

  describe('FLOOR', () => {
    it('rounds positive toward zero', () => {
      expect(roundBigInt(21n, 1, RoundingMode.FLOOR)).toBe(2n);
    });

    it('rounds negative away from zero', () => {
      expect(roundBigInt(-21n, 1, RoundingMode.FLOOR)).toBe(-3n);
    });

    it('exact division (no change)', () => {
      expect(roundBigInt(30n, 1, RoundingMode.FLOOR)).toBe(3n);
    });

    it('rounds 0.5 to 0', () => {
      expect(roundBigInt(5n, 1, RoundingMode.FLOOR)).toBe(0n);
    });

    it('rounds -0.5 to -1', () => {
      expect(roundBigInt(-5n, 1, RoundingMode.FLOOR)).toBe(-1n);
    });
  });

  describe('HALF_DOWN', () => {
    it('rounds half toward zero (positive)', () => {
      expect(roundBigInt(25n, 1, RoundingMode.HALF_DOWN)).toBe(2n);
    });

    it('rounds half toward zero (negative)', () => {
      expect(roundBigInt(-25n, 1, RoundingMode.HALF_DOWN)).toBe(-2n);
    });

    it('above half rounds away from zero', () => {
      expect(roundBigInt(26n, 1, RoundingMode.HALF_DOWN)).toBe(3n);
      expect(roundBigInt(-26n, 1, RoundingMode.HALF_DOWN)).toBe(-3n);
    });

    it('below half rounds toward zero', () => {
      expect(roundBigInt(24n, 1, RoundingMode.HALF_DOWN)).toBe(2n);
    });
  });

  describe('edge cases', () => {
    it('rounds zero value', () => {
      expect(roundBigInt(0n, 5, RoundingMode.HALF_UP)).toBe(0n);
    });

    it('negative scaleDiff returns value as-is', () => {
      expect(roundBigInt(123n, -1, RoundingMode.HALF_UP)).toBe(123n);
    });

    it('rounds very large number', () => {
      const big = 123456789012345678901234567890n;
      expect(roundBigInt(big, 5, RoundingMode.DOWN)).toBe(1234567890123456789012345n);
    });
  });
});
