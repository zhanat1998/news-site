import {ReactNode} from "react";

export type News = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  mainImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
  isFeatured: boolean;
};

export type Video = {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  videoUrl: string;
  youtubeUrl?: string;
  duration: string;
  description: string;
  category: Category;
  publishedAt: string;
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
};

export type Author = {
  _id: string;
  name: string;
  image: string;
  bio?: string;
};

export interface MainContainerProps {
  children: ReactNode;
}
