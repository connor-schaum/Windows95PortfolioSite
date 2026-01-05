import "./globals.css";

export const metadata = {
  title: "Connor's Portfolio - Windows 95",
  description: "Personal portfolio website with Windows 95 nostalgia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
