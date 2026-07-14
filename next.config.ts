import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  /** Binary builders (PDFKit fontkit, docx, jszip) stay on Node — avoid bundling quirks. */
  serverExternalPackages: ["pdfkit", "docx", "jszip"],
};

export default nextConfig;
