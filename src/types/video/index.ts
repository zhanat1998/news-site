export interface Video {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: any;
  bunnyVideoId?: string;
  duration?: string;
  category?: { title: string };
}