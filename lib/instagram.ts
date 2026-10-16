/**
 * SatsetReels - Instagram Video, Audio & Photo Extraction Engine
 * Multi-Layer Architecture:
 * 1. Meta Crawler SSR Scraper (Extracts progressive HD video versions or original full HD photos via official crawler preview)
 * 2. Native GraphQL Scraper (doc_id: 9510064595728286 / 8845758582119845 / 7148703928507858)
 * 3. Native Embed Scraper
 * 4. RapidAPI Scraper Integration (Fallback if configured)
 */

export interface InstagramMediaItem {
  id?: string;
  type: "video" | "image";
  url: string; // The HD direct media URL for download & streaming
  thumbnailUrl: string;
  width?: number;
  height?: number;
}

export interface InstagramMediaData {
  success: true;
  shortcode: string;
  mediaType: "video" | "image";
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  items?: InstagramMediaItem[];
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

  // Pattern matches /reel/, /reels/, /p/, /tv/, /share/reel/, /share/p/, etc.
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:reel|reels|p|tv|share\/(?:reel|p))\/([A-Za-z0-9_-]+)/i;
  const match = trimmed.match(regex);

  if (!match || !match[1]) {
    throw new Error(
      "Format link Instagram tidak valid. Pastikan tautan berupa URL Reels, Postingan Foto, Video Post, atau IGTV (contoh: https://www.instagram.com/reel/xyz123/ atau https://www.instagram.com/p/xyz123/)"
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
 * Decodes all forms of HTML decimal, hex, and named entities into standard characters & emojis
 */
export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    // Hex entities: &#x1f62d; -> 😭
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return "";
      }
    })
    // Decimal entities: &#128557; -> 😭
    .replace(/&#([0-9]+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return "";
      }
    })
    // Named entities
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Helper to unescape JSON and HTML encoded URLs and remove trailing XML tags
 */
