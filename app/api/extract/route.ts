import { NextRequest, NextResponse } from "next/server";
import { extractInstagramMedia } from "@/lib/instagram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 25, 60000); // 25 requests per minute

    const headers = {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": rateLimit.reset.toString(),
    };

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateLimit.reset} detik.`,
        },
        { status: 429, headers }
      );
    }

    // 2. Validate Body
    let body: { url?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Payload JSON tidak valid." },
        { status: 400, headers }
      );
    }

    const { url } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Parameter URL wajib diisi." },
        { status: 400, headers }
      );
    }

    // 3. Strict SSRF Protection & Domain Whitelist Validation
    let parsedUrl: URL;
    try {
      const normalizedUrl = url.trim().startsWith("http://") || url.trim().startsWith("https://")
        ? url.trim()
        : `https://${url.trim()}`;
      parsedUrl = new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: "Format tautan tidak valid." },
        { status: 400, headers }
      );
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { success: false, error: "Protokol tautan tidak diizinkan. Hanya menerima HTTP/HTTPS." },
        { status: 400, headers }
      );
    }

    const host = parsedUrl.hostname.toLowerCase();

    // Prevent SSRF: block local loopback, link-local, and private network IPs
    const isPrivateOrLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host === "[::1]" ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host.startsWith("169.254.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      host.endsWith(".internal") ||
      host.endsWith(".local") ||
      host.endsWith(".onion");

    if (isPrivateOrLocal) {
      return NextResponse.json(
        { success: false, error: "Akses ke jaringan lokal/privat diblokir oleh sistem keamanan SSRF ReelSnap." },
        { status: 403, headers }
      );
    }

    const allowedInstagramHosts = [
      "instagram.com",
      "www.instagram.com",
      "m.instagram.com",
      "instagr.am",
    ];

    if (!allowedInstagramHosts.includes(host)) {
      return NextResponse.json(
        {
          success: false,
          error: "Domain URL tidak diizinkan. ReelSnap hanya memproses tautan resmi instagram.com atau instagr.am.",
        },
        { status: 400, headers }
      );
    }

    // 4. Perform Multi-Layer Extraction
    const media = await extractInstagramMedia(parsedUrl.toString());

    return NextResponse.json(
      {
        success: true,
        shortcode: media.shortcode,
        mediaType: media.mediaType,
        videoUrl: media.videoUrl,
        audioUrl: media.audioUrl || (media.mediaType === "video" ? media.videoUrl : undefined),
        imageUrl: media.imageUrl,
        items: media.items || [],
        thumbnailUrl: media.thumbnailUrl,
        caption: media.caption,
        author: media.author,
        duration: media.duration,
        source: media.source,
      },
      { status: 200, headers }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memproses link Instagram.";

    const statusCode = errorMessage.includes("tidak valid") ? 400 : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
