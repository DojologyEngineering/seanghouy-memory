import { NextResponse } from "next/server";

// Link-preview crawlers (Telegram, Messenger, WhatsApp, X, Slack, Discord, LINE, Viber, ...).
// Give them nothing, so a pasted link shows no title, text or image.
const PREVIEW_BOTS =
  /TelegramBot|facebookexternalhit|Facebot|meta-externalagent|WhatsApp|Twitterbot|Slackbot|Discordbot|LinkedInBot|Pinterest|SkypeUriPreview|Teams|Viber|Line\/|LineBot|Zalo|KakaoTalk|Snapchat|redditbot|Embedly|iframely|vkShare|Applebot|Google-PageRenderer|bitlybot|Mastodon|Bluesky/i;

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
