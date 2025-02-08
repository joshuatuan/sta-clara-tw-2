"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// This is our navigation items array. You can modify this based on your needs.
const navItems = [
  { name: "Home", href: "/" },
  { name: "Page 2", href: "/secret-page-2" },
  { name: "Page 3", href: "/secret-page-3" },
];

export default function NavMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ mobile }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`${
            pathname === item.href
              ? "text-primary font-semibold"
              : "text-muted-foreground"
          } ${mobile ? "py-2 text-base" : ""}`}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="flex items-center justify-between bg-slate-50 px-8 py-5">
      <Link href="/" className="cursor-pointer text-xl font-semibold">
        Admin
      </Link>
      <div className="hidden space-x-8 text-lg md:flex">
        <NavItems />
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="lg">
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="mt-4 flex flex-col space-y-2">
            <NavItems mobile />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
