import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  /** Binary builders (PDFKit fontkit, docx, jszip) stay on Node — avoid bundling quirks. */
  serverExternalPackages: ["pdfkit", "docx", "jszip"],
  /** Phase 1E template upload — allow PDF/DOCX/ZIP up to ~10 MiB via server action. */
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
