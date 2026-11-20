export default function Footer() {
  return (
    <footer className="h-12 bg-surface border-t border-gray-200/50 flex items-center justify-between px-8 text-xs text-gray-400 font-medium">
      <p>© {new Date().getFullYear()} Splitwise Friends. Todos los derechos reservados.</p>
    </footer>
  )
}
