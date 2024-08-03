import { z } from "zod";

/** Trade directions. */
export enum Direction {
  Buy = "buy",
  Sell = "sell",
}

// NOTE: if you add more Pairs, add its corresponding spread percentage for value
// calculation at `./lib.ts`.
/** Tradeable Pairs. */
export enum Pair {
  AUDCADc = "audcadc",
  EURUSDc = "eurusdc",
}

// This automatically generates label-value pairs for the `Pair` enum. No need
// to do anything extra here when adding/removing pairs.
/** Label-value pairs of tradeable Pairs. */
export const PairItems = Object.entries(Pair).map(([k, v]) => ({
  label: k,
  value: v,
}));

/** Schema for a position. */
export const PositionSchema = z.object({
  direction: z.nativeEnum(Direction),
  lot: z.coerce.number().positive(),
  open: z.coerce.number().int().positive(),
});

/** Schema for the main calculator form. */
export const CalcForm = {
  Schema: z.object({
    pair: z.nativeEnum(Pair, { invalid_type_error: "Invalid pair." }),
    close: z.coerce
      .number({ invalid_type_error: "Invalid number." })
      .int()
      .positive(),
    positions: z.array(PositionSchema),
  }),
  DefaultValues: {
    pair: Pair.AUDCADc,
    close: 0,
    positions: [],
  },
};

export type Position = z.infer<typeof PositionSchema>;
export type CalcFormSchema = z.infer<(typeof CalcForm)["Schema"]>;
