import { Class } from "./class";

export interface Announcement {
  _id: string;
  title: string;
  description: string;
  date: string;
  classes?: Class[];
}
