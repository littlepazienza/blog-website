/*
 * Object definition for a single blog entry.
 */
export interface Blog {
  date: string;
  /** MongoDB document identifier */
  _id: string;
  story: string;
  title: string;
  text: string;
  files: string[];
}
