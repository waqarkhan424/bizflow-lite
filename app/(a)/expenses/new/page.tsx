import { requireBusiness } from "@/lib/require-business";
import ExpenseForm from "../components/expense-form";

export default async function NewExpensePage() {
  await requireBusiness(); // protect
  return <ExpenseForm />;
}
