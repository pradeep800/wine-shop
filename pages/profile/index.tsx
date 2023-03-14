import AuthCheck from "@/components/authCheck";
import ListCreditCard from "@/components/listCreditCard";

export default function Profile() {
  /*
   * Checking Auth and Then Listening all Cards
   */
  return (
    <AuthCheck>
      <ListCreditCard />
    </AuthCheck>
  );
}
