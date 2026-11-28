import { SignJWT, importPKCS8 } from "jose";

interface ServiceAccountCreds {
  client_email: string;
  private_key: string;
}

/**
 * Lightweight serverless Google Sheets backup mirror using `jose` + `fetch`.
 * Avoids the heavy `googleapis` SDK (~40MB). Strictly non-blocking: failures
 * never block or fail primary PostgreSQL `/contact` persistence.
 */
export async function appendLeadToGoogleSheet(row: {
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  channel: string;
}): Promise<boolean> {
  const sheetId = process.env.GOOGLE_SHEETS_LEADS_ID;
  const credsB64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!sheetId || !credsB64) {
    return false;
  }

  try {
    const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf8")) as ServiceAccountCreds;
    const now = Math.floor(Date.now() / 1000);
    const key = await importPKCS8(creds.private_key, "RS256");

    const assertion = await new SignJWT({
      scope: "https://www.googleapis.com/auth/spreadsheets",
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuer(creds.client_email)
      .setAudience("https://oauth2.googleapis.com/token")
      .setIssuedAt(now)
      .setExpirationTime(now + 300)
      .sign(key);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) return false;

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/Leads!A:H:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              row.createdAt,
              row.fullName,
              row.email,
              row.phone,
              row.company,
              row.service,
              row.budget,
              row.channel,
            ],
          ],
        }),
      }
    );

    return appendRes.ok;
  } catch {
    return false;
  }
}
