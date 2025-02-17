"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";


export const NavBreadCrumb = () => {
  const pathname = usePathname();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" /> */}
        <BreadcrumbItem>
          <BreadcrumbPage>{}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
