import { Direction, Pair, type CalcFormSchema, type Position } from "./schema";

/**
 * Calculates the total value of the given positions of the pair at the closing
 * point.
 */
export function calculateTotalValue({
  pair,
  close,
  positions,
}: CalcFormSchema): number {
  function calculateSingleValue(position: Position): number {
    const spreadLot = (() => {
      switch (pair) {
        case Pair.AUDCADc:
          return 0.73 * position.lot;
        default:
          return position.lot;
      }
    })();

    const directionValue = (() => {
      if (
        (position.direction === Direction.Buy && close < position.open) ||
        (position.direction === Direction.Sell && close > position.open)
      ) {
        return -1;
      }

      return 1;
    })();

    return Math.abs(position.open - close) * spreadLot * directionValue;
  }

  return positions
    .map((position) => calculateSingleValue(position))
    .reduce((prev, curr) => prev + curr, 0);
}
