# @qingshanscript/decimal

基于 BigInt + scale 模式的十进制精确运算库，解决原生 `toFixed` 浮点精度问题。

```typescript
import { Decimal } from '@qingshanscript/decimal'

// 修复经典浮点 bug
new Decimal('0.1').add('0.2').toString()  // '0.3'
new Decimal('1.005').toFixed(2)            // '1.01'（不再是 '1.00'）
```

## 安装

```bash
pnpm add @qingshanscript/decimal
```

## 使用

### 构造

```typescript
new Decimal('3.14')
new Decimal(42)
new Decimal(100n)
Decimal.from('1.005')
```

### 算术（不可变，链式调用）

```typescript
new Decimal('0.1').add('0.2').toString()   // '0.3'
new Decimal('5').sub('3').toString()        // '2'
new Decimal('1.5').mul('2').toString()      // '3'
new Decimal('1').div('3', 5).toString()     // '0.33333'
```

### 比较

```typescript
new Decimal('1.0').eq('1.00')  // true
new Decimal('5').gt('3')       // true
new Decimal('3').lt('5')       // true
```

### 格式化

```typescript
new Decimal('1.005').toFixed(2)  // '1.01'
new Decimal('1').toFixed(2)      // '1.00'
new Decimal('1.00').toString()   // '1'
```

### 舍入模式

```typescript
import { RoundingMode } from '@qingshanscript/decimal'

new Decimal('3.15').toFixed(1, RoundingMode.HALF_UP)    // '3.2'
new Decimal('3.15').toFixed(1, RoundingMode.FLOOR)       // '3.1'
new Decimal('2.5').toFixed(0, RoundingMode.HALF_EVEN)    // '2'（银行家舍入）
```

7 种舍入模式：`UP`、`DOWN`、`CEIL`、`FLOOR`、`HALF_UP`、`HALF_DOWN`、`HALF_EVEN`

### 静态方法

```typescript
Decimal.abs('-5')           // '5'
Decimal.min('3', '1', '2')  // '1'
Decimal.max('3', '1', '2')  // '3'
```

## 免责声明

本库为巩固基础所写，仅供学习与参考。如商用因 bug 造成损失，概不负责。

## License

MIT
