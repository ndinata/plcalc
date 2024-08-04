import { zodResolver } from "@hookform/resolvers/zod";
import { MoveUpRightIcon, MoveDownRightIcon, Trash2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { calculateTotalValue } from "./lib";
import { PositionDialog } from "./position-dialog";
import {
  CalcForm,
  PairItems,
  type CalcFormSchema,
  type Position,
} from "./schema";

export function CalculatorForm() {
  const [totalValue, setTotalValue] = useState<number | undefined>(undefined);

  const form = useForm<CalcFormSchema>({
    resolver: zodResolver(CalcForm.Schema),
    defaultValues: CalcForm.DefaultValues,
  });

  const {
    fields: positions,
    append,
    remove,
  } = useFieldArray({
    name: "positions",
    control: form.control,
  });

  const addPosition = useCallback(
    (position: Position) => {
      append(position);
      setTotalValue(undefined);
    },
    [append],
  );

  const removePosition = useCallback(
    (index: number) => {
      remove(index);
      setTotalValue(undefined);
    },
    [remove],
  );

  const resetForm = useCallback(() => {
    form.reset();
    setTotalValue(undefined);
  }, [form]);

  const calculateValue = useCallback((values: CalcFormSchema) => {
    setTotalValue(calculateTotalValue(values));
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(calculateValue)}
          className="flex flex-1 flex-col gap-8"
        >
          <div className="flex items-start gap-4">
            <FormField
              name="pair"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Pair</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select pair." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PairItems.map((pairItem) => (
                        <SelectItem key={pairItem.value} value={pairItem.value}>
                          {pairItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="close"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormLabel>Close at (without decimal)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 90800"
                      type="number"
                      className="w-full"
                      {...field}
                      //   onBlur={() => form.trigger()}
                    />
                  </FormControl>
                  <FormDescription>
                    E.g. to open at <code>0.90400</code>, insert{" "}
                    <code>90400</code>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Positions section. */}
          <div className="flex flex-1 flex-col">
            {positions.length ? (
              positions.map((position, i) => (
                <PositionItem
                  key={position.id}
                  {...position}
                  onRemove={() => removePosition(i)}
                />
              ))
            ) : (
              <p className="py-4 text-center text-lg font-medium text-muted-foreground">
                No open positions.
              </p>
            )}
          </div>

          {/* Total value section. */}
          <div>
            <p className="mb-1 text-center text-lg font-medium">
              Total value:{" "}
              <span className="ml-2 text-xl">
                {totalValue?.toFixed(2) ?? (0).toFixed(2)}{" "}
              </span>
            </p>
            <p className="text-center text-muted-foreground">
              ({positions.length} position
              {positions.length === 1 ? "" : "s"})
            </p>
          </div>

          {/* CTAs section. */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <ResetDialog
                onConfirmReset={resetForm}
                Trigger={
                  <Button type="button" variant="destructive">
                    Reset
                  </Button>
                }
              />
              <PositionDialog
                onAdd={addPosition}
                Trigger={
                  <Button type="button" variant="outline" className="flex-1">
                    Add position
                  </Button>
                }
              />
            </div>
            <Button type="submit" disabled={!positions.length}>
              Calculate total value
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

type Props = Position & {
  onRemove: () => void;
};

function PositionItem({ direction, lot, open, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between border-b-[1px] py-4 first:border-t-[1px]">
      {direction === "buy" ? (
        <span className="flex items-center text-blue-600">
          Buy <MoveUpRightIcon size={18} className="ml-0.5" />
        </span>
      ) : (
        <span className="flex items-center text-red-500">
          Sell <MoveDownRightIcon size={18} className="ml-0.5" />
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        <label className="text-sm font-medium text-muted-foreground">Lot</label>
        <span>{lot}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-sm font-medium text-muted-foreground">
          Open at
        </label>
        <span>{open}</span>
      </div>
      <RemovePositionDialog
        direction={direction}
        lot={lot}
        open={open}
        onConfirmRemove={onRemove}
        Trigger={
          <Button variant="ghost" size="icon">
            <Trash2Icon className="h-5 w-5 text-destructive" />
          </Button>
        }
      />
    </div>
  );
}

type RemovePositionDialogProps = Position & {
  onConfirmRemove: () => void;
  Trigger: React.JSX.Element;
};

function RemovePositionDialog({
  direction,
  lot,
  open,
  onConfirmRemove,
  Trigger,
}: RemovePositionDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{Trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-1">
              <span>This will remove this position:</span>
              <span>
                {`${direction[0].toUpperCase()}${direction.slice(1)}`}{" "}
                {lot.toFixed(2)} lot at {open}.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmRemove}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type ResetDialogProps = {
  onConfirmReset: () => void;
  Trigger: React.JSX.Element;
};

function ResetDialog({ onConfirmReset, Trigger }: ResetDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{Trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all fields and remove all opened positions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmReset}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
