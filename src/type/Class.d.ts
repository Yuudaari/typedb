type Class<T> = new (...args: any[]) => T;
type NullaryClass<T> = new () => T;
type AnyConstructor = new (...args: any[]) => any;
type Constructor<A extends any[], I> = new (...args: A) => I;