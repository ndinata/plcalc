import { CalculatorForm } from "@/components/calculator-form";
import { Footer } from "@/components/footer";

export default function App() {
  return (
    <section className="container flex max-w-xl flex-1 flex-col items-stretch py-8">
      <h1 className="mb-8 text-center text-2xl font-medium">P/L Calculator</h1>

      <CalculatorForm />
      <Footer />
    </section>
  );
}
