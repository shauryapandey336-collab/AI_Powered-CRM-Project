import "./globals.css";
import QueryProvider from "@/components/common/QueryProvider";
import { AuthProvider } from "@/components/common/AuthContext";

export const metadata = {
  title: "LeadFlow AI | Enterprise AI CRM Platform",
  description: "Production-ready AI-powered SaaS Lead Management and Scoring Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
