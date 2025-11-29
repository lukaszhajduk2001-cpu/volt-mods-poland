import { ArrowLeft, Truck, Package, Clock, Scale } from 'lucide-react';

export default function DostawaPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center text-lime-400 font-bold uppercase tracking-widest mb-12 hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Wróć do sklepu
        </a>

        <h1 className="text-4xl md:text-5xl font-black text-white italic mb-8 tracking-tighter">
          DOSTAWA I <span className="text-lime-400">ZWROTY</span>
        </h1>

        <div className="space-y-12">
          
          {/* Sekcja Dostawa */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <Truck className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">1. Szybka Dostawa (24H)</h2>
            </div>
            <ul className="space-y-3 list-disc list-inside text-sm pl-4">
                <li><span className="font-bold text-white">Wysyłka:</span> Zamówienia złożone i opłacone do godziny 12:00 wysyłamy tego samego dnia roboczego.</li>
                <li><span className="font-bold text-white">Czas dostawy:</span> Przeważnie 24-48 godzin (przesyłki krajowe).</li>
                <li><span className="font-bold text-white">Przewoźnicy:</span> Korzystamy wyłącznie z usług kurierskich Premium (DHL, DPD).</li>
                
            </ul>
          </section>

          {/* Sekcja Pakowanie */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <Package className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">2. Bezpieczne Pakowanie</h2>
            </div>
            <p className="leading-relaxed text-sm">
              Każda część (zwłaszcza elektronika i ogniwa) jest zabezpieczana z najwyższą starannością. Używamy specjalistycznych opakowań kartonowych oraz folii bąbelkowej, aby mieć pewność, że sprzęt dotrze do Ciebie w stanie nienaruszonym.
            </p>
          </section>

          {/* Sekcja Zwroty */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-4 text-white">
              <Clock className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">3. Warunki Zwrotów</h2>
            </div>
            <ul className="space-y-3 list-disc list-inside text-sm pl-4">
                <li><span className="font-bold text-white">Termin:</span> 14 dni od daty otrzymania paczki (standard UE).</li>
                <li><span className="font-bold text-white">Stan towaru:</span> Akceptujemy zwroty tylko towarów nieużywanych, nienoszących śladów montażu i w oryginalnym opakowaniu.</li>
                <li><span className="font-bold text-white">Zwrot środków:</span> Do 7 dni roboczych od akceptacji zwrotu.</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-600 uppercase tracking-widest">
          Volt Mods Poland • Czas to Moc
        </div>
      </div>
    </div>
  );
}