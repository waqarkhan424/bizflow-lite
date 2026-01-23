import { requireBusiness } from "@/lib/require-business";
import CustomerForm from "../components/customer-form";

export default async function NewCustomerPage() {
  await requireBusiness(); // protect this route
  return <CustomerForm />;
}
