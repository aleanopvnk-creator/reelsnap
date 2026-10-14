/**
 * ReelSnap - Instagram Extraction Engine
 * Multi-Layer Architecture:
 * 1. Meta Crawler SSR Scraper (Extracts direct HD video_versions via official crawler preview)
 * 2. Native GraphQL Scraper (doc_id: 8845758582119845)
 * 3. Native Embed Scraper
 * 4. RapidAPI Scraper Integration (Fallback if configured)
 */

export interface InstagramMediaData {
  success: true;
  shortcode: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  author: string;
  duration?: number;
  source: "native-crawler" | "native-graphql" | "native-embed" | "rapidapi";
}

export interface ExtractedShortcodeInfo {
  shortcode: string;
  cleanUrl: string;
  mediaType: "reel" | "p" | "tv";
}

/**
 * Validates and extracts shortcode from multiple Instagram URL variations
 */
export function validateAndExtractShortcode(rawUrl: string): ExtractedShortcodeInfo {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new Error("URL Instagram tidak boleh kosong.");
  }

  const trimmed = rawUrl.trim();

  // Pattern matches /reel/, /reels/, /p/, /tv/, /share/reel/
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv|share\/reel)\/([A-Za-z0-9_-]+)/i;
  const match = trimmed.match(regex);

  if (!match || !match[1]) {
    throw new Error(
      "Format link Instagram tidak valid. Pastikan link berupa URL Reels, Post, atau IGTV (contoh: https://www.instagram.com/reel/xyz123/)"
    );
  }

  const shortcode = match[1];

  let mediaType: "reel" | "p" | "tv" = "reel";
  if (trimmed.includes("/p/")) {
    mediaType = "p";
  } else if (trimmed.includes("/tv/")) {
    mediaType = "tv";
  }

  const cleanUrl = `https://www.instagram.com/${mediaType}/${shortcode}/`;

  return { shortcode, cleanUrl, mediaType };
}

/**
 * Helper to unescape JSON and HTML encoded URLs
 */
function cleanEscapedUrl(url: string): string {
  return url
    .replace(/\\u0026/g, "&")
    .replace(/\\u003d/g, "=")
    .replace(/\\u002f/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/\\/g, "")
    .trim();
}

/**
 * Layer 1: Meta Crawler SSR Engine
 * Instagram renders direct video_versions and full HD assets for crawler user-agents
 * (facebookexternalhit, WhatsApp, Twitterbot) without triggering client-side login barriers!
 */
