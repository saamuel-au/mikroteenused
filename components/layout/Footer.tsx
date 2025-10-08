export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Retseptide Portaal</h3>
            <p className="text-muted-foreground">Avasta ja jaga maitsevaid retsepte meie kogukonnaga.</p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Lingid</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary">
                  Avaleht
                </a>
              </li>
              <li>
                <a href="/recipes" className="text-muted-foreground hover:text-primary">
                  Retseptid
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Kontakt</h4>
            <p className="text-muted-foreground">info@retseptideportaal.ee</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© 2025 Retseptide Portaal. Kõik õigused kaitstud.</p>
        </div>
      </div>
    </footer>
  )
}
