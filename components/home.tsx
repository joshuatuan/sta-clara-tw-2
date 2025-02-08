import Link from "next/link";
import { Button } from "./ui/button";

export default function GetStartedPage() {
  return (
    <div className="min-h-[80svh] flex flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Get Started</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Create an account or sign in to continue.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild size="lg" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="lg" variant="default">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
