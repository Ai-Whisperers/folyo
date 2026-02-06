export default function CVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Clean layout - no nav/footer for CV viewing
  return <>{children}</>
}
