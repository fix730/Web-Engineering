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
    <a href={href} className={"text-gray-600 hover:text-blue-600" + (className ? ` ${className}` : "")}>
      {children}
    </a>
  );
};