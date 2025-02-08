import { deleteAccountAction, signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/data-service";
import AlertButton from "@/components/alertButton";
import { redirect } from "next/navigation";

export default async function DashBoardPage() {
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="mx-auto flex flex-col gap-10">
      <div>
        <h1 className="mb-6 text-2xl font-semibold">
          Logged in as <span className="font-bold">{user.email}</span>
        </h1>
        <p className="mb-2 text-sm text-muted-foreground">Account details</p>
        <pre className="max-h-64 max-w-96 justify-center overflow-auto rounded border p-3 font-mono text-xs md:max-w-xl">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="flex gap-4">
        <AlertButton>
          <form action={deleteAccountAction}>
            <Button type="submit">Delete Account</Button>
          </form>
        </AlertButton>
        <form action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
