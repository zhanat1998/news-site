export interface Video {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: any;
  duration?: string;
  category?: { title: string };
}