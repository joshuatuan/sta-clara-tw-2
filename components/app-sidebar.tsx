"use client";

import Link from "next/link";
import {
  Cat,
  Home,
  Image,
  LogOut,
  NotebookPen,
  SquareCheck,
  UserRound,
  Utensils,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { signOutAction } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";

// Menu items.
const navLinks = [
  {
    title: "Home",
    url: "/features/dashboard",
    icon: <Home />,
  },
  {
    title: "Todo list",
    url: "/features/to-do-list",
    icon: <SquareCheck />,
  },
  {
    title: "G Drive",
    url: "/features/g-drive-lite",
    icon: <Image />,
  },
  {
    title: "Food Review",
    url: "/features/food-review",
    icon: <Utensils />,
  },
  {
    title: "Pokemon Review",
    url: "/features/pokemon-review",
    icon: <Cat />,
  },
  {
    title: "Notes",
    url: "/features/notes",
    icon: <NotebookPen />,
  },
];

export default function SideNavigation({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <nav className="border-r">
      <ul className="flex h-full flex-col gap-1.5 pb-10 pt-10">
        {navLinks.map((link) => (
          <li key={link.title}>
            <Link
              className={`hover:bg-primary-900 hover:text-primary-100 mr-2 flex items-center justify-center gap-3 rounded-md px-1 py-3 text-sm text-muted-foreground md:mr-4 md:justify-start md:gap-4 md:px-5 md:py-3 ${
                pathname === link.url
                  ? "bg-accent font-semibold text-primary"
                  : "hover:!bg-accent/70"
              }`}
              href={link.url}
            >
              {link.icon}
              <span className="hidden md:inline-block">{link.title}</span>
            </Link>
          </li>
        ))}
        <li className="mr-2 mt-auto p-2">
          <div className="flex flex-col gap-2">
            <div className="ml-1 flex items-center gap-1">
              <UserRound className="hidden md:inline-block" size={18} />
              <p className="hidden text-sm md:inline-block">{user.email}</p>
            </div>
            <form
              action={signOutAction}
              className="flex justify-center md:block"
            >
              <Button
                type="submit"
                className="text-xs md:w-full md:text-sm"
                variant={"outline"}
              >
                <p className="hidden md:block"> Sign out</p>
                <LogOut className="block md:hidden" size={18} />
              </Button>
            </form>
          </div>
        </li>
      </ul>
    </nav>
  );
}
