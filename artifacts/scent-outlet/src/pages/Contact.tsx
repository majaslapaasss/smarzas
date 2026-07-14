import { useEffect } from 'react';
import { Mail, Building2, Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { COMPANY } from '@/lib/company';

const content = {
  en: {
    title: 'Contact Us',
    intro:
      "Questions about an order, a return, or a fragrance? We're happy to help.",
    emailHeading: 'Email',
    emailNote: 'The fastest way to reach us — include your order number if you have one.',
    companyHeading: 'Company details',
    responseHeading: 'Response time',
    responseNote: 'We reply within 1–2 business days.',
  },
  lv: {
    title: 'Sazinieties ar mums',
    intro:
      'Jautājumi par pasūtījumu, atgriešanu vai smaržām? Mēs labprāt palīdzēsim.',
    emailHeading: 'E-pasts',
    emailNote: 'Ātrākais veids, kā ar mums sazināties — norādiet pasūtījuma numuru, ja tāds ir.',
    companyHeading: 'Uzņēmuma rekvizīti',
    responseHeading: 'Atbildes laiks',
    responseNote: 'Mēs atbildam 1–2 darba dienu laikā.',
  },
} as const;

export default function Contact() {
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

      <div className="space-y-6">
        <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl">
          <h2 className="flex items-center font-medium text-lg mb-2">
            <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
            {c.emailHeading}
          </h2>
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-primary font-medium hover:underline break-all"
          >
            {COMPANY.email}
          </a>
          <p className="text-sm text-muted-foreground mt-2">{c.emailNote}</p>
        </div>

        <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl">
          <h2 className="flex items-center font-medium text-lg mb-2">
            <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
            {c.companyHeading}
          </h2>
          <p className="text-muted-foreground">{COMPANY.name}</p>
          <p className="text-muted-foreground">Reg. Nr. {COMPANY.regNo}</p>
          <p className="text-muted-foreground">{COMPANY.address}</p>
        </div>

        <div className="bg-secondary/20 p-6 md:p-8 rounded-3xl">
          <h2 className="flex items-center font-medium text-lg mb-2">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            {c.responseHeading}
          </h2>
          <p className="text-muted-foreground">{c.responseNote}</p>
        </div>
      </div>
    </div>
  );
}
