export type SocialLink = {
  label: string;
  href: string;
  emoji: string;
};

export const links: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/pixie.life.777/", emoji: "📸" },
  { label: "OnlyFans", href: "https://onlyfans.com/goddess_pixie", emoji: "🔥" },
  { label: "Twitter / X", href: "https://x.com/pixie_spoiled?s=21", emoji: "🐦" },
  { label: "Cammodels", href: "https://goddesspixiexoxo.cammodels.com/", emoji: "🎥" },
  { label: "Throne", href: "https://throne.com/goddesspixie777", emoji: "👑" },
  { label: "Amazon Wishlist", href: "https://www.amazon.com/hz/wishlist/ls/8YBAIIJXGAV4?ref_=wl_share", emoji: "🎁" },
  { label: "Venmo", href: "https://venmo.com/u/pixieinthehoops7", emoji: "💵" },
  {
    label: "Lulexy — Leather BDSM Accessories",
    href: "https://lulexy.com/?sca_ref=11155866.o6Q6A18GYEc2apu",
    emoji: "🖤",
  },
  // TODO: add Pornhub once that link is ready.
];

export const cashAppHandle = process.env.NEXT_PUBLIC_CASHAPP_HANDLE || "$pixieinthehoops7";
