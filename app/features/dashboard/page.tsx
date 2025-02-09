import { getUser } from "@/lib/data-service";
import { redirect } from "next/navigation";
import Dashboard from "@/components/features/Dashboard";

export default async function DashBoardPage() {
  const userData = await getUser();

  if (!userData) {
    return redirect("/");
  }

  const user = {
    email: userData.email,
    id: userData.id,
    created_at: userData.created_at,
  };

  return (
    <>
      <Dashboard user={user} />
    </>
  );
}
