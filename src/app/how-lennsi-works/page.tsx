import Header from "@/components/ui/header"
import CtaButton from "@/features/landing/components/cta-button"
import StepOne from "@/features/hlw/components/step-one"
import StepTwo from "@/features/hlw/components/step-two"
import StepThree from "@/features/hlw/components/step-three"
import StepFour from "@/features/hlw/components/step-four"
import FooterCta from "@/components/ui/footer-cta"
import Footer from "@/components/ui/footer"

export default function HowLennsiWorksPage() {

  return (
    <div>
      <Header />
      <div className="min-h-screen flex justify-center items-center bg-sand/60">
        <div className="max-w-4xl flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl  lg:tracking-tighter font-semibold text-charcoal">Tu restaurante conectado, paso a paso.</h1>
          <p className="max-w-150 text-lg text-muted-foreground">
            Acerca tu menú, promociones y redes sociales a cada mesa con Lennsi. Prepara tu contenido, conecta tus etiquetas NFC y descubre cómo interactúan tus clientes.
          </p>
          <CtaButton
            link="/login"
            className="bg-primary hover:bg-charcoal cursor-pointer"
            text="Crear mi cuenta"
          />
        </div>
      </div>
      <main className="min-h-screen -mt-24 pb-25 rounded-t-[60px] bg-white">
        <section className="max-w-7xl mx-auto px-4 py-30 flex flex-col gap-20">
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="flex gap-6">
              <div className="flex flex-col gap-8">
                <span className="text-5xl font-bold">01.</span>
                <div className="w-[1.5px] h-full mx-auto bg-[repeating-linear-gradient(to_bottom,#e5e5e5,#e5e5e5_6px,transparent_8px,transparent_12px)]" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-5xl font-semibold tracking-tighter">Dale un lugar a cada conexión.</p>
                <p className="text-xl text-muted-foreground">Crea tu restaurante, añade tus sucursales y define dónde colocarás tus etiquetas: mesas, barra, terraza o entrada. Cada espacio será un punto de contacto con tus clientes.</p>
                <CtaButton
                  link="/"
                  text="Aprender más"
                  className="w-fit mt-6 border border-transparent text-charcoal hover:text-charcoal bg-muted hover:bg-muted hover:border-input"
                />
              </div>
            </div>
            <StepOne />
          </div>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="flex gap-6">
              <div className="flex flex-col gap-8">
                <span className="text-5xl font-bold">02.</span>
                <div className="w-[1.5px] h-full mx-auto bg-[repeating-linear-gradient(to_bottom,#e5e5e5,#e5e5e5_6px,transparent_8px,transparent_12px)]" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-5xl font-semibold tracking-tighter">Prepara lo que quieres compartir.</p>
                <p className="text-xl text-muted-foreground">Reúne los enlaces a tu menú, promociones, redes sociales y reseñas de Google. Personaliza cómo se presentan y actualízalos desde tu panel cuando tengas algo nuevo que mostrar.</p>
                <CtaButton
                  link="/"
                  text="Aprender más"
                  className="w-fit mt-6 border border-transparent text-charcoal hover:text-charcoal bg-muted hover:bg-muted hover:border-input"
                />
              </div>
            </div>
            <StepTwo />
          </div>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="flex gap-6">
              <div className="flex flex-col gap-8">
                <span className="text-5xl font-bold">03.</span>
                <div className="w-[1.5px] h-full mx-auto bg-[repeating-linear-gradient(to_bottom,#e5e5e5,#e5e5e5_6px,transparent_8px,transparent_12px)]" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-5xl font-semibold tracking-tighter">Conecta cada mesa con un toque.</p>
                <p className="text-xl text-muted-foreground">Asocia cada etiqueta a su punto de contacto, graba su enlace en ella y colócala en el lugar elegido. Tus clientes podrán abrir tu contenido acercando un teléfono compatible con NFC y con acceso a internet.</p>
                <CtaButton
                  link="/"
                  text="Aprender más"
                  className="w-fit mt-6 border border-transparent text-charcoal hover:text-charcoal bg-muted hover:bg-muted hover:border-input"
                />
              </div>
            </div>
            <StepThree />
          </div>
          <div className="grid lg:grid-cols-2 gap-20">
            <div className="flex gap-6">
              <div className="flex flex-col gap-8">
                <span className="text-5xl font-bold">04.</span>
                <div className="w-[1.5px] h-full mx-auto bg-[repeating-linear-gradient(to_bottom,#e5e5e5,#e5e5e5_6px,transparent_8px,transparent_12px)]" />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-5xl font-semibold tracking-tighter">Descubre qué les interesa.</p>
                <p className="text-xl text-muted-foreground">Consulta los accesos y las interacciones desde tu panel. Explora la actividad por sucursal y punto de contacto, identifica los enlaces más utilizados y usa esa información para ajustar tu contenido.</p>
                <CtaButton
                  link="/"
                  text="Aprender más"
                  className="w-fit mt-6 border border-transparent text-charcoal hover:text-charcoal bg-muted hover:bg-muted hover:border-input"
                />
              </div>
            </div>
            <StepFour />
          </div>
        </section>
      </main>
      <FooterCta />
      <Footer />
    </div>
  )
}