async function extractViaCrawler(shortcode: string): Promise<InstagramMediaData | null> {
  const crawlerHeadersList = [
    {
      "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    {
      "User-Agent": "WhatsApp/2.21.12.21 A",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    {
      "User-Agent": "Twitterbot/1.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  ];

  const targetUrls = [
    `https://www.instagram.com/reel/${shortcode}/`,
    `https://www.instagram.com/p/${shortcode}/`,
  ];

  for (const headers of crawlerHeadersList) {
    for (const url of targetUrls) {
      try {
        const response = await fetch(url, {
          headers,
          redirect: "follow",
        });

        if (!response.ok) continue;

        const html = await response.text();

        // 1. Look for video_versions JSON array
        let videoUrl = "";
        const videoVersionsMatch = html.match(/"video_versions"\s*:\s*(\[[^\]]+\])/);
        if (videoVersionsMatch && videoVersionsMatch[1]) {
          try {
            const versions = JSON.parse(videoVersionsMatch[1]);
            if (Array.isArray(versions) && versions.length > 0) {
              // First version is the highest bitrate/quality
              videoUrl = cleanEscapedUrl(versions[0].url || versions[0].src || "");
            }
          } catch {
            // Fallback to regex extraction from the chunk
            const urlInVersions = videoVersionsMatch[1].match(/"url"\s*:\s*"([^"]+)"/);
            if (urlInVersions) {
              videoUrl = cleanEscapedUrl(urlInVersions[1]);
            }
          }
        }

        // 2. Fallback: Search for escaped .mp4 URLs in HTML
        if (!videoUrl) {
          const mp4Matches = [...html.matchAll(/(https?:\\\/\\\/[^"'\s<>]+\.mp4[^"'\s<>]*)/g)];
          if (mp4Matches.length > 0) {
            videoUrl = cleanEscapedUrl(mp4Matches[0][1]);
          }
        }

        // 3. Fallback: Check og:video meta tag
        if (!videoUrl) {
          const ogVideoMatch = html.match(/<meta property=["']og:video(?::secure_url)?["'] content=["']([^"']+)["']/i);
          if (ogVideoMatch && ogVideoMatch[1]) {
            videoUrl = cleanEscapedUrl(ogVideoMatch[1]);
          }
        }

        // Extract Thumbnail from og:image
        let thumbnailUrl = "";
        const ogImageMatch = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
        if (ogImageMatch && ogImageMatch[1]) {
          thumbnailUrl = cleanEscapedUrl(ogImageMatch[1]);
        }

        // Extract Title and Author
        let author = "Instagram Creator";
        let caption = "";

        const ogTitleMatch = html.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          const rawTitle = ogTitleMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&#x1f44c;/g, "👌")
            .replace(/&amp;/g, "&");

          // Usually "Author (@username) on Instagram: 'Caption'" or "AUTHOR on Instagram: 'Caption'"
          const authorParts = rawTitle.split(" on Instagram");
          if (authorParts.length > 0 && authorParts[0].trim()) {
            author = authorParts[0].trim();
          }

          const captionMatch = rawTitle.match(/:\s*["“]([\s\S]+?)["”]?$/);
          if (captionMatch && captionMatch[1]) {
            caption = captionMatch[1].trim();
          }
        }

        const ogDescMatch = html.match(/<meta property=["']og:description["'] content=["']([^"']+)["']/i);
        if (ogDescMatch && ogDescMatch[1]) {
          const rawDesc = ogDescMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&");

          // Pattern: "490K likes, 1,236 comments - username on August 19, 2026: 'Caption'."
          const handleMatch = rawDesc.match(/-\s*([a-zA-Z0-9_.]+)\s*on/);
          if (handleMatch && handleMatch[1]) {
            author = handleMatch[1].trim();
          }

          if (!caption) {
            const descCaption = rawDesc.match(/:\s*["“]([\s\S]+?)["”]?\s*\.?$/);
            if (descCaption && descCaption[1]) {
              caption = descCaption[1].trim();
            } else {
              caption = rawDesc;
            }
          }
        }

        if (videoUrl) {
          return {
            success: true,
            shortcode,
            videoUrl,
            thumbnailUrl: thumbnailUrl || videoUrl,
            caption,
            author,
            source: "native-crawler",
          };
        }
      } catch {
        // Continue to next header/url
      }
    }
  }

  return null;
}

/**
 * Standard User-Agent and headers for Instagram GraphQL requests
 */
const BASE_HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  Referer: "https://www.instagram.com/",
  Origin: "https://www.instagram.com",
  "X-IG-App-ID": "936619743392459",
  "X-ASBD-ID": "129477",
};

/**
 * Layer 2: Native GraphQL Scraper
 */
async function extractViaGraphQL(shortcode: string): Promise<InstagramMediaData | null> {
  const docIds = [
    "8845758582119845",
    "7148703928507858",
    "8440537872688849",
  ];

  const headers = { ...BASE_HEADERS };
  const sessionCookie =
    process.env.INSTAGRAM_COOKIE ||
    (process.env.INSTAGRAM_SESSION_ID ? `sessionid=${process.env.INSTAGRAM_SESSION_ID}` : "");
  if (sessionCookie) {
    headers["Cookie"] = sessionCookie;
  }

  for (const docId of docIds) {
    try {
      const response = await fetch("https://www.instagram.com/graphql/query", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({
          doc_id: docId,
          variables: JSON.stringify({ shortcode }),
        }),
      });

      if (!response.ok) continue;

      const json = await response.json();
      const media =
        json?.data?.xdt_shortcode_media ||
        json?.data?.shortcode_media;

      if (!media) continue;

      let videoUrl = media.video_url || "";
      let thumbnailUrl = media.display_url || "";

      if (!videoUrl && media.edge_sidecar_to_children?.edges?.length > 0) {
        for (const edge of media.edge_sidecar_to_children.edges) {
          if (edge.node?.is_video && edge.node?.video_url) {
            videoUrl = edge.node.video_url;
            thumbnailUrl = edge.node.display_url || thumbnailUrl;
            break;
          }
        }
      }

      if (videoUrl) {
        const caption =
          media.edge_media_to_caption?.edges?.[0]?.node?.text || "";
        const author =
          media.owner?.username || media.owner?.full_name || "Instagram User";
        const duration = media.video_duration || undefined;

        return {
          success: true,
          shortcode,
          videoUrl,
          thumbnailUrl,
          caption,
          author,
          duration,
          source: "native-graphql",
        };
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Layer 3: Native Embed Page Scraper
 */
async function extractViaEmbed(shortcode: string): Promise<InstagramMediaData | null> {
  const embedUrls = [
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    `https://www.instagram.com/reel/${shortcode}/embed/captioned/`,
  ];

  for (const embedUrl of embedUrls) {
    try {
      const response = await fetch(embedUrl, {
        headers: {
          "User-Agent": BASE_HEADERS["User-Agent"],
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) continue;

      const html = await response.text();

      let videoUrl = "";
      const videoMatches = [...html.matchAll(/"video_url"\s*:\s*"([^"]+)"/g)];
      if (videoMatches.length > 0) {
        videoUrl = cleanEscapedUrl(videoMatches[0][1]);
      } else {
        const videoSrcMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/i);
        if (videoSrcMatch) {
          videoUrl = cleanEscapedUrl(videoSrcMatch[1]);
        }
      }

      let thumbnailUrl = "";
      const displayMatches = [...html.matchAll(/"display_url"\s*:\s*"([^"]+)"/g)];
      if (displayMatches.length > 0) {
        thumbnailUrl = cleanEscapedUrl(displayMatches[0][1]);
      }

      let author = "Instagram User";
      const usernameMatch =
        html.match(/"username"\s*:\s*"([^"]+)"/) ||
        html.match(/class="UsernameText"[^>]*>([^<]+)<\/span>/i);
      if (usernameMatch && usernameMatch[1]) {
        author = usernameMatch[1].trim();
      }

      let caption = "";
      const captionMatch =
        html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i) ||
        html.match(/"text"\s*:\s*"([^"]+)"/);
      if (captionMatch && captionMatch[1]) {
        caption = captionMatch[1].replace(/<[^>]+>/g, "").trim();
      }

      if (videoUrl) {
        return {
          success: true,
          shortcode,
          videoUrl,
          thumbnailUrl: thumbnailUrl || videoUrl,
          caption,
          author,
          source: "native-embed",
        };
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Layer 4: RapidAPI Fallback Engine
 */
async function extractViaRapidAPI(
  cleanUrl: string,
  shortcode: string
): Promise<InstagramMediaData | null> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return null;

  const host =
    process.env.RAPIDAPI_HOST ||
    "instagram-downloader-download-instagram-videos-stories4.p.rapidapi.com";

  const endpoints = [
    `https://${host}/index?url=${encodeURIComponent(cleanUrl)}`,
    `https://${host}/get?url=${encodeURIComponent(cleanUrl)}`,
    `https://${host}/?url=${encodeURIComponent(cleanUrl)}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": host,
        },
      });

      if (!response.ok) continue;

      const data = await response.json();
      let videoUrl = "";
      let thumbnailUrl = "";
      let caption = "";
      let author = "Instagram User";

      if (Array.isArray(data?.data) && data.data.length > 0) {
        const item = data.data[0];
        videoUrl = item.url || item.video_url || item.download_url || "";
        thumbnailUrl = item.thumbnail || item.picture || item.display_url || "";
      } else if (Array.isArray(data?.media) && data.media.length > 0) {
        const item = data.media[0];
        videoUrl = item.url || item.video_url || item.download_url || "";
        thumbnailUrl = item.thumbnail || item.picture || "";
      } else if (Array.isArray(data?.result) && data.result.length > 0) {
        const item = data.result[0];
        videoUrl = item.video || item.url || "";
        thumbnailUrl = item.thumbnail || item.thumb || "";
      } else if (data?.video_url || data?.url || data?.download_url) {
        videoUrl = data.video_url || data.url || data.download_url;
        thumbnailUrl = data.display_url || data.thumbnail || data.picture || "";
      }

      caption = data?.caption || data?.title || data?.description || "";
      author = data?.author || data?.owner?.username || data?.username || "Instagram Creator";

      if (videoUrl) {
        return {
          success: true,
          shortcode,
          videoUrl: cleanEscapedUrl(videoUrl),
          thumbnailUrl: cleanEscapedUrl(thumbnailUrl || videoUrl),
          caption,
          author,
          source: "rapidapi",
        };
      }
    } catch {
      // Try next endpoint
    }
  }

  return null;
}

/**
 * Main Orchestrator: Multi-Layer Instagram Extraction
 */
export async function extractInstagramMedia(rawUrl: string): Promise<InstagramMediaData> {
  const { shortcode, cleanUrl } = validateAndExtractShortcode(rawUrl);

  // 1. Primary Layer: Meta Crawler SSR Engine (High-reliability for Reels & Posts)
  try {
    const crawlerResult = await extractViaCrawler(shortcode);
    if (crawlerResult) {
      return crawlerResult;
    }
  } catch {
    // Continue
  }

  // 2. Secondary Layer: Native GraphQL
  try {
    const gqlResult = await extractViaGraphQL(shortcode);
    if (gqlResult) {
      return gqlResult;
    }
  } catch {
    // Continue
  }

  // 3. Tertiary Layer: Native Embed Scraper
  try {
    const embedResult = await extractViaEmbed(shortcode);
    if (embedResult) {
      return embedResult;
    }
  } catch {
    // Continue
  }

  // 4. Fallback Layer: RapidAPI Scraper (if API Key is configured)
  if (process.env.RAPIDAPI_KEY) {
    try {
      const rapidResult = await extractViaRapidAPI(cleanUrl, shortcode);
      if (rapidResult) {
        return rapidResult;
      }
    } catch {
      // Continue
    }
  }

  throw new Error(
    "Tidak dapat menemukan video dari link tersebut. Pastikan tautan berasal dari video publik (bukan akun private yang dikunci) dan video masih aktif di Instagram."
  );
}
