import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const {
  mockRequirePermission,
  mockIsSupabaseAdminConfigured,
  mockGetSupabaseAdminClient,
} = vi.hoisted(() => ({
  mockRequirePermission: vi.fn(),
  mockIsSupabaseAdminConfigured: vi.fn(),
  mockGetSupabaseAdminClient: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  requirePermission: mockRequirePermission,
}));

vi.mock("@/lib/supabase/admin", () => ({
  isSupabaseAdminConfigured: mockIsSupabaseAdminConfigured,
  getSupabaseAdminClient: mockGetSupabaseAdminClient,
}));

import { GET } from "@/app/api/v1/intern/certificate/route";

function makeRequest(url = "http://localhost:3000/api/v1/intern/certificate") {
  return new NextRequest(url);
}

function makeAuthOk(userId = "intern-user-1") {
  return {
    ok: true as const,
    auth: {
      userId,
      email: "intern@techgroww.co.in",
      fullName: "Intern Candidate",
      accountClass: "intern" as const,
      roles: ["intern" as const],
      organizationIds: [],
      aal: "aal1",
      sessionVersion: 1,
    },
  };
}

function setupSupabaseMock(options: {
  enrollmentsData?: Array<{ id: string }> | null;
  enrollmentsError?: { message: string } | null;
  certData?: {
    certificate_code: string;
    recipient_name: string;
    program_title_snapshot: string;
    issued_at: string;
    revoked_at: string | null;
  } | null;
  certError?: { message: string } | null;
}) {
  const eqMock = vi.fn().mockResolvedValue({
    data: options.enrollmentsData ?? [],
    error: options.enrollmentsError ?? null,
  });
  const enrollSelectMock = vi.fn().mockReturnValue({ eq: eqMock });

  const maybeSingleMock = vi.fn().mockResolvedValue({
    data: options.certData ?? null,
    error: options.certError ?? null,
  });
  const limitMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
  const orderMock = vi.fn().mockReturnValue({ limit: limitMock });
  const inMock = vi.fn().mockReturnValue({ order: orderMock });
  const certSelectMock = vi.fn().mockReturnValue({ in: inMock });

  const fromMock = vi.fn((table: string) => {
    if (table === "intern_enrollments") {
      return { select: enrollSelectMock };
    }
    if (table === "certificates") {
      return { select: certSelectMock };
    }
    throw new Error(`Unexpected table: ${table}`);
  });

  mockGetSupabaseAdminClient.mockReturnValue({ from: fromMock });

  return { eqMock, inMock, fromMock };
}

describe("GET /api/v1/intern/certificate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns auth failure response when requirePermission rejects", async () => {
    mockRequirePermission.mockResolvedValue({
      ok: false,
      response: NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      ),
    });

    const res = await GET(makeRequest());
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(401);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("UNAUTHORIZED");
    expect(mockGetSupabaseAdminClient).not.toHaveBeenCalled();
  });

  it("returns null certificate with demoMode when Supabase is unconfigured (JSON)", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(false);

    const res = await GET(makeRequest());
    const json = (await res.json()) as {
      ok: boolean;
      data: { certificate: unknown; demoMode: boolean };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data).toEqual({ certificate: null, demoMode: true });
  });

  it("returns 404 CERTIFICATE_NOT_FOUND when Supabase is unconfigured and format=pdf", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(false);

    const res = await GET(
      makeRequest("http://localhost:3000/api/v1/intern/certificate?format=pdf")
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(404);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("CERTIFICATE_NOT_FOUND");
  });

  it("returns 500 DB_ERROR when intern_enrollments lookup fails", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    setupSupabaseMock({
      enrollmentsData: null,
      enrollmentsError: { message: "Connection failed" },
    });

    const res = await GET(makeRequest());
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(500);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("DB_ERROR");
  });

  it("returns 404 CERTIFICATE_NOT_FOUND when user has no enrollments", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    setupSupabaseMock({ enrollmentsData: [] });

    const res = await GET(makeRequest());
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(404);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("CERTIFICATE_NOT_FOUND");
  });

  it("returns 404 CERTIFICATE_NOT_FOUND when enrollment has no issued certificate", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    setupSupabaseMock({
      enrollmentsData: [{ id: "enr-1" }],
      certData: null,
    });

    const res = await GET(makeRequest());
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(404);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("CERTIFICATE_NOT_FOUND");
  });

  it("returns formatted certificate JSON for active enrollment", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk("intern-user-1"));
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    const { eqMock, inMock } = setupSupabaseMock({
      enrollmentsData: [{ id: "enr-1" }],
      certData: {
        certificate_code: "TG-CERT-2026-001",
        recipient_name: "Test Candidate",
        program_title_snapshot: "Cloud Architecture & Full-Stack Systems",
        issued_at: "2026-01-15T00:00:00Z",
        revoked_at: null,
      },
    });

    const res = await GET(makeRequest());
    const json = (await res.json()) as {
      ok: boolean;
      data: {
        certificate: {
          certificateCode: string;
          recipientName: string;
          programTitle: string;
          issuedAtIso: string;
          revoked: boolean;
        };
      };
    };

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(eqMock).toHaveBeenCalledWith("user_id", "intern-user-1");
    expect(inMock).toHaveBeenCalledWith("enrollment_id", ["enr-1"]);
    expect(json.data.certificate).toEqual({
      certificateCode: "TG-CERT-2026-001",
      recipientName: "Test Candidate",
      programTitle: "Cloud Architecture & Full-Stack Systems",
      issuedAtIso: "2026-01-15T00:00:00Z",
      revoked: false,
    });
  });

  it("returns 403 CERTIFICATE_REVOKED for PDF download when certificate is revoked", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    setupSupabaseMock({
      enrollmentsData: [{ id: "enr-1" }],
      certData: {
        certificate_code: "TG-CERT-2026-001",
        recipient_name: "Test Candidate",
        program_title_snapshot: "Cloud Architecture & Full-Stack Systems",
        issued_at: "2026-01-15T00:00:00Z",
        revoked_at: "2026-02-01T00:00:00Z",
      },
    });

    const res = await GET(
      makeRequest("http://localhost:3000/api/v1/intern/certificate?format=pdf")
    );
    const json = (await res.json()) as { ok: boolean; error: { code: string } };

    expect(res.status).toBe(403);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe("CERTIFICATE_REVOKED");
  });

  it("returns valid application/pdf binary when format=pdf and certificate is active", async () => {
    mockRequirePermission.mockResolvedValue(makeAuthOk());
    mockIsSupabaseAdminConfigured.mockReturnValue(true);
    setupSupabaseMock({
      enrollmentsData: [{ id: "enr-1" }],
      certData: {
        certificate_code: "TG-CERT-2026-001",
        recipient_name: "Test Candidate",
        program_title_snapshot: "Cloud Architecture & Full-Stack Systems",
        issued_at: "2026-01-15T00:00:00Z",
        revoked_at: null,
      },
    });

    const res = await GET(
      makeRequest("http://localhost:3000/api/v1/intern/certificate?format=pdf")
    );
    const buf = new Uint8Array(await res.arrayBuffer());
    const header = String.fromCharCode(...buf.slice(0, 5));

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain("TG-CERT-2026-001.pdf");
    expect(buf.byteLength).toBeGreaterThan(1000);
    expect(header).toBe("%PDF-");
  });
});
