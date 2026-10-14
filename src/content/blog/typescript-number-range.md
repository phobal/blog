---
title: "TS 类型体操 - NumberRange"
description: "使用 TypeScript 类型系统实现 NumberRange 的过程与思路。"
pubDate: "2022-11-23"
tags: ["TypeScript"]
originalUrl: "https://github.com/phobal/blog/issues/4"
---

### 需求

最近业务开发过程遇到一个类型定义问题，一周七天 `WeekType = 1 | 2 | 2 | 4 | 5 | 6 | 7`，这个比较简单，只有 7 个可以枚举出来，月 MonthType 也还能接受，最多 1 - 31 嘛，可是年 YearType 呢，总不能从 1 写到 365 吧，所以需要一个类型来定义这种类型

### 期望

```tsx
type NumberRange<S. E> = any

type WeekType = NumberRange<1, 7> //  1 | 2 | 2 | 4 | 5 | 6 | 7
```

### 实现

按照 js 的思考逻辑，给定开始值 start, 和结束值 end, 想要生成 start 到 end 的连续整数值，只需要不停的 start + 1，直到 start + 1 的结果等于 end 为止， 那么在 TS 中怎么来实现加 1 的方法呢？

```tsx
type NumberAdditionOne<N> = any
```

TS 作为 JS 的类型语言，本身是不具备数值计算的，想要模拟加法的话必须使用一些奇技淫巧，在 TS 中有一种数据类型元祖 Tuple, 类似于 js 中数组，它同样拥有 length 属性；

```tsx
type Tuple = [1, 2, 3, 4]['length']  // 输出： 4
```

我们可以借助它来实现加 1 的方法，给定数字 N，那我们可以先将 N 转成有 N 个 1 组成的元祖，加 1 的话再在这个元祖中添加一个 1，这时候它的长度 length 就是我们需要的结果了，见代码：

```tsx
type NumberToArray<T, A extends unknown[] = []> = A['length'] extends T
  ? A
  : NumberToArray<T, [...A, 1]>;
type NumberAdditionOne<N> = [...NumberToArray<N>, 1]['length']
```

加 1 的方法实现了，接下来就要判断每次加 1 后的结果和 end 做比较，

- 如何判断 2 个值是否相等

```tsx
type isEqual<T, S> = T extends S ? true : false;
```

- 如何将元祖转成枚举

```tsx
type TupleToEnum<T extends unknown[]> = T[number]
```

另外我们需要将加 1 的结果存储起来，我们把它作为 NumberRange 的第三个参数 Total, 并且给他设置一个默认值，这样使用的使用可以不传这个参数

```tsx
type NumberRange<S extends number, E extends number, Total extends any[] = []> = S extends E
  ? [...Total, S][number]
  : NumberRange<NumberAdditionOne<S>, E, [...Total, S]>;
```

下面是整个代码

```tsx
type NumberToArray<T, A extends unknown[] = []> = A['length'] extends T
  ? A
  : NumberToArray<T, [...A, 1]>;

type NumberAdditionOne<N> = [...NumberToArray<N>, 1]['length'];

type NumberRange<S extends number, E extends number, Total extends any[] = []> = S extends E
  ? [...Total, S][number]
  : NumberRange<NumberAdditionOne<S>, E, [...Total, S]>;
```

测试

```tsx
type WeekType = NumberRange<1, 7>; // 1 | 2 | 3 | 4 | 5 | 6 | 7
type MonthType = NumberRange<1, 31>; // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11......
```

### 总结

- TS 不太适合这种数值计算，通常情况下直接给日期类型定义为 number 就好了
- 上面的实现方法使用到了递归，TS 对递归的层级做了限制，超过一定大小后就会出现 `Type instantiation is excessively deep and possibly infinite`

参考：[https://github.com/type-challenges/type-challenges/blob/main/questions/08640-medium-number-range/README.md](https://github.com/type-challenges/type-challenges/blob/main/questions/08640-medium-number-range/README.md)
