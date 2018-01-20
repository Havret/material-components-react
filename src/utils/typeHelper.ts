type StringOmit<L1 extends string, L2 extends string> = ({ [P in L1]: P } &
    { [P in L2]: never } & { [key: string]: never })[L1];

type ObjectOmit<O, K extends string> = Pick<O, StringOmit<keyof O, K>>;

export { ObjectOmit };