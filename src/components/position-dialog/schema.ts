import { z } from "zod";

export enum Direction {
  Buy = "buy",
  Sell = "sell",
}

export const PositionFormSchema = z.object({
  direction: z.nativeEnum(Direction),
  lot: z.coerce.number().positive(),
  open: z.coerce.number().int().positive(),
});

export type Position = z.infer<typeof PositionFormSchema>;
