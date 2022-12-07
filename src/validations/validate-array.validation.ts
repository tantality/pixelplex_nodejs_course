const checkArrayForDuplicates = <T>(arr: Array<T>): Array<T> => {
  const set = new Set<T>(arr);
  const isArrayContainDuplicates = set.size !== arr.length;
  if (isArrayContainDuplicates) {
    throw new Error('Array must contain unique elements');
  }
  return arr;
};

export const validateArray = (arr: Array<any>, isArrayOf: (arg: Array<any>) => boolean): Array<any> => {
  if (arr.length > 1 && isArrayOf(arr)) {
    checkArrayForDuplicates(arr as Array<typeof arr[0]>);
  }
  return arr;
};