export function cleanEscapedUrl(url: string): string {
  let cleaned = url
    .replace(/\\u0026/g, "&")
    .replace(/\\u003d/g, "=")
    .replace(/\\u002f/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/\\/g, "")
    .trim();

  // Strip trailing XML/HTML tags like <BaseURL> or u003c
  const cutoff = cleaned.search(/(?:u003c|<|"|')/i);
  if (cutoff !== -1) {
    cleaned = cleaned.slice(0, cutoff);
  }
  return cleaned;
}

/**
 * Robust helper to extract meta tag content regardless of attribute order
 */
function getMetaTagContent(html: string, name: string): string {
  const r1 = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i");
  const m1 = html.match(r1);
  if (m1 && m1[1]) return cleanEscapedUrl(m1[1]);

  const r2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i");
  const m2 = html.match(r2);
  if (m2 && m2[1]) return cleanEscapedUrl(m2[1]);

  const r3 = new RegExp(`["'](?:property|name)["']\\s*:\\s*["']${name}["'][^}]*?["']content["']\\s*:\\s*["']([^"']+)["']`, "i");
  const m3 = html.match(r3);
  if (m3 && m3[1]) return cleanEscapedUrl(m3[1]);

  return "";
}

/**
 * Extracts the highest-resolution, genuinely uncropped photo URL from Instagram HTML payload.
 * Meta/Instagram server-side crops og:image into square thumbnails (e.g. stp=c289...s640x640) for social previews,
 * whereas image_versions2 and display_resources retain the true original aspect ratio and full dimensions (e.g. 1448x1931).
 */
function extractUncroppedPhotoUrl(html: string): string | null {
  // 1. Look for image_versions2 candidates in JSON
  const iv2Regex = /"image_versions2"\s*:\s*\{"candidates"\s*:\s*(\[[^\]]+\])/g;
  for (const match of html.matchAll(iv2Regex)) {
    try {
      const candidates = JSON.parse(match[1]);
      if (Array.isArray(candidates) && candidates.length > 0) {
        // Find the first candidate that does NOT have server-side crop parameters (stp=c...)
        const uncropped = candidates.find((c: { url?: string }) => {
          const u = c?.url || "";
          return u && !u.includes("stp=c") && !u.includes("c0.") && !u.includes("/c0.");
        });
        if (uncropped && uncropped.url) {
          return cleanEscapedUrl(uncropped.url);
        }
        if (candidates[0]?.url) {
          return cleanEscapedUrl(candidates[0].url);
        }
      }
    } catch {
      // continue
    }
  }

  // 2. Look for display_resources in JSON
  const drRegex = /"display_resources"\s*:\s*(\[[^\]]+\])/g;
  for (const match of html.matchAll(drRegex)) {
    try {
      const resources = JSON.parse(match[1]);
      if (Array.isArray(resources) && resources.length > 0) {
        const sorted = [...resources].sort(
          (a: { config_width?: number; config_height?: number }, b: { config_width?: number; config_height?: number }) =>
            (b.config_width || 0) * (b.config_height || 0) -
            (a.config_width || 0) * (a.config_height || 0)
        );
        const uncropped = sorted.find((r: { src?: string }) => {
          const u = r?.src || "";
          return u && !u.includes("stp=c") && !u.includes("c0.") && !u.includes("/c0.");
        });
        if (uncropped?.src) {
          return cleanEscapedUrl(uncropped.src);
        }
        if (sorted[0]?.src) {
          return cleanEscapedUrl(sorted[0].src);
        }
      }
    } catch {
      // continue
    }
  }

  // 3. Look for display_url (if not cropped)
  const duMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
  if (duMatch && duMatch[1]) {
    const clean = cleanEscapedUrl(duMatch[1]);
    if (!clean.includes("stp=c") && !clean.includes("c0.")) {
      return clean;
    }
  }

  return null;
}

/**
 * Layer 1: Meta Crawler SSR Engine
 * Instagram renders direct progressive HD video versions or high-res photo assets for crawler user-agents
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

        // 1. Scan all escaped .mp4 URLs in the HTML to detect progressive video and audio tracks
        const allMp4Matches = [...html.matchAll(/(https?:\\\/\\\/[^\s"'<>]+\.mp4[^\s"'<>]*)/g)];
        let progressiveVideoUrl = "";
        let directAudioUrl = "";
        let bestVideoUrl = "";

        for (const match of allMp4Matches) {
          const rawCandidate = cleanEscapedUrl(match[1]);
          const efgMatch = rawCandidate.match(/efg=([^&\\"]+)/);
          let tag = "";
          if (efgMatch) {
            try {
              const b64 = decodeURIComponent(efgMatch[1]).replace(/u00253D/g, "=").replace(/%3D/g, "=");
              const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
              tag = json?.vencode_tag || "";
            } catch {
              // ignore
            }
          }

          if (tag.includes("audio") || tag.includes("heaac")) {
            if (!directAudioUrl) directAudioUrl = rawCandidate;
          } else if (tag.includes("progressive")) {
            if (!progressiveVideoUrl) progressiveVideoUrl = rawCandidate;
          } else if (tag.includes("dash_baseline_1") || !bestVideoUrl) {
            if (!bestVideoUrl) bestVideoUrl = rawCandidate;
          }
        }

        // Prefer progressive video so that video preview and download have both video and audio
        let videoUrl = progressiveVideoUrl || "";

        // 2. Check video_versions JSON array if progressive video was not found
        if (!videoUrl) {
          const videoVersionsMatch = html.match(/"video_versions"\s*:\s*(\[[^\]]+\])/);
          if (videoVersionsMatch && videoVersionsMatch[1]) {
            try {
              const versions = JSON.parse(videoVersionsMatch[1]);
              if (Array.isArray(versions) && versions.length > 0) {
                videoUrl = cleanEscapedUrl(versions[0].url || versions[0].src || "");
              }
            } catch {
              const urlInVersions = videoVersionsMatch[1].match(/"url"\s*:\s*"([^"]+)"/);
              if (urlInVersions) {
                videoUrl = cleanEscapedUrl(urlInVersions[1]);
              }
            }
          }
        }

        // 3. Fallback to best detected video or first mp4
        if (!videoUrl) {
          videoUrl = bestVideoUrl || (allMp4Matches.length > 0 ? cleanEscapedUrl(allMp4Matches[0][1]) : "");
        }

        // 4. Fallback: Check og:video meta tag
        if (!videoUrl) {
          const ogVideo = getMetaTagContent(html, "og:video") || getMetaTagContent(html, "og:video:secure_url");
          if (ogVideo) {
            videoUrl = ogVideo;
          }
        }

        // Extract Title, Author and Caption
        let author = "Instagram Creator";
        let caption = "";

        const ogTitle = getMetaTagContent(html, "og:title") || getMetaTagContent(html, "twitter:title");
        if (ogTitle) {
          const rawTitle = decodeHtmlEntities(ogTitle);
          const authorParts = rawTitle.split(" on Instagram");
          if (authorParts.length > 0 && authorParts[0].trim()) {
            author = authorParts[0].trim();
          }

          const captionMatch = rawTitle.match(/:\s*["“]([\s\S]+?)["”]?$/);
          if (captionMatch && captionMatch[1]) {
            caption = captionMatch[1].trim();
          }
        }

        const ogDesc = getMetaTagContent(html, "og:description") || getMetaTagContent(html, "twitter:description");
        if (ogDesc) {
          const rawDesc = decodeHtmlEntities(ogDesc);
          const handleMatch = rawDesc.match(/-\s*([a-zA-Z0-9_.]+)\s*on/);
          if (handleMatch && handleMatch[1]) {
            author = handleMatch[1].trim();
          }

          if (!caption) {
            const quoteMatch = rawDesc.match(/:\s*["“]([\s\S]*?)["”]\s*\.?$/) || rawDesc.match(/["“]([\s\S]*?)["”]/);
            if (quoteMatch && quoteMatch[1]) {
              caption = quoteMatch[1].trim();
            } else {
              caption = rawDesc;
            }
          }
        }

        // Extract high-resolution Thumbnail/Image from og:image
        const mainOgImage = getMetaTagContent(html, "og:image") || getMetaTagContent(html, "twitter:image");

        // IF VIDEO WAS FOUND: return as Video Reels / Video Post
        if (videoUrl) {
          const audioUrl = directAudioUrl || videoUrl;
          return {
            success: true,
            shortcode,
            mediaType: "video",
            videoUrl,
            audioUrl,
            thumbnailUrl: mainOgImage || videoUrl,
            caption: decodeHtmlEntities(caption),
            author: decodeHtmlEntities(author),
            source: "native-crawler",
          };
        }

        // IF NO VIDEO: It is a Photo Post (Single Photo or Multi-Photo Carousel)

        // 1. Check if there is an explicit sidecar / carousel structure for this post
        let carouselItems: InstagramMediaItem[] = [];

        // Check edge_sidecar_to_children JSON structure
        const sidecarMatch = html.match(/"edge_sidecar_to_children"\s*:\s*\{\s*"edges"\s*:\s*(\[[^\]]+\])\s*\}/);
        if (sidecarMatch && sidecarMatch[1]) {
          try {
            const edges = JSON.parse(sidecarMatch[1]);
            if (Array.isArray(edges) && edges.length > 1) {
              for (let i = 0; i < edges.length; i++) {
                const node = edges[i]?.node;
                if (!node) continue;
                if (node.is_video && node.video_url) {
                  carouselItems.push({
                    id: `${shortcode}-${i}`,
                    type: "video",
                    url: cleanEscapedUrl(node.video_url),
                    thumbnailUrl: cleanEscapedUrl(node.display_url || node.video_url),
                    width: node.dimensions?.width,
                    height: node.dimensions?.height,
                  });
                } else if (node.display_url) {
                  let bestUrl = node.display_url;
                  if (Array.isArray(node.display_resources) && node.display_resources.length > 0) {
                    const sorted = [...node.display_resources].sort(
                      (a, b) =>
                        (b.config_width || 0) * (b.config_height || 0) -
                        (a.config_width || 0) * (a.config_height || 0)
                    );
                    const uncropped = sorted.find((r) => {
                      const u = r?.src || "";
                      return u && !u.includes("stp=c") && !u.includes("c0.");
                    });
                    if (uncropped?.src) bestUrl = uncropped.src;
                    else if (sorted[0]?.src) bestUrl = sorted[0].src;
                  }
                  carouselItems.push({
                    id: `${shortcode}-${i}`,
                    type: "image",
                    url: cleanEscapedUrl(bestUrl),
                    thumbnailUrl: cleanEscapedUrl(bestUrl),
                    width: node.dimensions?.width,
                    height: node.dimensions?.height,
                  });
                }
              }
            }
          } catch {
            // ignore JSON parse error
          }
        }

        // Check carousel_media JSON structure if edge_sidecar_to_children wasn't present
        if (carouselItems.length <= 1) {
          const carouselMediaMatch = html.match(/"carousel_media"\s*:\s*(\[[^\]]+\])/);
          if (carouselMediaMatch && carouselMediaMatch[1]) {
            try {
              const mediaList = JSON.parse(carouselMediaMatch[1]);
              if (Array.isArray(mediaList) && mediaList.length > 1) {
                const parsedItems: InstagramMediaItem[] = [];
                for (let i = 0; i < mediaList.length; i++) {
                  const item = mediaList[i];
                  const videoUrl = item.video_versions?.[0]?.url;
                  let imgUrl = item.display_url;
                  if (Array.isArray(item.image_versions2?.candidates) && item.image_versions2.candidates.length > 0) {
                    const uncropped = item.image_versions2.candidates.find((c: { url?: string }) => {
                      const u = c?.url || "";
                      return u && !u.includes("stp=c") && !u.includes("c0.") && !u.includes("/c0.");
                    });
                    if (uncropped?.url) {
                      imgUrl = uncropped.url;
                    } else if (item.image_versions2.candidates[0]?.url) {
                      imgUrl = item.image_versions2.candidates[0].url;
                    }
                  }
                  if (videoUrl) {
                    parsedItems.push({
                      id: `${shortcode}-${i}`,
                      type: "video",
                      url: cleanEscapedUrl(videoUrl),
                      thumbnailUrl: cleanEscapedUrl(imgUrl || videoUrl),
                    });
                  } else if (imgUrl) {
                    parsedItems.push({
                      id: `${shortcode}-${i}`,
                      type: "image",
                      url: cleanEscapedUrl(imgUrl),
                      thumbnailUrl: cleanEscapedUrl(imgUrl),
                    });
                  }
                }
                if (parsedItems.length > 1) {
                  carouselItems = parsedItems;
                }
              }
            } catch {
              // ignore JSON parse error
            }
          }
        }

        // If verified as a true multi-item carousel:
        if (carouselItems.length > 1) {
          const first = carouselItems[0];
          return {
            success: true,
            shortcode,
            mediaType: first.type === "video" ? "video" : "image",
            videoUrl: first.type === "video" ? first.url : undefined,
            audioUrl: first.type === "video" ? first.url : undefined,
            imageUrl: first.type === "image" ? first.url : undefined,
            thumbnailUrl: first.thumbnailUrl,
            items: carouselItems,
            caption: decodeHtmlEntities(caption),
            author: decodeHtmlEntities(author),
            source: "native-crawler",
          };
        }

        // 2. Otherwise: STRICTLY A SINGLE PHOTO POST!
        // Prioritize the genuine uncropped master photo asset from image_versions2 or display_resources.
        // Meta server-side crops og:image into square thumbnails (e.g. 640x640) for social previews.
        // extractUncroppedPhotoUrl gets the 100% full, uncropped original dimensions (e.g. 1448x1931 portrait).
        let singleImageUrl = extractUncroppedPhotoUrl(html);
        if (!singleImageUrl) {
          singleImageUrl = mainOgImage;
        }
        if (!singleImageUrl) {
          const linkImgMatch =
            html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i) ||
            html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']image_src["']/i);
          if (linkImgMatch && linkImgMatch[1]) {
            singleImageUrl = cleanEscapedUrl(linkImgMatch[1]);
          }
        }

        if (!singleImageUrl) {
          // As a last resort, extract the first display_url corresponding to this post
          const singleDisplayMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
          if (singleDisplayMatch && singleDisplayMatch[1]) {
            singleImageUrl = cleanEscapedUrl(singleDisplayMatch[1]);
          }
        }

        if (singleImageUrl) {
          return {
            success: true,
            shortcode,
            mediaType: "image",
            imageUrl: singleImageUrl,
            thumbnailUrl: singleImageUrl,
            items: [
              {
                id: `${shortcode}-0`,
                type: "image",
                url: singleImageUrl,
                thumbnailUrl: singleImageUrl,
              },
            ],
            caption: decodeHtmlEntities(caption),
            author: decodeHtmlEntities(author),
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
    "9510064595728286",
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
          variables: JSON.stringify({
            shortcode,
            fetch_tagged_user_count: null,
            hoisted_comment_id: null,
            hoisted_reply_id: null,
          }),
        }),
      });

      if (!response.ok) continue;

      const json = await response.json();
      const media = json?.data?.xdt_shortcode_media || json?.data?.shortcode_media;

      if (!media) continue;

      const caption = media.edge_media_to_caption?.edges?.[0]?.node?.text || "";
      const author = media.owner?.username || media.owner?.full_name || "Instagram User";
      const duration = media.video_duration || undefined;

      const isSidecar =
        media.__typename === "XDTGraphSidecar" ||
        media.__typename === "GraphSidecar" ||
        (Array.isArray(media.edge_sidecar_to_children?.edges) &&
          media.edge_sidecar_to_children.edges.length > 0);

      // Carousel / Sidecar Post (Multiple Photos / Videos)
      if (isSidecar) {
        const edges = media.edge_sidecar_to_children?.edges || [];
        const items: InstagramMediaItem[] = [];

        for (const edge of edges) {
          const node = edge?.node;
          if (!node) continue;

          if (node.is_video && node.video_url) {
            items.push({
              id: node.id || node.shortcode,
              type: "video",
              url: cleanEscapedUrl(node.video_url),
              thumbnailUrl: cleanEscapedUrl(node.display_url || node.video_url),
              width: node.dimensions?.width,
              height: node.dimensions?.height,
            });
          } else if (node.display_url) {
            // Pick highest resolution resource available (uncropped)
            let bestUrl = node.display_url;
            if (Array.isArray(node.display_resources) && node.display_resources.length > 0) {
              const sorted = [...node.display_resources].sort(
                (a, b) =>
                  (b.config_width || 0) * (b.config_height || 0) -
                  (a.config_width || 0) * (a.config_height || 0)
              );
              const uncropped = sorted.find((r) => {
                const u = r?.src || "";
                return u && !u.includes("stp=c") && !u.includes("c0.");
              });
              if (uncropped?.src) bestUrl = uncropped.src;
              else if (sorted[0]?.src) bestUrl = sorted[0].src;
            }

            items.push({
              id: node.id || node.shortcode,
              type: "image",
              url: cleanEscapedUrl(bestUrl),
              thumbnailUrl: cleanEscapedUrl(bestUrl),
              width: node.dimensions?.width,
              height: node.dimensions?.height,
            });
          }
        }

        if (items.length > 0) {
          const first = items[0];
          return {
            success: true,
            shortcode,
            mediaType: first.type === "video" ? "video" : "image",
            videoUrl: first.type === "video" ? first.url : undefined,
            audioUrl: first.type === "video" ? first.url : undefined,
            imageUrl: first.type === "image" ? first.url : undefined,
            thumbnailUrl: first.thumbnailUrl,
            items,
            caption: decodeHtmlEntities(caption),
            author: decodeHtmlEntities(author),
            duration,
            source: "native-graphql",
          };
        }
      }

      // Video Post / Reel
      if (media.is_video && media.video_url) {
        const videoUrl = cleanEscapedUrl(media.video_url);
        const thumbnailUrl = cleanEscapedUrl(media.display_url || videoUrl);
        return {
          success: true,
          shortcode,
          mediaType: "video",
          videoUrl,
          audioUrl: videoUrl,
          thumbnailUrl,
          caption: decodeHtmlEntities(caption),
          author: decodeHtmlEntities(author),
          duration,
          source: "native-graphql",
        };
      }

      // Single Photo Post
      if (media.display_url) {
        let bestUrl = media.display_url;
        if (Array.isArray(media.display_resources) && media.display_resources.length > 0) {
          const sorted = [...media.display_resources].sort(
            (a, b) =>
              (b.config_width || 0) * (b.config_height || 0) -
              (a.config_width || 0) * (a.config_height || 0)
          );
          const uncropped = sorted.find((r) => {
            const u = r?.src || "";
            return u && !u.includes("stp=c") && !u.includes("c0.");
          });
          if (uncropped?.src) bestUrl = uncropped.src;
          else if (sorted[0]?.src) bestUrl = sorted[0].src;
        }

        const fullImageUrl = cleanEscapedUrl(bestUrl);
        return {
          success: true,
          shortcode,
          mediaType: "image",
          imageUrl: fullImageUrl,
          thumbnailUrl: fullImageUrl,
          items: [
            {
              type: "image",
              url: fullImageUrl,
              thumbnailUrl: fullImageUrl,
              width: media.dimensions?.width,
              height: media.dimensions?.height,
            },
          ],
          caption: decodeHtmlEntities(caption),
          author: decodeHtmlEntities(author),
          source: "native-graphql",
        };
      }
    } catch {
      // Continue to next docId
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

      // Extract author
      let author = "Instagram User";
      const usernameMatch =
        html.match(/"username"\s*:\s*"([^"]+)"/) ||
        html.match(/class="UsernameText"[^>]*>([^<]+)<\/span>/i);
      if (usernameMatch && usernameMatch[1]) {
        author = usernameMatch[1].trim();
      }

      // Extract caption
      let caption = "";
      const captionMatch =
        html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i) ||
        html.match(/"text"\s*:\s*"([^"]+)"/);
      if (captionMatch && captionMatch[1]) {
        caption = captionMatch[1].replace(/<[^>]+>/g, "").trim();
      }

      // Check for video first
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

      if (videoUrl) {
        let thumbnailUrl = "";
        const displayMatches = [...html.matchAll(/"display_url"\s*:\s*"([^"]+)"/g)];
        if (displayMatches.length > 0) {
          thumbnailUrl = cleanEscapedUrl(displayMatches[0][1]);
        }

        return {
          success: true,
          shortcode,
          mediaType: "video",
          videoUrl,
          audioUrl: videoUrl,
          thumbnailUrl: thumbnailUrl || videoUrl,
          caption: decodeHtmlEntities(caption),
          author: decodeHtmlEntities(author),
          source: "native-embed",
        };
      }

      // Check for image (prioritize genuinely uncropped asset)
      let imageUrl = extractUncroppedPhotoUrl(html) || "";
      if (!imageUrl) {
        const imgTagMatch =
          html.match(/class=["']EmbeddedMediaImage["'][^>]*src=["']([^"']+)["']/i) ||
          html.match(/<img[^>]+src=["']([^"']+)["'][^>]*class=["'][^"']*EmbeddedMediaImage[^"']*["']/i);
        if (imgTagMatch && imgTagMatch[1]) {
          imageUrl = cleanEscapedUrl(imgTagMatch[1]);
        }
      }

      if (!imageUrl) {
        const displayMatches = [...html.matchAll(/"display_url"\s*:\s*"([^"]+)"/g)];
        if (displayMatches.length > 0) {
          imageUrl = cleanEscapedUrl(displayMatches[0][1]);
        }
      }

      if (!imageUrl) {
        imageUrl = getMetaTagContent(html, "og:image");
      }

      if (imageUrl) {
        return {
          success: true,
          shortcode,
          mediaType: "image",
          imageUrl,
          thumbnailUrl: imageUrl,
          items: [
            {
              type: "image",
              url: imageUrl,
              thumbnailUrl: imageUrl,
            },
          ],
          caption: decodeHtmlEntities(caption),
          author: decodeHtmlEntities(author),
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
      const caption = data?.caption || data?.title || data?.description || "";
      const author = data?.author || data?.owner?.username || data?.username || "Instagram Creator";

      const itemsList = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.media)
        ? data.media
        : Array.isArray(data?.result)
        ? data.result
        : null;

      if (itemsList && itemsList.length > 0) {
        const items: InstagramMediaItem[] = [];

        for (const item of itemsList) {
          const itemUrl = item.url || item.video_url || item.video || item.download_url || item.image || "";
          const isItemVideo = itemUrl.includes(".mp4") || item.is_video || item.type === "video";

          const thumb = item.thumbnail || item.picture || item.thumb || item.display_url || itemUrl;
          if (itemUrl) {
            items.push({
              type: isItemVideo ? "video" : "image",
              url: cleanEscapedUrl(itemUrl),
              thumbnailUrl: cleanEscapedUrl(thumb),
            });
          }
        }

        if (items.length > 0) {
          const first = items[0];
          const mediaType: "video" | "image" = first.type === "video" ? "video" : "image";

          return {
            success: true,
            shortcode,
            mediaType,
            videoUrl: first.type === "video" ? first.url : undefined,
            audioUrl: first.type === "video" ? first.url : undefined,
            imageUrl: first.type === "image" ? first.url : undefined,
            thumbnailUrl: first.thumbnailUrl,
            items,
            caption: decodeHtmlEntities(caption),
            author: decodeHtmlEntities(author),
            source: "rapidapi",
          };
        }
      } else if (data?.video_url || data?.url || data?.download_url || data?.image) {
        const directUrl = data.video_url || data.url || data.download_url || data.image;
        const isVideo = directUrl.includes(".mp4") || data.is_video;
        const thumb = data.display_url || data.thumbnail || data.picture || directUrl;

        return {
          success: true,
          shortcode,
          mediaType: isVideo ? "video" : "image",
          videoUrl: isVideo ? cleanEscapedUrl(directUrl) : undefined,
          audioUrl: isVideo ? cleanEscapedUrl(directUrl) : undefined,
          imageUrl: !isVideo ? cleanEscapedUrl(directUrl) : undefined,
          thumbnailUrl: cleanEscapedUrl(thumb),
          items: [
            {
              type: isVideo ? "video" : "image",
              url: cleanEscapedUrl(directUrl),
              thumbnailUrl: cleanEscapedUrl(thumb),
            },
          ],
          caption: decodeHtmlEntities(caption),
          author: decodeHtmlEntities(author),
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
 * Main Orchestrator: Multi-Layer Instagram Video, Audio & Photo Extraction
 */
export async function extractInstagramMedia(rawUrl: string): Promise<InstagramMediaData> {
  const { shortcode, cleanUrl } = validateAndExtractShortcode(rawUrl);

  // 1. Primary Layer: Meta Crawler SSR Engine (High-reliability for Reels, Videos & Photos)
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
    "Tidak dapat menemukan media dari tautan tersebut. SatsetReels mendukung pengunduhan Video Reels, Feed Video, serta Postingan Foto HD Instagram. Pastikan tautan berasal dari postingan publik yang masih aktif."
  );
}
