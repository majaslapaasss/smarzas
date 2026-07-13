import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'lv';

const STORAGE_KEY = 'perfume_baltic_lang';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    allFragrances: 'All Fragrances',
    women: 'Women',
    men: 'Men',
    unisex: 'Unisex',

    // Footer
    footerTagline:
      'Discover your signature scent without the luxury markup. We bring you quality fragrances for men, women, and everyone in between.',
    shop: 'Shop',
    womensPerfumes: "Women's Perfumes",
    mensCologne: "Men's Cologne",
    unisexScents: 'Unisex Scents',
    support: 'Support',
    contactUs: 'Contact Us',
    shippingReturns: 'Shipping & Returns',
    faq: 'FAQ',
    allRightsReserved: 'All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',

    // Home
    welcomeTo: 'Welcome to Perfume Baltic',
    heroTitle1: 'Your signature scent,',
    heroTitle2: 'beautifully accessible.',
    heroText:
      'Discover our curated collection of premium fragrances for everyone. Warm, inviting, and priced without the luxury markup.',
    shopCollection: 'Shop the Collection',
    viewBestsellers: 'View Bestsellers',
    lovedByMany: 'Loved by Many',
    lovedByManyText: 'Our most sought-after fragrances, curated just for you.',
    viewAllProducts: 'View all products',
    findYourMatch: 'Find Your Match',
    findYourMatchText:
      'Whether you prefer deep woods, fresh florals, or clean aquatic notes, your next signature scent is waiting.',
    collection: 'Collection',
    shopNow: 'Shop now',

    // ProductCard
    noImage: 'No Image',
    featured: 'Featured',
    onlyNLeft: 'Only {count} left',
    soldOut: 'Sold Out',
    gender_women: 'Women',
    gender_men: 'Men',
    gender_unisex: 'Unisex',

    // Shop
    ourCollection: 'Our Collection',
    ourCollectionText:
      'Explore our curated selection of fragrances. Use the filters to find your perfect scent.',
    searchPlaceholder: 'Search fragrances...',
    filters: 'Filters',
    gender: 'Gender',
    allGenders: 'All Genders',
    scentFamily: 'Scent Family',
    allScents: 'All Scents',
    clearFilters: 'Clear Filters',
    noFragrancesFound: 'No fragrances found',
    noFragrancesFoundText:
      "We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters.",
    clearAllFilters: 'Clear all filters',

    // Cart
    yourBag: 'Your Bag',
    bagEmpty: 'Your bag is empty',
    bagEmptyText:
      "Looks like you haven't added any fragrances to your bag yet. Discover your next signature scent today.",
    continueShopping: 'Continue Shopping',
    remove: 'Remove',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    calculatedAtCheckout: 'Calculated at checkout',
    estimatedTotal: 'Estimated Total',
    taxesNote: 'Taxes will be calculated at checkout',
    proceedToCheckout: 'Proceed to Checkout',
    orContinueShopping: 'or Continue Shopping',

    // ProductDetail
    productNotFound: 'Product Not Found',
    productNotFoundText: "The fragrance you're looking for doesn't exist.",
    noImageAvailable: 'No image available',
    bestseller: 'Bestseller',
    scentNotes: 'Scent Notes',
    outOfStock: 'Currently Out of Stock',
    addToCart: 'Add to Cart',
    addingToCart: 'Adding...',
    addedToCart: 'Added to Cart',
    addedToCartToast: 'Added to cart',
    addedToCartToastDesc: '{quantity}x {name} added to your bag.',
    onlyNLeftInStock: 'Only {count} left in stock - order soon',

    // Checkout
    checkout: 'Checkout',
    checkoutSubtitle: 'Complete your order details below.',
    contactInformation: 'Contact Information',
    emailAddress: 'Email Address',
    shippingDetails: 'Shipping Details',
    fullName: 'Full Name',
    streetAddress: 'Street Address',
    city: 'City',
    postalCode: 'Postal / Zip Code',
    placeOrder: 'Place Order',
    processing: 'Processing...',
    paymentMethod: 'Payment Method',
    payCard: 'Card payment',
    payCardDesc: 'Visa, Mastercard and more — secure checkout via Stripe.',
    payPaysera: 'Paysera',
    payPayseraDesc: 'Pay via bank link or Paysera wallet.',
    payNow: 'Pay Now',
    redirectingToPayment: 'Redirecting to payment...',
    securePaymentNote: 'You will be redirected to a secure payment page to complete your order.',
    inYourBag: 'In Your Bag',
    free: 'Free',
    spendMoreFreeShipping: 'Spend {amount} more for free shipping.',
    total: 'Total',
    cannotCheckoutEmpty: 'Cannot proceed to checkout with an empty bag.',
    returnToShop: 'Return to Shop',
    bagEmptyToastDesc: 'Please add some items to your bag before checking out.',
    checkoutFailed: 'Checkout failed',
    checkoutFailedDesc: 'There was a problem placing your order. Please try again.',
    validationNameMin: 'Name must be at least 2 characters',
    validationEmail: 'Please enter a valid email address',
    validationAddressMin: 'Address must be at least 5 characters',
    validationCityMin: 'City must be at least 2 characters',
    validationPostalMin: 'Postal code must be at least 4 characters',

    // OrderConfirmation
    thankYou: 'Thank you for your order!',
    orderReceived: "We've received your order and will begin processing it shortly.",
    orderNumber: 'Order Number',
    date: 'Date',
    status: 'Status',
    orderItems: 'Order Items',
    qty: 'Qty',
    contactInfo: 'Contact Info',
    emailUpdatesNote:
      'You will receive order updates and tracking information at this email address.',
    orderNotFound: 'Order Not Found',
    orderNotFoundText: "We couldn't find the order you're looking for.",
    awaitingPayment: 'Awaiting payment confirmation',
    awaitingPaymentText:
      "Your order has been created and we're waiting for the payment confirmation. This page will update automatically.",
    status_pending: 'Awaiting payment',
    status_paid: 'Paid',
    status_placed: 'Placed',
    status_processing: 'Processing',
    status_shipped: 'Shipped',
    status_delivered: 'Delivered',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
  },
  lv: {
    // Navbar
    allFragrances: 'Visas smaržas',
    women: 'Sievietēm',
    men: 'Vīriešiem',
    unisex: 'Unisex',

    // Footer
    footerTagline:
      'Atklājiet savu īpašo aromātu bez luksusa uzcenojuma. Piedāvājam kvalitatīvas smaržas vīriešiem, sievietēm un ikvienam.',
    shop: 'Veikals',
    womensPerfumes: 'Sieviešu smaržas',
    mensCologne: 'Vīriešu smaržas',
    unisexScents: 'Unisex aromāti',
    support: 'Atbalsts',
    contactUs: 'Sazinieties ar mums',
    shippingReturns: 'Piegāde un atgriešana',
    faq: 'BUJ',
    allRightsReserved: 'Visas tiesības aizsargātas.',
    privacyPolicy: 'Privātuma politika',
    termsOfService: 'Lietošanas noteikumi',

    // Home
    welcomeTo: 'Laipni lūdzam Perfume Baltic',
    heroTitle1: 'Jūsu īpašais aromāts,',
    heroTitle2: 'skaisti pieejams.',
    heroText:
      'Atklājiet mūsu rūpīgi izvēlēto premium smaržu kolekciju ikvienam. Silti, aicinoši un bez luksusa uzcenojuma.',
    shopCollection: 'Apskatīt kolekciju',
    viewBestsellers: 'Populārākie produkti',
    lovedByMany: 'Iecienītākie',
    lovedByManyText: 'Mūsu pieprasītākās smaržas, izvēlētas tieši jums.',
    viewAllProducts: 'Skatīt visus produktus',
    findYourMatch: 'Atrodiet savējo',
    findYourMatchText:
      'Vai dodat priekšroku dziļiem koka aromātiem, svaigiem ziedu vai tīriem ūdens akordiem — jūsu nākamais īpašais aromāts jau gaida.',
    collection: 'Kolekcija',
    shopNow: 'Iepirkties',

    // ProductCard
    noImage: 'Nav attēla',
    featured: 'Izcelts',
    onlyNLeft: 'Atlicis tikai {count}',
    soldOut: 'Izpārdots',
    gender_women: 'Sievietēm',
    gender_men: 'Vīriešiem',
    gender_unisex: 'Unisex',

    // Shop
    ourCollection: 'Mūsu kolekcija',
    ourCollectionText:
      'Izpētiet mūsu rūpīgi izvēlēto smaržu klāstu. Izmantojiet filtrus, lai atrastu savu ideālo aromātu.',
    searchPlaceholder: 'Meklēt smaržas...',
    filters: 'Filtri',
    gender: 'Dzimums',
    allGenders: 'Visi',
    scentFamily: 'Aromātu saime',
    allScents: 'Visi aromāti',
    clearFilters: 'Notīrīt filtrus',
    noFragrancesFound: 'Smaržas nav atrastas',
    noFragrancesFoundText:
      'Neizdevās atrast produktus, kas atbilst jūsu filtriem. Mēģiniet mainīt meklēšanu vai notīrīt filtrus.',
    clearAllFilters: 'Notīrīt visus filtrus',

    // Cart
    yourBag: 'Jūsu grozs',
    bagEmpty: 'Jūsu grozs ir tukšs',
    bagEmptyText:
      'Izskatās, ka vēl neesat pievienojis nevienu smaržu grozam. Atklājiet savu nākamo īpašo aromātu jau šodien.',
    continueShopping: 'Turpināt iepirkties',
    remove: 'Noņemt',
    orderSummary: 'Pasūtījuma kopsavilkums',
    subtotal: 'Starpsumma',
    shipping: 'Piegāde',
    calculatedAtCheckout: 'Tiks aprēķināta noformēšanā',
    estimatedTotal: 'Paredzamā summa',
    taxesNote: 'Nodokļi tiks aprēķināti pasūtījuma noformēšanā',
    proceedToCheckout: 'Noformēt pasūtījumu',
    orContinueShopping: 'vai turpināt iepirkties',

    // ProductDetail
    productNotFound: 'Produkts nav atrasts',
    productNotFoundText: 'Meklētā smarža neeksistē.',
    noImageAvailable: 'Attēls nav pieejams',
    bestseller: 'Populārs',
    scentNotes: 'Aromāta notis',
    outOfStock: 'Pašlaik nav noliktavā',
    addToCart: 'Pievienot grozam',
    addingToCart: 'Pievieno...',
    addedToCart: 'Pievienots grozam',
    addedToCartToast: 'Pievienots grozam',
    addedToCartToastDesc: '{quantity}x {name} pievienots jūsu grozam.',
    onlyNLeftInStock: 'Noliktavā atlicis tikai {count} — pasūtiet drīz',

    // Checkout
    checkout: 'Pasūtījuma noformēšana',
    checkoutSubtitle: 'Aizpildiet pasūtījuma informāciju zemāk.',
    contactInformation: 'Kontaktinformācija',
    emailAddress: 'E-pasta adrese',
    shippingDetails: 'Piegādes informācija',
    fullName: 'Vārds, uzvārds',
    streetAddress: 'Adrese',
    city: 'Pilsēta',
    postalCode: 'Pasta indekss',
    placeOrder: 'Veikt pasūtījumu',
    processing: 'Apstrādā...',
    paymentMethod: 'Apmaksas veids',
    payCard: 'Maksājums ar karti',
    payCardDesc: 'Visa, Mastercard un citas — droša apmaksa ar Stripe.',
    payPaysera: 'Paysera',
    payPayseraDesc: 'Maksājiet ar banklink vai Paysera maku.',
    payNow: 'Apmaksāt',
    redirectingToPayment: 'Novirza uz apmaksu...',
    securePaymentNote: 'Jūs tiksiet novirzīts uz drošu apmaksas lapu, lai pabeigtu pasūtījumu.',
    inYourBag: 'Jūsu grozā',
    free: 'Bezmaksas',
    spendMoreFreeShipping: 'Iztērējiet vēl {amount}, lai saņemtu bezmaksas piegādi.',
    total: 'Kopā',
    cannotCheckoutEmpty: 'Nevar noformēt pasūtījumu ar tukšu grozu.',
    returnToShop: 'Atgriezties veikalā',
    bagEmptyToastDesc: 'Lūdzu, pievienojiet preces grozam pirms pasūtījuma noformēšanas.',
    checkoutFailed: 'Pasūtījums neizdevās',
    checkoutFailedDesc: 'Radās problēma, veicot pasūtījumu. Lūdzu, mēģiniet vēlreiz.',
    validationNameMin: 'Vārdam jābūt vismaz 2 rakstzīmēm',
    validationEmail: 'Lūdzu, ievadiet derīgu e-pasta adresi',
    validationAddressMin: 'Adresei jābūt vismaz 5 rakstzīmēm',
    validationCityMin: 'Pilsētai jābūt vismaz 2 rakstzīmēm',
    validationPostalMin: 'Pasta indeksam jābūt vismaz 4 rakstzīmēm',

    // OrderConfirmation
    thankYou: 'Paldies par jūsu pasūtījumu!',
    orderReceived: 'Esam saņēmuši jūsu pasūtījumu un drīzumā sāksim to apstrādāt.',
    orderNumber: 'Pasūtījuma numurs',
    date: 'Datums',
    status: 'Statuss',
    orderItems: 'Pasūtītās preces',
    qty: 'Skaits',
    contactInfo: 'Kontaktinformācija',
    emailUpdatesNote:
      'Uz šo e-pasta adresi saņemsiet pasūtījuma atjauninājumus un sūtījuma izsekošanas informāciju.',
    orderNotFound: 'Pasūtījums nav atrasts',
    orderNotFoundText: 'Neizdevās atrast meklēto pasūtījumu.',
    awaitingPayment: 'Gaida maksājuma apstiprinājumu',
    awaitingPaymentText:
      'Jūsu pasūtījums ir izveidots, un mēs gaidām maksājuma apstiprinājumu. Šī lapa atjaunosies automātiski.',
    status_pending: 'Gaida apmaksu',
    status_paid: 'Apmaksāts',
    status_placed: 'Pieņemts',
    status_processing: 'Apstrādē',
    status_shipped: 'Nosūtīts',
    status_delivered: 'Piegādāts',
    status_completed: 'Pabeigts',
    status_cancelled: 'Atcelts',
  },
};

function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'lv') return stored;
    if (navigator.language?.toLowerCase().startsWith('lv')) return 'lv';
  }
  return 'en';
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let text = translations[language][key] ?? translations.en[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, String(value));
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
