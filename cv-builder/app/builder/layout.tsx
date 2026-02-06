export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Builder has custom header, no default Navbar/Footer
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {children}
    </div>
  )
}
