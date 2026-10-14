import { NextRequest, NextResponse } from "next/server";
import { extractInstagramMedia } from "@/lib/instagram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

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

    // 3. Perform Dual-Layer Extraction
    const media = await extractInstagramMedia(url);

    return NextResponse.json(
      {
        success: true,
        shortcode: media.shortcode,
        videoUrl: media.videoUrl,
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
