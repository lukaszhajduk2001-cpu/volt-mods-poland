import { ArrowLeft, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center text-lime-400 font-bold uppercase tracking-widest mb-12 hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Wróć do sklepu
        </a>

        <h1 className="text-4xl md:text-5xl font-black text-white italic mb-8 tracking-tighter">
          SKONTAKTUJ SIĘ Z <span className="text-lime-400">NAMI</span>
        </h1>

        <div className="space-y-12">
          
          {/* Dane kontaktowe */}
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6 text-white border-b border-white/10 pb-4">
              <MessageSquare className="text-lime-400" />
              <h2 className="text-xl font-black uppercase tracking-wide">Dział Obsługi VMP</h2>
            </div>
            
            <div className="space-y-5">
                <div className="flex items-center gap-4">
                    <Mail size={24} className="text-lime-400 flex-shrink-0"/>
                    <div>
                        <span className="block text-xs uppercase tracking-widest text-slate-500">EMAIL (TECHNICZNY I ZAMÓWIENIA)</span>
                        <span className="block text-lg font-bold text-white">techsupport@vmp.pl</span>
                    </div>
                </div>

                 <div className="flex items-center gap-4">
                    <Phone size={24} className="text-lime-400 flex-shrink-0"/>
                    <div>
                        <span className="block text-xs uppercase tracking-widest text-slate-500">TELEFON (PN-PT 9:00-17:00)</span>
                        <span className="block text-lg font-bold text-white">+48 700 700 700</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MapPin size={24} className="text-lime-400 flex-shrink-0"/>
                    <div>
                        <span className="block text-xs uppercase tracking-widest text-slate-500">ADRES WYSYŁKOWY</span>
                        <span className="block text-lg font-bold text-white">UL. ELEKTRONOWA 21, 00-999 WARSZAWA</span>
                    </div>
                </div>
            </div>
          </section>

          {/* Formularz odsyłający */}
           <section className="bg-white/5 border border-lime-400/30 p-8 rounded-3xl text-center">
             <h3 className="text-xl font-black text-white mb-4">Masz pilne pytanie?</h3>
             <p className="text-slate-400 mb-6">Wypełnij formularz na stronie głównej, a odpiszemy najszybciej, jak to możliwe.</p>
             <a href="/#contact" className="bg-lime-400 text-black font-black py-3 px-8 rounded-xl uppercase tracking-widest hover:bg-lime-300 transition-all">Przejdź do formularza</a>
           </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-slate-600 uppercase tracking-widest">
          Volt Mods Poland • Kontakt dla Mistrzów
        </div>
      </div>
    </div>
  );
}