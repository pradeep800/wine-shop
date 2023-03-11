import AuthCheck from "@/components/authCheck";
import ListCreditCard from "@/components/listCreditCard";

export default function Profile() {
  return (
    <AuthCheck>
      <ListCreditCard />
    </AuthCheck>
  );
}
