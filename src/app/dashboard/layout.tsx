import NavBar from "../../components/ui/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NavBar />
      {children}
    </html>
  );
}
