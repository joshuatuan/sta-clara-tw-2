export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[80svh] w-full h-full flex flex-col items-center justify-center gap-10 p-6">
      {children}
    </div>
  );
}
