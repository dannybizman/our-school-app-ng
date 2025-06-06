import { Class } from "./class";

export interface Announcement {
  _id: string;
  title: string;
  school?: string;
  description: string;
  startTime: string;
  endTime: string;
  classes?: Class[];
}
 