export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-xs text-muted">
      <p>© {new Date().getFullYear()} Goddess Pixie. All rights reserved.</p>
      <p className="mt-1">18+ only. All models depicted are of legal age.</p>
      {/* TODO: if you keep 2257 records, add a real custodian-of-records statement here. */}
    </footer>
  );
}
