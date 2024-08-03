import { zodResolver } from "@hookform/resolvers/zod";
import { MoveDownRightIcon, MoveUpRightIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Direction, PositionSchema, type Position } from "./schema";

type Props = {
  onAdd: (position: Position) => void | Promise<void>;
  Trigger: React.JSX.Element;
};

export function PositionDialog({ onAdd: _onAdd, Trigger }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<Position>({
    resolver: zodResolver(PositionSchema),
    defaultValues: {},
  });

  const resetForm = useCallback(() => {
    form.reset({
      // https://github.com/orgs/react-hook-form/discussions/7589
      direction: null as unknown as undefined,
      lot: undefined,
      open: undefined,
    });
  }, [form]);

  const onAdd = useCallback(
    (position: Position) => {
      resetForm();
      _onAdd(position);
      setDialogOpen(false);
    },
    [_onAdd, resetForm],
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              // Since this form is nested inside another one, this is to prevent
              // the parent form getting its submit callback triggered also.
              // https://github.com/react-hook-form/react-hook-form/issues/1005#issuecomment-1012188940
              e.stopPropagation();
              return form.handleSubmit(onAdd)(e);
            }}
          >
            <DialogHeader className="items-start">
              <DialogTitle>Add a position</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-8 py-8">
              <div className="flex gap-6">
                <FormField
                  name="direction"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direction</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Buy/Sell" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Direction.Buy}>
                            <span className="flex items-center text-blue-600">
                              Buy <MoveUpRightIcon size={18} className="ml-1" />
                            </span>
                          </SelectItem>
                          <SelectItem value={Direction.Sell}>
                            <span className="flex items-center text-red-500">
                              Sell{" "}
                              <MoveDownRightIcon size={18} className="ml-1" />
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lot"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2.50"
                          type="number"
                          step=".01"
                          className="w-36"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="open"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open at (without decimal)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 90800"
                        type="number"
                        className="w-44"
                        {...field}
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
            <DialogFooter className="mt-4 flex flex-row gap-4">
              <Button type="reset" variant="destructive" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" className="flex-1">
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
