import AddAndListCards from "@/components/addAndListCards";
import AuthCheck from "@/components/authCheck";

export default function Profile() {
  /*
   * Checking Auth and Then Listening all Cards
   */
  return (
    <AuthCheck>
      <AddAndListCards />
    </AuthCheck>
  );
}
