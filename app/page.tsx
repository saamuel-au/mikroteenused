import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/home/Hero"
import FeaturedRecipes from "@/components/home/FeaturedRecipes"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedRecipes />
      </main>
      <Footer />
    </div>
  )
}
