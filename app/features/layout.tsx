import SideNavigation from "@/components/app-sidebar";
import { getUser } from "@/lib/data-service";
import { redirect } from "next/navigation";

import { type ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <div className="grid h-[82vh] grid-cols-[4rem_1fr] justify-center pl-2 sm:pl-4 md:grid-cols-[16rem_1fr] lg:ml-auto lg:w-[90svw] lg:pl-0">
        <SideNavigation user={user} />
        <main className="overflow-y-auto p-5 sm:p-8 ">{children}</main>
      </div>
    </>
  );
}
