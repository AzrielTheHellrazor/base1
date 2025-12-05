const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "noFlake",
    subtitle: "No flakes, just stakes",
    description: "noFlake - Where commitment meets crypto. Say goodbye to last-minute cancellations and hello to reliable meetups!",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["farcaster", "base", "blockchain", "events", "staking"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "No flakes, just stakes. Show up and get paid!",
    ogTitle: "noFlake - No Flakes, Just Stakes",
    ogDescription: "Where commitment meets crypto. Say goodbye to last-minute cancellations!",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
