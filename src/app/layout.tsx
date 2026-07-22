import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ome Theophilus — Developer, AI Builder, Automation Engineer",
  description:
    "I build AI-powered systems, automation pipelines, and full-stack applications. From multi-agent orchestrators to mobile apps — I ship products that work.",
  keywords: ["Developer", "AI Builder", "Automation Engineer", "Nairobi", "Full-Stack", "React Native", "AWS Bedrock"],
  authors: [{ name: "Ome Theophilus" }],
  openGraph: {
    title: "Ome Theophilus — Developer, AI Builder, Automation Engineer",
    description: "I build AI-powered systems, automation pipelines, and full-stack applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ background: "#161416" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
