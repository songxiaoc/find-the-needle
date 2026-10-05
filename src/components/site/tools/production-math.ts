export type ProductionInputs = {
  rates: string[];
  stock: string;
  price: string;
  investment: string;
  operating: string;
};
export type ProductionResult = {
  capacity: number;
  bottlenecks: number[];
  duration: number | null;
  revenue: number;
  profit: number | null;
  margin: number;
  payback: number | null;
  stock: number;
};
export function parseMeasurement(raw: string): number | null {
  const value = raw.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}
export function calculateProduction(
  input: ProductionInputs
):
  | { result: ProductionResult; error?: never }
  | { error: 'invalid' | 'overflow'; result?: never } {
  const rates = input.rates.map(parseMeasurement);
  const values = [
    input.stock,
    input.price,
    input.investment,
    input.operating,
  ].map(parseMeasurement);
  if (
    rates.length === 0 ||
    rates.some((value) => value === null) ||
    values.some((value) => value === null)
  )
    return { error: 'invalid' };
  const [stock, price, investment, operating] = values as number[];
  const capacity = Math.min(...(rates as number[]));
  const duration = stock === 0 ? 0 : capacity === 0 ? null : stock / capacity;
  const revenue = duration === null ? 0 : stock * price;
  const margin = capacity * price - operating;
  const profit =
    duration === null ? null : revenue - duration * operating - investment;
  const payback = capacity === 0 || margin <= 0 ? null : investment / margin;
  const computed = [
    capacity,
    duration,
    revenue,
    margin,
    profit,
    payback,
  ].filter((value): value is number => value !== null);
  if (computed.some((value) => !Number.isFinite(value)))
    return { error: 'overflow' };
  return {
    result: {
      capacity,
      bottlenecks: rates.flatMap((rate, index) =>
        rate === capacity ? [index + 1] : []
      ),
      duration,
      revenue,
      margin,
      profit,
      payback,
      stock,
    },
  };
}
