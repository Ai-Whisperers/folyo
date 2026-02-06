export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Builder has custom header, no default Navbar/Footer
  return (
    <div className="min-h-screen flex flex-col builder-layout">
      {children}
    </div>
  )
}
