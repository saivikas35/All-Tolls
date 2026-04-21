import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";

export const metadata = {
  title: "AllTools",
  description: "All-in-one file conversion & productivity suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Picker API */}
        <Script
          src="https://apis.google.com/js/api.js"
          strategy="beforeInteractive"
        />

        {/* Google Identity Services (OAuth) */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />

        {/* ✅ Dropbox Chooser SDK (REQUIRED for Dropbox to work) */}
        <Script
          id="dropboxjs"
          src="https://www.dropbox.com/static/api/2/dropins.js"
          data-app-key="2t2su51ec3xgf1u"
          strategy="beforeInteractive"
        />
      </head>

      <body className="bg-gray-50">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
