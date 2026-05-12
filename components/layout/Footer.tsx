export function Footer() {
  return (
    <footer className="flex-shrink-0 h-12 flex items-center justify-between px-6 border-t border-[var(--divider)]">
      <p className="text-xs text-[var(--text-disabled)]">
        © {new Date().getFullYear()} Chicad Engineering · Academy Portal
      </p>
      <p className="text-xs text-[var(--text-disabled)]">
        All data encrypted · Secure connection
      </p>
    </footer>
  );
}
