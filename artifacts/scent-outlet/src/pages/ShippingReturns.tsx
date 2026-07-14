import { useTranslation } from '@/lib/i18n';
import { COMPANY } from '@/lib/company';
import { LegalLayout, LegalContent } from '@/components/LegalLayout';

const content: Record<'en' | 'lv', LegalContent> = {
  en: {
    title: 'Shipping & Returns',
    sections: [
      {
        heading: 'Delivery',
        paragraphs: [
          'We deliver to parcel lockers and pickup points via Omniva, DPD, and Venipak. You choose the carrier and the exact locker at checkout.',
        ],
        list: [
          'Latvia: from €2.99 depending on the carrier.',
          'Lithuania and Estonia: from €4.99 depending on the carrier.',
          'Free delivery on all orders of €50.00 or more.',
          'The exact cost is always shown at checkout before you pay.',
        ],
      },
      {
        heading: 'Delivery times',
        paragraphs: [
          'Orders are dispatched within 1–2 business days after payment is confirmed. Estimated delivery after dispatch:',
        ],
        list: [
          'Latvia: 1–3 business days.',
          'Lithuania and Estonia: 2–5 business days.',
        ],
      },
      {
        heading: 'Returns — the 14-day right of withdrawal',
        paragraphs: [
          'You may return your order within 14 days of receiving it, without giving a reason. Email us at ' +
            COMPANY.email +
            ' with your order number, and send the goods back within 14 days of your notice.',
          'Please note the hygiene exception: an unsealed (opened) perfume cannot be returned under the right of withdrawal — this is an EU-wide rule for cosmetics. Returned products must be unopened, with the protective seal intact.',
        ],
      },
      {
        heading: 'Refunds',
        list: [
          'We refund the full amount, including the original standard delivery fee, within 14 days of receiving the return.',
          'The refund goes back to the payment method you used (card or Paysera).',
          'Return shipping is paid by you, unless the product was defective or we sent the wrong item — then we cover it.',
        ],
      },
      {
        heading: 'Damaged or wrong items',
        paragraphs: [
          `If your order arrives damaged or incorrect, contact us at ${COMPANY.email} within a reasonable time with a photo of the item and packaging. We will replace it or refund you, including all shipping costs. The statutory 2-year conformity guarantee applies to every product.`,
        ],
      },
    ],
  },
  lv: {
    title: 'Piegāde un atgriešana',
    sections: [
      {
        heading: 'Piegāde',
        paragraphs: [
          'Mēs piegādājam uz pakomātiem un saņemšanas vietām ar Omniva, DPD un Venipak. Piegādātāju un konkrēto pakomātu jūs izvēlaties, noformējot pasūtījumu.',
        ],
        list: [
          'Latvijā: no 2,99 EUR atkarībā no piegādātāja.',
          'Lietuvā un Igaunijā: no 4,99 EUR atkarībā no piegādātāja.',
          'Bezmaksas piegāde visiem pasūtījumiem no 50,00 EUR.',
          'Precīzās izmaksas vienmēr redzamas pirms apmaksas, noformējot pasūtījumu.',
        ],
      },
      {
        heading: 'Piegādes termiņi',
        paragraphs: [
          'Pasūtījumi tiek nosūtīti 1–2 darba dienu laikā pēc maksājuma apstiprināšanas. Aptuvenais piegādes laiks pēc nosūtīšanas:',
        ],
        list: [
          'Latvijā: 1–3 darba dienas.',
          'Lietuvā un Igaunijā: 2–5 darba dienas.',
        ],
      },
      {
        heading: 'Atgriešana — 14 dienu atteikuma tiesības',
        paragraphs: [
          `Jūs varat atgriezt pasūtījumu 14 dienu laikā no tā saņemšanas, nenorādot iemeslu. Rakstiet mums uz ${COMPANY.email}, norādot pasūtījuma numuru, un nosūtiet preces atpakaļ 14 dienu laikā pēc paziņojuma.`,
          'Lūdzu, ņemiet vērā higiēnas izņēmumu: atvērtas smaržas nevar atgriezt atteikuma tiesību ietvaros — tas ir ES mēroga noteikums kosmētikai. Atgriežamajām precēm jābūt neatvērtām, ar neskartu aizsargplēvi.',
        ],
      },
      {
        heading: 'Naudas atmaksa',
        list: [
          'Mēs atmaksājam pilnu summu, ieskaitot sākotnējo standarta piegādes maksu, 14 dienu laikā pēc atgriezto preču saņemšanas.',
          'Atmaksa tiek veikta uz to pašu maksājuma veidu, kuru izmantojāt (karte vai Paysera).',
          'Atpakaļsūtīšanas izmaksas sedzat jūs, izņemot, ja prece bija ar trūkumiem vai nosūtījām nepareizu preci — tad izmaksas sedzam mēs.',
        ],
      },
      {
        heading: 'Bojātas vai nepareizas preces',
        paragraphs: [
          `Ja pasūtījums pienāk bojāts vai nepareizs, sazinieties ar mums, rakstot uz ${COMPANY.email}, un pievienojiet preces un iepakojuma foto. Mēs preci apmainīsim vai atmaksāsim naudu, ieskaitot visas piegādes izmaksas. Katrai precei ir spēkā likumā noteiktā 2 gadu atbilstības garantija.`,
        ],
      },
    ],
  },
};

export default function ShippingReturns() {
  const { language } = useTranslation();
  return <LegalLayout content={content[language]} />;
}
