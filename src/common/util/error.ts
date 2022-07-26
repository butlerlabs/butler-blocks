// This error will
// - fail in compilation if the val does not satisfy never type
// - throw in production if it truly gets an unexpected value
//
// Usage: default throw in switch statements involving enums.
// The example below will fail to compile if you remove the
// cases for Foo or Bar.
//
// enum EnumType {
//   Foo = 'FOO',
//   Bar = 'BAR',
// }
// switch (enumVal) {
//   case EnumType.Foo:
//     doSomething();
//   case EnumType.Bar:
//     doSomething();
//   default:
//     throw new TypesafeUnreachableError(enumVal);
// }
export class TypesafeUnreachableError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}
