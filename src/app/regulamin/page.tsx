import { ArrowLeft, ShieldCheck, Scale, RefreshCw } from 'lucide-react';

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Używamy standardowego tagu <a> zamiast Link dla kompatybilności */}
        <a href="/" className="inline-flex items-center text-lime-400 font-bold uppercase tracking-widest mb-12 hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Wróć do sklepu
        </a>

        <h1 className="text-4xl md:text-5xl font-black text-white italic mb-8 tracking-tighter">
          REGULAMIN <span className="text-lime-400">VMP</span>
        </h1>

        <div className="space-y-12">
          {/* Sekcja 1 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <Scale className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">1. Postanowienia Ogólne</h2>
            </div>
            <p className="leading-relaxed text-sm">
              Sklep internetowy Volt Mods Poland (VMP) zajmuje się sprzedażą części tuningowych do pojazdów elektrycznych. 
              Dokonując zakupu, klient oświadcza, że zapoznał się z opisem produktu. Części tuningowe (off-road) mogą nie posiadać homologacji drogowej.
            </p>
          </section>

          {/* Sekcja 2 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <ShieldCheck className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">2. Gwarancja i Odpowiedzialność</h2>
            </div>
            <p className="leading-relaxed text-sm">
              Udzielamy gwarancji rozruchowej na podzespoły elektroniczne. VMP nie ponosi odpowiedzialności za niewłaściwy montaż części 
              przez osoby nieuprawnione. Zalecamy montaż w autoryzowanych serwisach. Modyfikacje sterownika mogą wpływać na żywotność silnika.
            </p>
          </section>

          {/* Sekcja 3 */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <RefreshCw className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">3. Zwroty i Reklamacje</h2>
            </div>
            <p className="leading-relaxed text-sm">
              Klient ma prawo do zwrotu towaru w stanie nienaruszonym w ciągu 14 dni od otrzymania przesyłki. 
              Części noszące ślady montażu nie podlegają zwrotowi. Zwrot środków następuje na konto bankowe klienta w ciągu 7 dni roboczych.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-600 uppercase tracking-widest">
          Volt Mods Poland © 2025 • Engineering Dept.
        </div>
      </div>
    </div>
  );
}