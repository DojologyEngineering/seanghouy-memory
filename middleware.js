import { NextResponse } from "next/server";

// Link-preview crawlers (Telegram, Messenger, WhatsApp, X, Slack, Discord, LINE, Viber, ...).
// Give them nothing, so a pasted link shows no title, text or image.
const PREVIEW_BOTS =
  /TelegramBot|facebookexternalhit|Facebot|meta-externalagent|WhatsApp\/[0-9.]+ [AWi]|Twitterbot|Slackbot|Discordbot|LinkedInBot|Pinterestbot|SkypeUriPreview|line-poker|kakaotalk-scrap|Zalo-?bot|redditbot|Embedly|iframely|vkShare|bitlybot|Mastodon\/|Bluesky Cardyb|Applebot|Google-PageRenderer/i;

export function middleware(req) {
  const ua = req.headers.get("user-agent") || "";
  if (PREVIEW_BOTS.test(ua)) {
    return new NextResponse(null, { status: 204, headers: { "x-robots-tag": "noindex, nofollow, nosnippet, noimageindex" } });
  }
  const res = NextResponse.next();
  res.headers.set("x-robots-tag", "noindex, nofollow, nosnippet, noimageindex");
  return res;
}

export const config = { matcher: ["/((?!_next/|api/|lament.mp3).*)"] };
