export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <header className="flex items-center justify-center p-4 bg-[#8b0000] text-white">
          <h1 className="font-bold text-4xl">BYTEats</h1>
        </header>
        <main>{children}</main>
    </>
  );
}
