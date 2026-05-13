import { describe, it, expect } from 'vitest';
import { Decimal, RoundingMode } from '../src/index';

describe('toFixed', () => {
  it('1.005.toFixed(2) = "1.01" (the classic bug fix)', () => {
    expect(new Decimal('1.005').toFixed(2)).toBe('1.01');
  });

  it('pads with zeros', () => {
    expect(new Decimal('1').toFixed(2)).toBe('1.00');
  });

  it('rounds down when dp < scale', () => {
    expect(new Decimal('3.14').toFixed(0)).toBe('3');
  });

  it('HALF_UP: 3.15.toFixed(1) = "3.2"', () => {
    expect(new Decimal('3.15').toFixed(1)).toBe('3.2');
  });

  it('FLOOR: 3.15.toFixed(1) = "3.1"', () => {
    expect(new Decimal('3.15').toFixed(1, RoundingMode.FLOOR)).toBe('3.1');
  });

  it('handles negative zero in toFixed', () => {
    expect(new Decimal(-0).toFixed(2)).toBe('0.00');
  });

  it('negative number', () => {
    expect(new Decimal('-3.14').toFixed(1)).toBe('-3.1');
  });

  it('throws on negative dp', () => {
    expect(() => new Decimal('1').toFixed(-1)).toThrow(TypeError);
  });

  it('toFixed(0) on integer', () => {
    expect(new Decimal('42').toFixed(0)).toBe('42');
  });

  it('toFixed(0) with HALF_UP rounding', () => {
    expect(new Decimal('3.5').toFixed(0)).toBe('4');
  });

  it('toFixed(0) with FLOOR rounding', () => {
    expect(new Decimal('3.5').toFixed(0, RoundingMode.FLOOR)).toBe('3');
  });

  it('toFixed(0) with HALF_EVEN (bankers)', () => {
    expect(new Decimal('2.5').toFixed(0, RoundingMode.HALF_EVEN)).toBe('2');
    expect(new Decimal('3.5').toFixed(0, RoundingMode.HALF_EVEN)).toBe('4');
  });

  it('toFixed with large dp', () => {
    expect(new Decimal('1').toFixed(10)).toBe('1.0000000000');
  });

  it('toFixed on zero', () => {
    expect(new Decimal('0').toFixed(3)).toBe('0.000');
  });

  it('toFixed with UP rounding on positive', () => {
    expect(new Decimal('3.11').toFixed(1, RoundingMode.UP)).toBe('3.2');
  });

  it('toFixed with DOWN rounding', () => {
    expect(new Decimal('3.19').toFixed(1, RoundingMode.DOWN)).toBe('3.1');
  });

  it('toFixed with CEIL rounding', () => {
    expect(new Decimal('3.11').toFixed(1, RoundingMode.CEIL)).toBe('3.2');
    expect(new Decimal('-3.11').toFixed(1, RoundingMode.CEIL)).toBe('-3.1');
  });

  it('toFixed with HALF_DOWN rounding', () => {
    expect(new Decimal('2.5').toFixed(0, RoundingMode.HALF_DOWN)).toBe('2');
    expect(new Decimal('2.6').toFixed(0, RoundingMode.HALF_DOWN)).toBe('3');
  });

  it('toFixed on negative decimal with trailing zeros', () => {
    expect(new Decimal('-3.5').toFixed(3)).toBe('-3.500');
  });

  it('toFixed default dp=0', () => {
    expect(new Decimal('3.14').toFixed()).toBe('3');
  });

  it('toFixed on very small number', () => {
    expect(new Decimal('0.001').toFixed(5)).toBe('0.00100');
  });

  it('toFixed rounds 0.5 correctly (HALF_UP)', () => {
    expect(new Decimal('0.5').toFixed(0)).toBe('1');
    expect(new Decimal('-0.5').toFixed(0)).toBe('-1');
  });

  it('toFixed on large number with dp', () => {
    expect(new Decimal('9999999999').toFixed(2)).toBe('9999999999.00');
  });
});

describe('toString', () => {
  it('no trailing zeros', () => {
    expect(new Decimal('1.00').toString()).toBe('1');
  });

  it('preserves significant decimals', () => {
    expect(new Decimal('1.23').toString()).toBe('1.23');
  });

  it('zero', () => {
    expect(new Decimal('0').toString()).toBe('0');
  });

  it('integer', () => {
    expect(new Decimal('42').toString()).toBe('42');
  });

  it('negative', () => {
    expect(new Decimal('-3.14').toString()).toBe('-3.14');
  });

  it('small decimal', () => {
    expect(new Decimal('0.001').toString()).toBe('0.001');
  });

  it('large integer', () => {
    expect(new Decimal('999999999999999999').toString()).toBe('999999999999999999');
  });

  it('result of addition', () => {
    expect(new Decimal('0.1').add('0.2').toString()).toBe('0.3');
  });

  it('result of multiplication', () => {
    expect(new Decimal('0.1').mul('0.2').toString()).toBe('0.02');
  });

  it('result of division', () => {
    expect(new Decimal('1').div('3', 5).toString()).toBe('0.33333');
  });

  it('result of subtraction to zero', () => {
    expect(new Decimal('5').sub('5').toString()).toBe('0');
  });

  it('result of multiply by zero', () => {
    expect(new Decimal('99.99').mul('0').toString()).toBe('0');
  });

  it('very small result', () => {
    expect(new Decimal('0.001').mul('0.001').toString()).toBe('0.000001');
  });
});

