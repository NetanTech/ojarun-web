import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Link-preview picture for WhatsApp, Facebook, X etc. Next.js turns this into
 * /opengraph-image and adds the og:image tags to every page automatically.
 */
export const alt = "Ojarun — fresh market food delivered to your doorstep in Ibadan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function dataUrl(relativePath: string): Promise<string> {
  const file = await readFile(join(process.cwd(), relativePath));
  return `data:image/png;base64,${file.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [logo, bag] = await Promise.all([
    dataUrl("src/app/icon.png"),
    dataUrl("public/assets/groceries-bag.png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#004a19",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 80px",
            width: 700,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={96} height={96} alt="" style={{ borderRadius: 20 }} />
            <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>Ojarun</div>
          </div>
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15, marginTop: 40 }}>
            Bringing the Market to Your Doorstep
          </div>
          <div style={{ fontSize: 30, marginTop: 24, color: "#C8E6C9", lineHeight: 1.35 }}>
            Fresh food from local markets, picked by trained agents and delivered in Ibadan.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              background: "white",
              color: "#004a19",
              fontSize: 28,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
              alignSelf: "flex-start",
            }}
          >
            www.ojarun.com
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bag} width={428} height={482} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
