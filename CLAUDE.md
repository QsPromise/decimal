# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@qingshanscript/decimal` — 一个基于 BigInt + scale 模式的十进制精确运算库，解决原生 `toFixed` 浮点精度问题（如 `(1.005).toFixed(2)` → `"1.00"`）。ESM only，不可变链式调用，目标覆盖 big.js 核心场景（金额计算、精确 toFixed）。

**定位：学习项目，非生产级。** README 需注明免责声明。

## Commands

```bash
pnpm install -D typescript tsup vitest   # 安装依赖
pnpm build                               # tsup 构建 ESM 产物
pnpm test                                # vitest 单次运行
pnpm test:watch                          # vitest watch 模式
pnpm typecheck                           # tsc --noEmit 类型检查
pnpm vitest run test/rounding.test.ts    # 运行单个测试文件
```

## Internal Representation

```
数值 = value / 10^scale

3.14   → { value: 314n,  scale: 2 }
-0.5   → { value: -5n,   scale: 1 }
0      → { value: 0n,    scale: 0 }
```

所有运算基于 `(value: bigint, scale: number)` 对，对齐 scale 后执行 BigInt 整数运算，结果压缩尾部零。

## Architecture

```
src/
  rounding.ts   — RoundingMode 枚举 (7种) + roundBigInt 核心函数
  parse.ts      — 输入解析 (string|number|bigint|Decimal → {value, scale})
  decimal.ts    — Decimal 类主体 (不可变，所有运算返回新实例)
  index.ts      — re-export 入口

test/
  constructor.test.ts
  arithmetic.test.ts
  comparison.test.ts
  rounding.test.ts
  format.test.ts
```

关键依赖链：`decimal.ts` → `parse.ts` + `rounding.ts`。`roundBigInt` 是除法和 toFixed 的共同基础。

## Key Design Decisions

- **ESM only**：`"type": "module"`，不做 CJS 兼容
- **不可变**：所有运算方法返回新 `Decimal`，不修改 `this`
- **工厂方法**：`new Decimal(input)` 和 `Decimal.from(input)` 并存
- **静态配置**：`Decimal.DP = 20`（默认除法精度）、`Decimal.RM = RoundingMode.HALF_UP`
- **科学计数法**：`"1e-7"` 等格式需在 parse.ts 中处理
- **负零统一**：`-0` 规范化为 `+0`

## Scope Exclusions

不做：超越函数 (sqrt/log/sin)、CJS 兼容、旧环境 polyfill、`toPrecision`/`toExponential`、`pow`（均留 v2）。

## Verification

关键验证点：
1. `(1.005).toFixed(2)` → `"1.01"`（不再有浮点 bug）
2. `0.1 + 0.2 = 0.3`（字符串输入）
3. 与 big.js 交叉验证 toFixed 输出
4. `tsup build` 成功输出 ESM 产物
