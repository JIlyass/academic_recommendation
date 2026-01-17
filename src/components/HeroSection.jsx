import {Link} from "react-router-dom"
export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Discover Your Academic Path
        </h1>
        <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          Leverage artificial intelligence to predict your ideal academic specialty and unlock your full potential.
        </p>
       
        <div className="flex gap-4 justify-center flex-wrap">
         <Link to="/predict">
          <button className="px-8 hover:cursor-pointer hover:bg-amber-800 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors theme-transition">
            Get Started
        </button>
         
        </Link>
          <Link to="/feautures">
          <button className="px-8 py-3 hover:bg-black hover:text-white hover:cursor-pointer border border-border text-foreground rounded-lg font-semibold hover:bg-accent transition-colors theme-transition">
            Features
          </button>
          
          </Link>
        </div>
      </div>
    </section>
  )
}
