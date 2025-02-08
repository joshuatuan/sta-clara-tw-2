"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const links = [
  { href: "/", label: "Home" },
  { href: "/secret-page-2", label: "Secret Message" },
  { href: "/secret-page-3", label: "Friends" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {links.map((link, index) => (
          <BreadcrumbItem key={link.href}>
            {pathname === link.href ? (
              <BreadcrumbPage className="font-medium">
                {link.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={link.href}>{link.label}</Link>
              </BreadcrumbLink>
            )}
            {index < links.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
