import { CalculatorForm } from "@/components/calculator-form";

export default function App() {
  return (
    <section className="container flex flex-1 flex-col py-8">
      <h1 className="mb-8 text-center text-2xl font-medium">P/L Calculator</h1>

      <CalculatorForm />
    </section>
  );
}
