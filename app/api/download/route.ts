import { NextRequest } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "child_process";
import { Readable } from "stream";
import path from "path";
import fs from "fs";

function getFfmpegPath(): string {
  const localBinary = path.join(
    process.cwd(),
    "node_modules",
    "ffmpeg-static",
    process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
  );
  if (fs.existsSync(localBinary)) {
    return localBinary;
  }
  if (
    ffmpegPath &&
    !ffmpegPath.includes("ROOT") &&
    fs.existsSync(ffmpegPath)
  ) {
    return ffmpegPath;
  }
  return "ffmpeg";
}

/**
 * Validates domain to prevent Server-Side Request Forgery (SSRF)
 * Only allows Instagram / Facebook CDN and authorized media delivery domains
 */
function isAllowedMediaHost(hostname: string): boolean {
  const allowedSuffixes = [
    ".cdninstagram.com",
    ".fbcdn.net",
    ".instagram.com",
    ".akamaihd.net",
    ".facebook.com",
    "cdninstagram.com",
    "fbcdn.net",
    "instagram.com",
    "rapidapi.com",
  ];

  const lower = hostname.toLowerCase();

  // Deny internal IP address representations
  if (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "0.0.0.0" ||
    lower.startsWith("192.168.") ||
    lower.startsWith("10.") ||
    lower.startsWith("172.16.") ||
    lower.startsWith("172.31.") ||
    lower.startsWith("169.254.") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".local")
  ) {
    return false;
  }

  return allowedSuffixes.some((suffix) => lower === suffix || lower.endsWith(suffix));
}

export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting for downloads (60 downloads per minute per IP)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`download_${clientIp}`, 60, 60000);

    if (!rateLimit.success) {
      return new Response("Terlalu banyak permintaan download. Silakan tunggu sebentar.", {
        status: 429,
        headers: {
          "Retry-After": rateLimit.reset.toString(),
        },
      });
    }

    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const requestedFilename = searchParams.get("filename");
    const mediaType = searchParams.get("type"); // 'video' | 'image' | 'audio'

    if (!targetUrl) {
      return new Response("Parameter 'url' wajib disertakan.", { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return new Response("URL tidak valid.", { status: 400 });
    }

    // SSRF verification
    if (!["http:", "https:"].includes(parsedUrl.protocol) || !isAllowedMediaHost(parsedUrl.hostname)) {
      return new Response("Domain media tidak diizinkan.", { status: 403 });
    }

    // Clean and sanitize filename
    let safeFilename = requestedFilename
      ? requestedFilename.replace(/[^a-zA-Z0-9_\-.]/g, "_")
      : `ReelSnap_${Date.now()}`;

    const isImage = mediaType === "image" || safeFilename.endsWith(".jpg") || safeFilename.endsWith(".jpeg");
    const isAudio = mediaType === "audio" || safeFilename.endsWith(".mp3");

    if (isAudio) {
      if (!safeFilename.endsWith(".mp3")) {
        safeFilename += ".mp3";
      }
    } else if (isImage) {
      if (!safeFilename.endsWith(".jpg") && !safeFilename.endsWith(".jpeg")) {
        safeFilename += ".jpg";
      }
    } else if (!safeFilename.endsWith(".mp4")) {
      safeFilename += ".mp4";
    }

    // Fetch streaming media from Instagram CDN
    const upstreamResponse = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
        Accept: "*/*",
      },
    });

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return new Response(
        `Gagal mengunduh media dari CDN Instagram. Status: ${upstreamResponse.status}`,
        { status: 502 }
      );
    }

    // Prepare client response headers
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Disposition", `attachment; filename="${safeFilename}"`);
    responseHeaders.set("Cache-Control", "public, max-age=3600");

    if (isAudio) {
      responseHeaders.set("Content-Type", "audio/mpeg");

      const resolvedFfmpeg = getFfmpegPath();
      if (!resolvedFfmpeg) {
        return new Response("FFmpeg tidak tersedia di sistem.", { status: 500 });
      }

      // Convert stream to high-quality 192kbps MP3 audio
      const ffmpegProc = spawn(/*turbopackIgnore: true*/ resolvedFfmpeg, [
        "-i", "pipe:0",
        "-vn",
        "-acodec", "libmp3lame",
        "-b:a", "192k",
        "-f", "mp3",
        "pipe:1",
      ]);

      ffmpegProc.on("error", (err) => {
        console.error("FFmpeg process error:", err);
      });

      // Abort process if client disconnects
      req.signal.addEventListener("abort", () => {
        try {
          ffmpegProc.kill("SIGKILL");
        } catch {
          // ignore
        }
      });

      ffmpegProc.stdin.on("error", () => {
        // Prevent unhandled exception if ffmpeg finishes early
      });

      // Stream upstream response into ffmpeg stdin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Readable.fromWeb(upstreamResponse.body as any).pipe(ffmpegProc.stdin);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const webStream = Readable.toWeb(ffmpegProc.stdout as any);

      return new Response(webStream as unknown as BodyInit, {
        status: 200,
        headers: responseHeaders,
      });
    }

    // Video / Image Handling
    const contentType = isImage
      ? "image/jpeg"
      : upstreamResponse.headers.get("content-type") || "video/mp4";

    responseHeaders.set("Content-Type", contentType);

    const upstreamContentLength = upstreamResponse.headers.get("content-length");
    if (upstreamContentLength) {
      responseHeaders.set("Content-Length", upstreamContentLength);
    }

    // Direct streaming to client without loading entire binary in server memory
    return new Response(upstreamResponse.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal proxy.";
    return new Response(message, { status: 500 });
  }
}
