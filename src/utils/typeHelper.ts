type ObjectOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export { ObjectOmit };