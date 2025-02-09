import { deleteAccountAction, signOutAction } from "@/lib/actions/auth";
import AlertButton from "../alertButton";
import { Button } from "../ui/button";
import { type UserData } from "@/app/types/globals";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function Dashboard({ user }: { user: UserData }) {
  return (
    <div className="mx-auto flex flex-col gap-10">
      <div className="space-y-1">
        <h1 className="mb-8 text-3xl font-bold">{getGreeting()} 👋</h1>
        <h1 className="mb-6 text-lg">
          Logged in as <span className="font-medium">{user.email}</span>
        </h1>
        {/* <p className="mb-2 text-sm text-muted-foreground">Account details</p> */}
        <p className="text-lg">
          Date joined:{" "}
          <span className="font-medium">
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        <AlertButton>
          <form data-testid="form-delete-account" action={deleteAccountAction}>
            <Button type="submit">Delete Account</Button>
          </form>
        </AlertButton>
        <form data-testid="form-sign-out" action={signOutAction}>
          <Button type="submit" variant={"outline"}>
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}
