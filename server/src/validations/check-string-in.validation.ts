export const checkStringIn = (value: string, arr: string[]): string => {
  if (arr.includes(value)) {
    return value;
  } else {
    throw new Error();
  }
};
