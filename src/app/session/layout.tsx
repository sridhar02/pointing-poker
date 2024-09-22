import { Navbar } from "../_components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