describe('toNumber', () => {
  it('returns number', () => {
    expect(new Decimal('3.14').toNumber()).toBe(3.14);
  });

  it('integer', () => {
    expect(new Decimal('42').toNumber()).toBe(42);
  });

  it('zero', () => {
    expect(new Decimal('0').toNumber()).toBe(0);
  });

  it('negative', () => {
    expect(new Decimal('-5').toNumber()).toBe(-5);
  });

  it('small decimal', () => {
    expect(new Decimal('0.001').toNumber()).toBe(0.001);
  });
});

describe('static methods', () => {
  it('abs of negative', () => {
    expect(Decimal.abs('-5').toString()).toBe('5');
  });

  it('abs of positive', () => {
    expect(Decimal.abs('5').toString()).toBe('5');
  });

  it('abs of zero', () => {
    expect(Decimal.abs('0').toString()).toBe('0');
  });

  it('abs of decimal', () => {
    expect(Decimal.abs('-3.14').toString()).toBe('3.14');
  });

  it('min with multiple args', () => {
    expect(Decimal.min('3', '1', '2').toString()).toBe('1');
  });

  it('min with single arg', () => {
    expect(Decimal.min('5').toString()).toBe('5');
  });

  it('min with negative numbers', () => {
    expect(Decimal.min('3', '-1', '2').toString()).toBe('-1');
  });

  it('min with Decimal inputs', () => {
    const a = new Decimal('3');
    const b = new Decimal('1');
    expect(Decimal.min(a, b).toString()).toBe('1');
  });

  it('max with multiple args', () => {
    expect(Decimal.max('3', '1', '2').toString()).toBe('3');
  });

  it('max with single arg', () => {
    expect(Decimal.max('5').toString()).toBe('5');
  });

  it('max with negative numbers', () => {
    expect(Decimal.max('-3', '-1', '-2').toString()).toBe('-1');
  });

  it('min throws on no args', () => {
    expect(() => Decimal.min()).toThrow(TypeError);
  });

  it('max throws on no args', () => {
    expect(() => Decimal.max()).toThrow(TypeError);
  });
});

describe('real-world scenarios', () => {
  it('shopping cart total', () => {
    const items = ['12.99', '5.50', '3.75', '8.25'];
    const total = items.reduce((sum, price) => sum.add(price), new Decimal('0'));
    expect(total.toString()).toBe('30.49');
  });

  it('discount calculation', () => {
    const price = new Decimal('199.99');
    const discount = new Decimal('0.8');
    const finalPrice = price.mul(discount);
    expect(finalPrice.toFixed(2)).toBe('159.99');
  });

  it('VAT calculation', () => {
    const price = new Decimal('100');
    const vatRate = new Decimal('1.13');
    const withVat = price.mul(vatRate);
    expect(withVat.toString()).toBe('113');
  });

  it('unit price from bulk', () => {
    const total = new Decimal('35.48');
    const quantity = new Decimal('3');
    const unitPrice = total.div(quantity, 2);
    expect(unitPrice.toString()).toBe('11.83');
  });

  it('change calculation', () => {
    const paid = new Decimal('100');
    const price = new Decimal('73.56');
    const change = paid.sub(price);
    expect(change.toString()).toBe('26.44');
  });

  it('interest rate: monthly payment (simplified)', () => {
    const principal = new Decimal('10000');
    const monthlyRate = new Decimal('0.005');
    const interest = principal.mul(monthlyRate);
    expect(interest.toFixed(2)).toBe('50.00');
  });

  it('salary after deductions', () => {
    const gross = new Decimal('15000');
    const insurance = new Decimal('0.105');
    const fund = new Decimal('0.12');
    const afterInsurance = gross.sub(gross.mul(insurance));
    const afterFund = afterInsurance.sub(gross.mul(fund));
    expect(afterFund.toFixed(2)).toBe('11625.00');
  });

  it('toFixed for display: always 2 decimal places', () => {
    const prices = ['9.9', '10', '0.5', '99.999'];
    const displayed = prices.map(p => new Decimal(p).toFixed(2));
    expect(displayed).toEqual(['9.90', '10.00', '0.50', '100.00']);
  });

  it('percentage of total', () => {
    const part = new Decimal('37.5');
    const total = new Decimal('150');
    const pct = part.div(total, 4).mul('100');
    expect(pct.toFixed(2)).toBe('25.00');
  });
});
