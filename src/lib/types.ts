export type Block =
  | { _key: string; _type: 'textBlock'; text: string }
  | { _key: string; _type: 'imageBlock'; url: string; alt?: string; fullWidth?: boolean }
  | { _key: string; _type: 'videoBlock'; url: string; background?: boolean };

export type Project = {
  slug: string;
  title: string;
  client: string;
  agency?: string;
  year?: string;
  coverUrl?: string;
  cardColor?: string;
  categories: string[];
  blocks: Block[];
  stats: { value: string; label: string }[];
  closing?: string;
  crew: { role: string; names: string[] }[];
};

export type LabelItem = { label: string; detail?: string };

export type Settings = {
  siteTitle: string;
  description: string;
  firstName: string;
  lastName: string;
  role: string;
  heroIntro: string;
  aboutIntro: string;
  portraitUrl?: string;
  sections: { title: string; items: LabelItem[] }[];
  clientGroups: { category: string; logos: { url: string; name?: string }[] }[];
  awardGroups: { title: string; awards: { name: string; result: string }[] }[];
  email: string;
  socials: { label: string; url: string }[];
};
