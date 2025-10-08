import Link from "next/link"

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary/10 to-secondary/20 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Avasta Maitsevaid Retsepte</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Liitu meie kogukonnaga ja jaga oma lemmikretsepte. Leia inspiratsiooni igapäevaseks toiduvalmistamiseks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/recipes"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Sirvi Retsepte
          </Link>
        </div>
      </div>
    </section>
  )
}
