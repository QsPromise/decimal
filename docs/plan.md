# Decimal 库实现计划

## Context

原生 `toFixed` 存在浮点精度问题（`(1.005).toFixed(2)` → `"1.00"`）。big.js 是主流解决方案但使用 ES5 字符串运算，性能和代码风格偏旧。用 BigInt + scale 模式写一个现代平替，ESM only，链式调用，覆盖 big.js 核心场景（金额计算、精确 toFixed）。

## 内部表示

```
数值 = value / 10^scale

示例:
3.14   → { value: 314n,  scale: 2 }
-0.5   → { value: -5n,   scale: 1 }
0      → { value: 0n,    scale: 0 }
```

## 项目结构

```
D:\YQSWork\decimal/
├── package.json          ✅ 已创建
├── tsconfig.json         ✅ 已创建
├── vitest.config.ts      ✅ 已创建
├── tsup.config.ts        ✅ 已创建
├── README.md             ✅ 已创建
├── CLAUDE.md             ✅ 已创建
├── src/
│   ├── index.ts          ✅ 入口，re-export
│   ├── decimal.ts        ✅ Decimal 类主体
│   ├── rounding.ts       ✅ RoundingMode 枚举 + roundBigInt 工具函数
│   └── parse.ts          ✅ 输入解析与规范化
└── test/
    ├── constructor.test.ts  ✅ 45 个用例
    ├── arithmetic.test.ts   ✅ 65 个用例
    ├── comparison.test.ts   ✅ 34 个用例
    ├── rounding.test.ts     ✅ 44 个用例
    └── format.test.ts       ✅ 69 个用例
```

## 当前进度

- [x] 项目目录创建
- [x] package.json（包名 `@qingshanscript/decimal`）
- [x] tsconfig.json（ES2020 + strict）
- [x] vitest.config.ts
- [x] tsup.config.ts（ESM only）
- [x] pnpm install -D typescript tsup vitest
- [x] src/rounding.ts
- [x] src/parse.ts（含 `.5`、`5.`、科学计数法支持）
- [x] src/decimal.ts
- [x] src/index.ts
- [x] test/*.test.ts（257 个用例全部通过）
- [x] README.md（含免责声明）
- [x] tsup build 验证（ESM + DTS 输出成功）
- [x] CLAUDE.md 项目指引
- [ ] **发布到 npm** ← 待确认

## 实现步骤

### Step 1: 项目脚手架 ✅ 已完成

创建 `package.json`、`tsconfig.json`、`vitest.config.ts`、`tsup.config.ts`。

- 包名: `@qingshanscript/decimal`
- ESM only: `"type": "module"`
- TypeScript strict mode
- Vitest 测试框架
- 构建用 `tsup`（零配置 ESM 输出）
- 包管理器: pnpm

### Step 2: 舍入模式 — `src/rounding.ts` ✅ 已完成

7 种舍入模式枚举 + `roundBigInt` 核心函数 + `pow10` 缓存

### Step 3: 输入解析 — `src/parse.ts` ✅ 已完成

- 支持 `.5`、`5.`、科学计数法（1e-7、1.5E2 等）
- 前导/尾部零压缩、负零统一
- `stripTrailingZeros` + `alignScale` 工具函数

### Step 4: Decimal 类主体 — `src/decimal.ts` ✅ 已完成

- 不可变设计，所有运算返回新实例
- 算术: add / sub / mul / div / mod / abs / neg
- 比较: eq / gt / gte / lt / lte / cmp
- 格式化: toFixed / toString / toNumber
- 静态方法: abs / min / max / from
- 静态配置: DP / RM

### Step 5: 测试 ✅ 已完成（257 个用例全部通过）

覆盖范围：
- 构造器（45）：各种输入类型、科学计数法、边界值、错误输入
- 算术（65）：四则运算、链式调用、零值、负数、舍入模式、静态配置、实际业务场景
- 比较（34）：所有比较方法、不同类型输入、大数
- 舍入（44）：7 种舍入模式 × 正负数 × 多种 scaleDiff
- 格式化（69）：toFixed 各舍入模式、toString、toNumber、静态方法、实际业务场景

### Step 6: 构建 & 导出 ✅ 已完成

`tsup` 输出 ESM + DTS，`src/index.ts` 统一 re-export。

## 关键文件路径

| 文件 | 作用 |
|------|------|
| `src/rounding.ts` | 舍入模式枚举 + roundBigInt 核心函数 |
| `src/parse.ts` | 输入规范化 |
| `src/decimal.ts` | Decimal 类主体 |
| `src/index.ts` | 入口 re-export |
| `test/*.test.ts` | 各模块测试 |

## README 免责声明

在 `README.md` 中明确写明：

> 本库为巩固基础所写，仅供学习与参考。如商用因 bug 造成损失，概不负责。

## 不做的事

- 不实现超越函数（sqrt, log, sin 等）
- 不做 CJS 兼容
- 不做 polyfill for 旧环境
- 不做 `toPrecision`、`toExponential`（v2 再加）
- 不做 `pow`（v2 再加）

## 验证方式

1. ✅ `vitest` 全部测试通过（257/257）
2. ✅ 关键验证: `(1.005).toFixed(2)` → `"1.01"` 不再是 bug
3. ✅ `tsup build` 成功输出 ESM 产物 + 类型声明
