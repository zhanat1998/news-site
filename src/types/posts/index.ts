// types/index.ts

export interface Post {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  section?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  mainImage?: {
    asset: any;
    alt?: string;
    caption?: string;
  };
  author?: {
    name: string;
    image?: any;
  };
  category?: {
    title: string;
    slug?: {
      current: string;
    };
  };
  body?: any[];
  summary?: string[];
}

export interface Posts {
  items: Post[];
}
export interface ItemProps {
  item: Post;
}
