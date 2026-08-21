import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "StackPrep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const topicColors = [
  "#f0a25c",
  "#6fcf7a",
  "#5fb8cf",
  "#7f9fd6",
  "#ef6b6b",
  "#d08a68",
  "#4fa8e0",
  "#e0b84f",
];

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "home" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 80% 0%, rgba(239,79,143,0.35), transparent 55%), radial-gradient(circle at 0% 60%, rgba(148,87,232,0.3), transparent 55%), #170f1e",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(90deg, #f9863c, #ef4f8f, #9457e8)",
            }}
          />
          <span
            style={{ fontSize: "34px", fontWeight: 700, color: "#f8f4fb" }}
          >
            StackPrep
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 800,
            color: "#f8f4fb",
            lineHeight: 1.15,
            maxWidth: "980px",
          }}
        >
          {t("titlePrefix")} {t("titleHighlight")} {t("titleSuffix")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "36px",
            fontSize: "28px",
            color: "#b7abc4",
            maxWidth: "820px",
          }}
        >
          {t("subtitle")}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "56px" }}>
          {topicColors.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                width: "40px",
                height: "10px",
                borderRadius: "999px",
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
