import { useTranslation } from '@/lib/i18n';
import { COMPANY } from '@/lib/company';
import { LegalLayout, LegalContent } from '@/components/LegalLayout';

const content: Record<'en' | 'lv', LegalContent> = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: 14 July 2026',
    sections: [
      {
        heading: '1. Who is responsible for your data',
        paragraphs: [
          `The controller of your personal data is ${COMPANY.name}, registration No. ${COMPANY.regNo}, ${COMPANY.address}. For any privacy question or request, write to ${COMPANY.email}.`,
        ],
      },
      {
        heading: '2. What data we collect',
        list: [
          'Order data: your name, email address, delivery address, and the contents of your order — provided by you at checkout.',
          'Payment data: payments are processed entirely by Stripe or Paysera. We never receive or store your card number or bank credentials; we only receive confirmation that a payment succeeded.',
          'Technical data: our hosting provider keeps standard server logs (IP address, request time, browser type) for security and troubleshooting.',
        ],
      },
      {
        heading: '3. Why we process it (legal bases under GDPR)',
        list: [
          'To fulfil your order and deliver it — performance of a contract (Art. 6(1)(b)).',
          'To keep accounting records of sales — legal obligation (Art. 6(1)(c)); Latvian law requires keeping accounting source documents for 5 years.',
          'To prevent fraud and keep the service secure — legitimate interest (Art. 6(1)(f)).',
        ],
      },
      {
        heading: '4. Who we share it with',
        paragraphs: [
          'We share data only with service providers needed to run the store, and only what each of them needs:',
        ],
        list: [
          'Stripe (card payments) and Paysera (bank payments) — payment processing.',
          'Render (application hosting, Frankfurt, EU) and Neon (database, EU region) — running the store.',
          'Delivery carriers — your name, address and contact details, to deliver the order.',
        ],
      },
      {
        heading: '5. How long we keep it',
        paragraphs: [
          'Order and invoice data is kept for 5 years as required by Latvian accounting law. Other data is kept only as long as needed for the purposes above and then deleted.',
        ],
      },
      {
        heading: '6. Your rights',
        paragraphs: [
          `You may request access to your data, its correction or deletion, restriction of processing, data portability, or object to processing based on legitimate interest. Write to ${COMPANY.email} — we respond within one month.`,
          'You also have the right to lodge a complaint with the Latvian Data State Inspectorate (Datu valsts inspekcija, www.dvi.gov.lv) or the supervisory authority of your EU country of residence.',
        ],
      },
      {
        heading: '7. Cookies and local storage',
        paragraphs: [
          'This store does not use tracking or advertising cookies, which is why you see no cookie banner. Your browser\'s local storage holds only two strictly necessary values: your shopping bag identifier and your language preference. They stay on your device and are not used to profile you.',
        ],
      },
      {
        heading: '8. Changes',
        paragraphs: [
          'If we change this policy, the updated version will be published on this page with a new "last updated" date.',
        ],
      },
    ],
  },
  lv: {
    title: 'Privātuma politika',
    updated: 'Pēdējie grozījumi: 2026. gada 14. jūlijā',
    sections: [
      {
        heading: '1. Kas atbild par jūsu datiem',
        paragraphs: [
          `Jūsu personas datu pārzinis ir ${COMPANY.name}, reģistrācijas Nr. ${COMPANY.regNo}, ${COMPANY.address}. Jautājumos par privātumu rakstiet uz ${COMPANY.email}.`,
        ],
      },
      {
        heading: '2. Kādus datus mēs apkopojam',
        list: [
          'Pasūtījuma dati: vārds, e-pasta adrese, piegādes adrese un pasūtījuma saturs — tos jūs norādāt, noformējot pirkumu.',
          'Maksājumu dati: maksājumus pilnībā apstrādā Stripe vai Paysera. Mēs nesaņemam un neglabājam jūsu kartes numuru vai bankas piekļuves datus; mēs saņemam tikai apstiprinājumu, ka maksājums ir izdevies.',
          'Tehniskie dati: mūsu mitināšanas pakalpojumu sniedzējs glabā standarta servera žurnālus (IP adrese, pieprasījuma laiks, pārlūka tips) drošības un problēmu novēršanas nolūkos.',
        ],
      },
      {
        heading: '3. Kāpēc mēs tos apstrādājam (VDAR juridiskie pamati)',
        list: [
          'Lai izpildītu un piegādātu jūsu pasūtījumu — līguma izpilde (6. panta 1. punkta b) apakšpunkts).',
          'Lai kārtotu pārdošanas grāmatvedību — juridisks pienākums (6. panta 1. punkta c) apakšpunkts); Latvijas likums prasa glabāt grāmatvedības attaisnojuma dokumentus 5 gadus.',
          'Lai novērstu krāpšanu un uzturētu pakalpojuma drošību — leģitīma interese (6. panta 1. punkta f) apakšpunkts).',
        ],
      },
      {
        heading: '4. Ar ko mēs datus kopīgojam',
        paragraphs: [
          'Datus nododam tikai pakalpojumu sniedzējiem, kas nepieciešami veikala darbībai, un tikai to, kas katram no tiem vajadzīgs:',
        ],
        list: [
          'Stripe (karšu maksājumi) un Paysera (bankas maksājumi) — maksājumu apstrāde.',
          'Render (lietotnes mitināšana, Frankfurte, ES) un Neon (datubāze, ES reģions) — veikala darbība.',
          'Piegādes pakalpojumu sniedzēji — vārds, adrese un kontaktinformācija pasūtījuma piegādei.',
        ],
      },
      {
        heading: '5. Cik ilgi datus glabājam',
        paragraphs: [
          'Pasūtījumu un rēķinu datus glabājam 5 gadus, kā to prasa Latvijas grāmatvedības normatīvie akti. Pārējos datus glabājam tikai tik ilgi, cik nepieciešams iepriekš minētajiem mērķiem, un pēc tam dzēšam.',
        ],
      },
      {
        heading: '6. Jūsu tiesības',
        paragraphs: [
          `Jums ir tiesības pieprasīt piekļuvi saviem datiem, to labošanu vai dzēšanu, apstrādes ierobežošanu, datu pārnesamību, kā arī iebilst pret apstrādi, kas balstīta uz leģitīmu interesi. Rakstiet uz ${COMPANY.email} — atbildēsim viena mēneša laikā.`,
          'Jums ir arī tiesības iesniegt sūdzību Datu valsts inspekcijā (www.dvi.gov.lv) vai savas ES dzīvesvietas valsts uzraudzības iestādē.',
        ],
      },
      {
        heading: '7. Sīkdatnes un lokālā krātuve',
        paragraphs: [
          'Šis veikals neizmanto izsekošanas vai reklāmas sīkdatnes, tāpēc sīkdatņu paziņojums nav nepieciešams. Jūsu pārlūka lokālajā krātuvē tiek glabātas tikai divas obligāti nepieciešamas vērtības: iepirkumu groza identifikators un izvēlētā valoda. Tās paliek jūsu ierīcē un netiek izmantotas profilēšanai.',
        ],
      },
      {
        heading: '8. Grozījumi',
        paragraphs: [
          'Ja šī politika tiks mainīta, atjauninātā redakcija tiks publicēta šajā lapā ar jaunu grozījumu datumu.',
        ],
      },
    ],
  },
};

export default function Privacy() {
  const { language } = useTranslation();
  return <LegalLayout content={content[language]} />;
}
