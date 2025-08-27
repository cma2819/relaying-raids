type Meta = { title: string } | { name: 'description'; content: string };

export const appMeta = (title: string, description: string): Meta[] => [
  { title: `${title} / Twitch Relaying Raids` },
  { name: 'description', content: description },
];
