export type PortableSpan = {
  _key: string;
  _type: 'span';
  text: string;
  marks?: string[];
};

export type PortableTextBlock = {
  _key: string;
  _type: 'block';
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote';
  listItem?: 'bullet' | 'number';
  level?: number;
  markDefs?: { _key: string; _type: string; href?: string }[];
  children: PortableSpan[];
};

export type FigureBlock = {
  _key: string;
  _type: 'figure';
  url?: string;
  alt?: string;
  caption?: string;
  layout?: 'content' | 'wide' | 'full';
};

export type GalleryBlock = {
  _key: string;
  _type: 'gallery';
  images: { url?: string; alt?: string; caption?: string }[];
};

export type VideoBlock = {
  _key: string;
  _type: 'video';
  url: string;
  caption?: string;
};

export type CardsBlock = {
  _key: string;
  _type: 'cards';
  heading?: string;
  items: ProjectCardData[];
};

export type BodyBlock = PortableTextBlock | FigureBlock | GalleryBlock | VideoBlock | CardsBlock;

export type ProjectCardData = {
  slug: string;
  path: string;
  title: string;
  client: string;
  agency?: string;
  year?: string;
  coverUrl?: string;
  cardColor?: string;
};

export type Project = ProjectCardData & {
  parentSlug?: string;
  categories: string[];
  lede?: string;
  body: BodyBlock[];
};

export type LabelItem = { label: string; detail?: string };

export type Settings = {
  siteTitle: string;
  description: string;
  firstName: string;
  lastName: string;
  role: string;
  heroIntro: string;
  beginLead: string;
  beginQuestion: string;
  aboutIntro: string;
  portraitUrl?: string;
  sections: { title: string; items: LabelItem[] }[];
  clientGroups: { category: string; logos: { url: string; name?: string }[] }[];
  awardGroups: { title: string; awards: { name: string; result: string }[] }[];
  email: string;
  socials: { label: string; url: string }[];
};
