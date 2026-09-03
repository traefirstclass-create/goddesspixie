export type SocialLink = {
  label: string;
  href: string;
  emoji: string;
};

// TODO: swap in the real destination URLs — placeholders marked below are
// guesses at the platform only, not verified handles/links.
export const links: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/pixie.life.777/", emoji: "📸" },
  { label: "OnlyFans", href: "https://onlyfans.com/TODO-handle", emoji: "🔥" },
  { label: "Twitter / X", href: "https://twitter.com/TODO-handle", emoji: "🐦" },
  { label: "All Things Worn", href: "https://www.allthingsworn.com/profile/TODO-handle", emoji: "👙" },
  { label: "WishTender", href: "https://wishtender.com/TODO-handle", emoji: "🎁" },
  { label: "Throne", href: "https://throne.com/TODO-handle", emoji: "👑" },
];

export const cashAppHandle = process.env.NEXT_PUBLIC_CASHAPP_HANDLE || "$pixieinthehoops7";
