import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ReactNode } from "react";

type NavigationLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export const NavigationLink = ({ href, children, className }: NavigationLinkProps) => {
  return (
    <a href={href} className={"text-white md:hover:scale-110 transition-transform duration-200" + (className ? ` ${className}` : "")}>
      {children}
    </a>
  );
};