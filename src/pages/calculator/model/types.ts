export interface CalculatorOption {
  readonly n: string;
  readonly p: number;
  readonly d?: string;
}

export interface CalculatorGroup {
  readonly t: string;
  readonly opts: readonly CalculatorOption[];
}
