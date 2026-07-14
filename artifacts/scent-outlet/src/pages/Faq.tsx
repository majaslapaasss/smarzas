import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTranslation } from '@/lib/i18n';
import { COMPANY } from '@/lib/company';

interface FaqEntry {
  q: string;
  a: string;
}

const content: Record<'en' | 'lv', { title: string; intro: string; items: FaqEntry[] }> = {
  en: {
    title: 'Frequently Asked Questions',
    intro: "Quick answers to the questions we hear most often. Can't find yours? Just contact us.",
    items: [
      {
        q: 'Are your perfumes authentic?',
        a: 'Yes. We sell only original fragrances sourced from authorised distributors. Every product is brand new and factory sealed.',
      },
      {
        q: 'Which payment methods do you accept?',
        a: 'Card payments (Visa, Mastercard and others, processed by Stripe) and bank link or wallet payments via Paysera. All payments are handled on the provider\'s secure page — we never see your card details.',
      },
      {
        q: 'How much does delivery cost and how long does it take?',
        a: 'We deliver to Omniva, DPD, and Venipak parcel lockers in Latvia, Lithuania, and Estonia — you pick the locker at checkout. Prices start at €2.99 depending on the carrier and country, and delivery is free for orders of €50 or more. In Latvia parcels arrive in 1–3 business days after dispatch; in Lithuania and Estonia, 2–5.',
      },
      {
        q: 'Can I return a perfume?',
        a: 'Unopened products can be returned within 14 days of delivery, no questions asked. For hygiene reasons, opened (unsealed) perfumes cannot be returned unless they are defective — this is a standard EU rule for cosmetics.',
      },
      {
        q: 'How do I know my order went through?',
        a: 'After a successful payment you are redirected to an order confirmation page with your order number. If you paid but see "awaiting payment", the confirmation usually arrives within a minute — the page updates automatically.',
      },
      {
        q: 'How can I reach you?',
        a: `Email us at ${COMPANY.email} — we reply within 1–2 business days. Include your order number for the fastest help.`,
      },
    ],
  },
  lv: {
    title: 'Biežāk uzdotie jautājumi',
    intro: 'Ātras atbildes uz biežāk dzirdētajiem jautājumiem. Neatradāt savējo? Sazinieties ar mums.',
    items: [
      {
        q: 'Vai jūsu smaržas ir oriģinālas?',
        a: 'Jā. Mēs pārdodam tikai oriģinālas smaržas, kas iegādātas no autorizētiem izplatītājiem. Visas preces ir jaunas un rūpnieciski aizzīmogotas.',
      },
      {
        q: 'Kādus maksājumu veidus jūs pieņemat?',
        a: 'Karšu maksājumus (Visa, Mastercard un citas; apstrādā Stripe) un banklink vai maka maksājumus caur Paysera. Visi maksājumi notiek pakalpojumu sniedzēja drošajā lapā — mēs jūsu kartes datus neredzam.',
      },
      {
        q: 'Cik maksā piegāde un cik ilgi tā aizņem?',
        a: 'Piegādājam uz Omniva, DPD un Venipak pakomātiem Latvijā, Lietuvā un Igaunijā — pakomātu izvēlaties, noformējot pasūtījumu. Cenas sākas no 2,99 EUR atkarībā no piegādātāja un valsts, un pasūtījumiem no 50 EUR piegāde ir bez maksas. Latvijā sūtījums pienāk 1–3 darba dienās pēc nosūtīšanas; Lietuvā un Igaunijā — 2–5.',
      },
      {
        q: 'Vai smaržas var atgriezt?',
        a: 'Neatvērtas preces var atgriezt 14 dienu laikā no saņemšanas bez iemesla norādīšanas. Higiēnas apsvērumu dēļ atvērtas smaržas atgriezt nevar, ja vien tās nav ar trūkumiem — tas ir standarta ES noteikums kosmētikai.',
      },
      {
        q: 'Kā zināt, ka pasūtījums ir izdevies?',
        a: 'Pēc veiksmīgas apmaksas jūs nonākat pasūtījuma apstiprinājuma lapā ar pasūtījuma numuru. Ja esat samaksājis, bet redzat "gaida apmaksu", apstiprinājums parasti pienāk minūtes laikā — lapa atjaunojas automātiski.',
      },
      {
        q: 'Kā ar jums sazināties?',
        a: `Rakstiet uz ${COMPANY.email} — atbildam 1–2 darba dienu laikā. Ātrākai palīdzībai norādiet pasūtījuma numuru.`,
      },
    ],
  },
};

export default function Faq() {
  const { language } = useTranslation();
  const c = content[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-4">
        {c.title}
      </h1>
      <p className="text-lg text-muted-foreground mb-12">{c.intro}</p>

      <Accordion type="single" collapsible className="w-full">
        {c.items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-medium">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
