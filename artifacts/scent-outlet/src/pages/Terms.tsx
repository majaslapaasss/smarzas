import { useTranslation } from '@/lib/i18n';
import { COMPANY } from '@/lib/company';
import { LegalLayout, LegalContent } from '@/components/LegalLayout';

const content: Record<'en' | 'lv', LegalContent> = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: 14 July 2026',
    sections: [
      {
        heading: '1. About us and these terms',
        paragraphs: [
          `The Perfume Baltic online store is operated by ${COMPANY.name}, registration No. ${COMPANY.regNo}, registered address: ${COMPANY.address} ("we", "us"). You can reach us at ${COMPANY.email}.`,
          'These terms apply to every order placed in this store. By placing an order you confirm that you have read and agree to these terms. Statutory consumer rights under Latvian and EU law always apply and are not limited by anything in these terms.',
        ],
      },
      {
        heading: '2. Ordering and contract',
        paragraphs: [
          'An order placed at checkout constitutes an offer to purchase the selected products. The distance contract is concluded when we confirm the order after successful payment. If a product turns out to be unavailable, we will contact you and refund the affected amount in full.',
          'Product images are illustrative; packaging may vary between manufacturer batches.',
        ],
      },
      {
        heading: '3. Prices and payment',
        paragraphs: [
          'All prices are in euros (EUR) and include applicable value added tax. The total payable, including delivery, is shown at checkout before you confirm the order.',
          'Payment is processed by our payment providers: Stripe (card payments) and Paysera (bank links and wallet). We never receive or store your card details. An order is only confirmed once the payment provider reports a successful payment.',
        ],
      },
      {
        heading: '4. Delivery',
        paragraphs: [
          'We deliver to parcel lockers and pickup points in Latvia, Lithuania, and Estonia via Omniva, DPD, and Venipak. The delivery price depends on the carrier and destination country and is always shown at checkout before you pay; orders of €50.00 or more ship free. Estimated delivery times are described on the Shipping & Returns page.',
          'Risk of loss or damage to the products passes to you when you (or a person designated by you) take physical possession of them.',
        ],
      },
      {
        heading: '5. Right of withdrawal (14 days)',
        paragraphs: [
          'As a consumer in the EU, you may withdraw from the purchase within 14 days of receiving the goods, without giving any reason. To exercise this right, notify us within that period by email to ' +
            COMPANY.email +
            ' with your order number, and return the goods without undue delay and no later than 14 days after your notice.',
          'Important exception: for hygiene reasons, the right of withdrawal does not apply to perfumes and cosmetics that have been unsealed after delivery (Consumer Rights Directive 2011/83/EU, Art. 16(e); Latvian Cabinet Regulation No. 255). An opened or used perfume cannot be returned unless it is defective.',
          'We refund all payments received from you, including standard delivery costs, within 14 days of receiving the returned goods or proof of their return, using the same payment method you used. You bear the direct cost of returning the goods.',
        ],
      },
      {
        heading: '6. Legal warranty',
        paragraphs: [
          'All products are covered by the statutory conformity guarantee: if a product does not conform to the contract (e.g. it is damaged or not as described), you may invoke your legal remedies within two years of delivery — repair, replacement, price reduction, or refund, as provided by law.',
        ],
      },
      {
        heading: '7. Complaints and dispute resolution',
        paragraphs: [
          `If something is wrong, contact us first at ${COMPANY.email} — we aim to resolve every complaint within 15 working days.`,
          'If we cannot resolve a dispute, you may contact the Latvian Consumer Rights Protection Centre (Patērētāju tiesību aizsardzības centrs, www.ptac.gov.lv) or use the EU online dispute resolution platform at ec.europa.eu/odr.',
        ],
      },
      {
        heading: '8. Liability',
        paragraphs: [
          'To the extent permitted by law, our liability for any order is limited to the amount paid for that order. Nothing in these terms limits liability that cannot be limited by law or your mandatory statutory rights as a consumer.',
        ],
      },
      {
        heading: '9. Governing law and changes',
        paragraphs: [
          'These terms are governed by the laws of the Republic of Latvia. Consumers additionally retain any mandatory protections of their country of residence within the EU.',
          'We may update these terms from time to time; the version published at the time of your order applies to that order.',
        ],
      },
    ],
  },
  lv: {
    title: 'Lietošanas noteikumi',
    updated: 'Pēdējie grozījumi: 2026. gada 14. jūlijā',
    sections: [
      {
        heading: '1. Par mums un šiem noteikumiem',
        paragraphs: [
          `Interneta veikalu Perfume Baltic uztur ${COMPANY.name}, reģistrācijas Nr. ${COMPANY.regNo}, juridiskā adrese: ${COMPANY.address} ("mēs"). Ar mums var sazināties, rakstot uz ${COMPANY.email}.`,
          'Šie noteikumi attiecas uz katru šajā veikalā veikto pasūtījumu. Veicot pasūtījumu, jūs apliecināt, ka esat iepazinies ar noteikumiem un tiem piekrītat. Latvijas un ES normatīvajos aktos noteiktās patērētāju tiesības vienmēr ir spēkā, un šie noteikumi tās neierobežo.',
        ],
      },
      {
        heading: '2. Pasūtījuma veikšana un līgums',
        paragraphs: [
          'Pasūtījums, kas veikts, noformējot pirkumu, ir piedāvājums iegādāties izvēlētās preces. Distances līgums ir noslēgts brīdī, kad mēs apstiprinām pasūtījumu pēc veiksmīgas apmaksas. Ja kāda prece izrādās nepieejama, mēs ar jums sazināsimies un pilnā apmērā atmaksāsim attiecīgo summu.',
          'Preču attēliem ir ilustratīva nozīme; iepakojums dažādās ražotāja partijās var atšķirties.',
        ],
      },
      {
        heading: '3. Cenas un apmaksa',
        paragraphs: [
          'Visas cenas ir norādītas eiro (EUR) un ietver pievienotās vērtības nodokli. Kopējā maksājamā summa, ieskaitot piegādi, tiek parādīta pirms pasūtījuma apstiprināšanas.',
          'Maksājumus apstrādā mūsu maksājumu pakalpojumu sniedzēji: Stripe (karšu maksājumi) un Paysera (banklink un maks). Mēs nesaņemam un neglabājam jūsu kartes datus. Pasūtījums tiek apstiprināts tikai pēc tam, kad maksājumu sniedzējs apliecina veiksmīgu apmaksu.',
        ],
      },
      {
        heading: '4. Piegāde',
        paragraphs: [
          'Mēs piegādājam uz pakomātiem un saņemšanas vietām Latvijā, Lietuvā un Igaunijā ar Omniva, DPD un Venipak. Piegādes cena ir atkarīga no piegādātāja un galamērķa valsts, un tā vienmēr redzama pirms apmaksas; pasūtījumiem no 50,00 EUR piegāde ir bez maksas. Aptuvenie piegādes termiņi aprakstīti lapā "Piegāde un atgriešana".',
          'Preču nejaušas nozaudēšanas vai bojājuma risks pāriet uz jums brīdī, kad jūs (vai jūsu norādīta persona) saņemat preces savā valdījumā.',
        ],
      },
      {
        heading: '5. Atteikuma tiesības (14 dienas)',
        paragraphs: [
          `Kā patērētājam ES jums ir tiesības 14 dienu laikā no preču saņemšanas atkāpties no pirkuma, nenorādot iemeslu. Lai izmantotu šīs tiesības, šajā termiņā paziņojiet mums, rakstot uz ${COMPANY.email} un norādot pasūtījuma numuru, un nosūtiet preces atpakaļ bez nepamatotas kavēšanās, bet ne vēlāk kā 14 dienu laikā pēc paziņojuma.`,
          'Svarīgs izņēmums: higiēnas apsvērumu dēļ atteikuma tiesības neattiecas uz smaržām un kosmētiku, kam pēc piegādes ir atvērts iepakojums (Direktīvas 2011/83/ES 16. panta e) punkts; MK noteikumi Nr. 255). Atvērtas vai lietotas smaržas nevar atgriezt, ja vien tās nav ar trūkumiem.',
          'Mēs atmaksājam visus no jums saņemtos maksājumus, ieskaitot standarta piegādes izmaksas, 14 dienu laikā pēc atgriezto preču vai to nosūtīšanas apliecinājuma saņemšanas, izmantojot to pašu maksājuma veidu. Preču atpakaļsūtīšanas tiešās izmaksas sedzat jūs.',
        ],
      },
      {
        heading: '6. Likumiskā garantija',
        paragraphs: [
          'Visām precēm ir spēkā likumā noteiktā atbilstības garantija: ja prece neatbilst līguma noteikumiem (piemēram, tā ir bojāta vai neatbilst aprakstam), jūs divu gadu laikā no piegādes varat izmantot likumā paredzētos tiesiskās aizsardzības līdzekļus — remontu, apmaiņu, cenas samazinājumu vai naudas atmaksu.',
        ],
      },
      {
        heading: '7. Sūdzības un strīdu risināšana',
        paragraphs: [
          `Ja kaut kas nav kārtībā, vispirms sazinieties ar mums, rakstot uz ${COMPANY.email} — mēs cenšamies atrisināt katru sūdzību 15 darba dienu laikā.`,
          'Ja strīdu neizdodas atrisināt, jūs varat vērsties Patērētāju tiesību aizsardzības centrā (www.ptac.gov.lv) vai izmantot ES strīdu izšķiršanas tiešsaistes platformu ec.europa.eu/odr.',
        ],
      },
      {
        heading: '8. Atbildība',
        paragraphs: [
          'Ciktāl to pieļauj likums, mūsu atbildība par jebkuru pasūtījumu ir ierobežota ar summu, kas samaksāta par attiecīgo pasūtījumu. Nekas šajos noteikumos neierobežo atbildību, ko nevar ierobežot ar likumu, vai jūsu obligātās patērētāja tiesības.',
        ],
      },
      {
        heading: '9. Piemērojamais likums un grozījumi',
        paragraphs: [
          'Šiem noteikumiem piemērojami Latvijas Republikas normatīvie akti. Patērētāji papildus saglabā savas ES dzīvesvietas valsts obligātās aizsardzības normas.',
          'Mēs varam laiku pa laikam atjaunināt šos noteikumus; uz pasūtījumu attiecas tā redakcija, kas publicēta pasūtījuma veikšanas brīdī.',
        ],
      },
    ],
  },
};

export default function Terms() {
  const { language } = useTranslation();
  return <LegalLayout content={content[language]} />;
}
