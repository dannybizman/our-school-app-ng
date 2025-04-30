import { UserRole } from "@/constants/roles";

export type MenuItem = {
  icon: string;
  label: string;
  href: string;
  visible: UserRole[];
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};
