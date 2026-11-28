import { unzipSync } from "fflate";

export type UploadDomain = "cms" | "client" | "intern" | "offer" | "proposal" | "billing" | "resume";

export const DOMAIN_SIZE_LIMITS: Record<UploadDomain, number> = {
  cms: 10 * 1024 * 1024, // 10 MB
  client: 5 * 1024 * 1024,
  intern: 5 * 1024 * 1024,
  offer: 5 * 1024 * 1024,
  proposal: 5 * 1024 * 1024,
  billing: 5 * 1024 * 1024,
  resume: 5 * 1024 * 1024,
};

export const DOMAIN_ALLOWED_MIMES: Record<UploadDomain, ReadonlySet<string>> = {
  cms: new Set(["image/png", "image/jpeg", "image/webp"]), // User .svg strictly banned!
  client: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/webp",
  ]),
  intern: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/webp",
  ]),
  offer: new Set(["application/pdf"]),
  proposal: new Set(["application/pdf"]),
  billing: new Set(["application/pdf"]),
  resume: new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
};

export interface UploadMetadataCheck {
  ok: boolean;
  status?: number;
  error?: string;
}

export function validateUploadMetadata(
  domain: UploadDomain,
  filename: string,
  mimeType: string,
  byteSize: number
): UploadMetadataCheck {
  const normalizedMime = mimeType.toLowerCase().trim();
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "svg" || normalizedMime.includes("svg")) {
    return { ok: false, status: 415, error: "SVG uploads are prohibited for security." };
  }

  if (!DOMAIN_ALLOWED_MIMES[domain].has(normalizedMime)) {
    return { ok: false, status: 415, error: `MIME type ${normalizedMime} is not allowed for ${domain}.` };
  }

  if (byteSize <= 0 || byteSize > DOMAIN_SIZE_LIMITS[domain]) {
    return {
      ok: false,
      status: 413,
      error: `File exceeds ${Math.round(DOMAIN_SIZE_LIMITS[domain] / (1024 * 1024))} MB limit.`,
    };
  }

  return { ok: true };
}

/**
 * Inspects file magic-bytes and checks .docx ZIP central directory for macros,
 * embedded executables, or XML XXE entities.
 */
export function verifyFileMagicAndStructure(
  bytes: Uint8Array,
  declaredMime: string
): UploadMetadataCheck {
  if (bytes.length < 4) {
    return { ok: false, status: 400, error: "Empty or truncated file payload." };
  }

  const mime = declaredMime.toLowerCase().trim();

  if (mime === "application/pdf") {
    const header = String.fromCharCode(...bytes.slice(0, 5));
    if (header !== "%PDF-") {
      return { ok: false, status: 400, error: "File magic bytes do not match PDF specification." };
    }
    return { ok: true };
  }

  if (mime === "image/png") {
    const isPng =
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    return isPng ? { ok: true } : { ok: false, status: 400, error: "Invalid PNG magic bytes." };
  }

  if (mime === "image/jpeg") {
    const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    return isJpg ? { ok: true } : { ok: false, status: 400, error: "Invalid JPEG magic bytes." };
  }

  if (mime === "image/webp") {
    const riff = String.fromCharCode(...bytes.slice(0, 4));
    const webp = bytes.length >= 12 ? String.fromCharCode(...bytes.slice(8, 12)) : "";
    return riff === "RIFF" && webp === "WEBP"
      ? { ok: true }
      : { ok: false, status: 400, error: "Invalid WebP magic bytes." };
  }

  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
    if (!isZip) {
      return { ok: false, status: 400, error: "Invalid DOCX ZIP signature." };
    }

    try {
      const entries = unzipSync(bytes);
      const entryNames = Object.keys(entries);
      if (!entryNames.includes("[Content_Types].xml") || !entryNames.some((n) => n.startsWith("word/"))) {
        return { ok: false, status: 400, error: "Malformed DOCX archive structure." };
      }

      for (const name of entryNames) {
        const lower = name.toLowerCase();
        if (
          lower.includes("vbaproject") ||
          lower.endsWith(".bin") ||
          lower.endsWith(".exe") ||
          lower.endsWith(".bat") ||
          lower.endsWith(".ps1") ||
          lower.endsWith(".js")
        ) {
          return { ok: false, status: 400, error: "DOCX archive contains prohibited macros or executables." };
        }
        if (lower.endsWith(".xml") || lower.endsWith(".rels")) {
          const text = new TextDecoder("utf-8", { fatal: false }).decode(entries[name]);
          if (text.includes("<!DOCTYPE") || text.includes("<!ENTITY")) {
            return { ok: false, status: 400, error: "DOCX XML contains unsafe DOCTYPE/ENTITY declarations." };
          }
        }
      }
      return { ok: true };
    } catch {
      return { ok: false, status: 400, error: "Corrupted or zip-bomb DOCX archive rejected." };
    }
  }

  return { ok: false, status: 415, error: "Unsupported MIME validation target." };
}
