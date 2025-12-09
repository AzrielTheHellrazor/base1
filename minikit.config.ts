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
    subtitle: "Turn casual maybes into real commitments",
    description: "noFlake lets you host free events or stake-backed \"no-flake\" events on Base. Share a simple link, collect the info you need from guests, and turn casual maybes into real commitments.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["farcaster", "base", "blockchain", "events", "staking"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Turn casual maybes into real commitments",
    ogTitle: "noFlake - Stake-Backed Events on Base",
    ogDescription: "noFlake lets you host free events or stake-backed \"no-flake\" events on Base. Share a simple link, collect the info you need from guests, and turn casual maybes into real commitments.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
