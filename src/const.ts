import { grey } from '@material-ui/core/colors';
export const LIGHT_GREY = grey[200];
export const DARK_GREY = grey[600];

export const BACKGROUND_COLOR = '#F3FAFB'; //'#f7f8fb'//'#EEFCFB'//

export const COLOR_PRIMARY_DARK = '#037A90';
export const COLOR_PRIMARY = '#3AAFA9'; //"#00C2BA"
export const COLOR_PRIMARY_LIGHT = '#65ccb8';

export const COLOR_ACCENT_1 = '#FF2079'; //"#FE1C80"//"#FF8FCF"
export const COLOR_ACCENT_1_GRADIENT = [
  '#ffe0ed',
  '#ffb3d1',
  '#ff80b2',
  '#ff4d94',
  '#ff1a75',
  '#e6005c',
  '#b30047',
  '#800033',
  '#4d001f',
  '#1a000a',
];
export const COLOR_ACCENT_2 = '#FF5F01'; //"#FF5F01"//"#CE96FB"
export const COLOR_ACCENT_2_CONTRAST = '#64b5f6';
export const COLOR_ACCENT_2_GRADIENT = ['#0a62a9', '#e7f3fe'];
export const COLOR_E = '#551A8B'; //'SAMPLE' WATERMARK
export const COLOR_F = '#ffab00';
export const COLOR_F_CONSTRAST = '#ff8000';
export const COLOR_F_GRADIENT = [
  '#ffeabf',
  '#ffdc95',
  '#ffce6a',
  '#ffc040',
  '#ffb215',
  '#ea9d00',
  '#bf8000',
  '#956400',
  '#6a4700',
  '#402b00',
];
export const COLOR_G_GRADIENT = ['#e5fcff', '#b3f7ff', '#80f2ff', '#4dedff'];
export const COLOR_GREEN = '#00cc00';
export const COLOR_RED = '#cc0000';
export const COLOR_RED_LIGHT = '#E32636';
export const COLOR_GREY = '#696969';
export const COLOR_ORANGE = '#FFA500';
export const COLOR_YELLOW = '#EDD94C';
export const COLOR_TOOLTIP_BACKGROUND = '#E6F2F2';
export const COLOR_BLACK = '#000';
export const COLOR_BLUE_BLACK_LIGHT = '#292B3D';

export const gradient = [
  'rgba(0, 255, 255, 0)',
  'rgba(0, 255, 255, 1)',
  'rgba(0, 191, 255, 1)',
  'rgba(0, 127, 255, 1)',
  'rgba(0, 63, 255, 1)',
  'rgba(0, 0, 255, 1)',
  'rgba(0, 0, 223, 1)',
  'rgba(0, 0, 191, 1)',
  'rgba(0, 0, 159, 1)',
  'rgba(0, 0, 127, 1)',
  'rgba(63, 0, 91, 1)',
  'rgba(127, 0, 63, 1)',
  'rgba(191, 0, 31, 1)',
  'rgba(255, 0, 0, 1)',
];
export let gradientCss = 'linear-gradient(to right';
for (let i = 0; i < gradient.length; ++i) {
  gradientCss += ', ' + gradient[i];
}
gradientCss += ')';

export const outerCoords = [
  { lat: 85, lng: -90 },
  { lat: 85, lng: -179.9 },
  { lat: 0, lng: -179.9 },
  { lat: -85, lng: -179.9 },
  { lat: -85, lng: -90 },
  { lat: -85, lng: 0.1 },
  { lat: -85, lng: 90 },
  { lat: -85, lng: 179.9 },
  { lat: 0, lng: -179.9 },
  { lat: 0, lng: 179.9 },
  { lat: 85, lng: 179.9 },
];

export const mapStyles = [
  {
    featureType: 'landscape',
    stylers: [
      {
        hue: '#FFBB00',
      },
      {
        saturation: 43.400000000000006,
      },
      {
        lightness: 37.599999999999994,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    featureType: 'road.highway',
    stylers: [
      {
        hue: '#FFC200',
      },
      {
        saturation: -61.8,
      },
      {
        lightness: 45.599999999999994,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    stylers: [
      {
        hue: '#FF0300',
      },
      {
        saturation: -100,
      },
      {
        lightness: 51.19999999999999,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    featureType: 'road.local',
    stylers: [
      {
        hue: '#FF0300',
      },
      {
        saturation: -100,
      },
      {
        lightness: 52,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    featureType: 'water',
    stylers: [
      {
        hue: '#0078FF',
      },
      {
        saturation: -13.200000000000003,
      },
      {
        lightness: 2.4000000000000057,
      },
      {
        gamma: 1,
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        hue: '#00FF6A',
      },
      {
        saturation: -1.0989010989011234,
      },
      {
        lightness: 11.200000000000017,
      },
      {
        gamma: 1,
      },
    ],
  },
];

export const mapOptions = {
  styles: mapStyles, // straight out of something like snazzymaps
};

export const RoutesMap = {
  Home: '/',
  Login: '/login',
  Register: '/register',
  Payment: '/payment',
  PaymentSuccess: '/subscribed',
  Calculator: '/airbnb-calculator',
  SampleDashboard: '/sample',
  TailoredRegion: '/tailored',
  VerifyEmail: '/verify',
  Data: '/airbnb-data',
  IBAS: '/ibas',
  CompSet: '/compset',
  User: '/user',
  Error: '/error',
  Pricing: '/pricing',
};

export const EuropeCountryCodes = [
  'AD',
  'AL',
  'AT',
  'AX',
  'BA',
  'BE',
  'BG',
  'BY',
  'CH',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FO',
  'FR',
  'GB',
  'GG',
  'GI',
  'GR',
  'HR',
  'HU',
  'IE',
  'IM',
  'IS',
  'IT',
  'JE',
  'LI',
  'LT',
  'LU',
  'LV',
  'MC',
  'MD',
  'ME',
  'MK',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'RS',
  'RU',
  'SE',
  'SI',
  'SJ',
  'SK',
  'UA',
  'XK',
];

export const investmentCalculatorInputFields = [
  {
    key: 'annualRevenue',
    label: 'Annual Revenue',
    tooltip: '',
    input: false,
    subfields: [
      {
        key: 'occupancyRate',
        label: 'Occupancy Rate',
        unit: '%',
      },
      {
        key: 'nightlyRate',
        label: 'Nightly Rate',
        unit: '$',
      },
      {
        key: 'cleaningFees',
        label: 'Cleaning Fees',
        unit: '$',
      },
      {
        key: 'bookingsPerMonth',
        label: 'Number of Bookings Per Month',
        unit: '',
      },
    ],
  },
  {
    key: 'annualExpenses',
    label: 'Annual Expenses',
    tooltip:
      'The expected annual recurring expenses. The annual expenses typically include Short-term rental license fees, Home Owner Association (HOA) fees, and insurance.',
    input: false,
    subfields: [
      {
        key: 'managementFee',
        label: 'Management Fee',
        unit: '%',
      },
      {
        key: 'lodgingTax',
        label: 'Lodgning Tax',
        unit: '%',
      },
      {
        key: 'propertyTax',
        label: 'Property Tax',
        unit: '%',
      },
      {
        key: 'mortgageFees',
        label: 'Mortgage Fees',
        unit: '$',
      },
      {
        key: 'cleaningFeesExpenses',
        label: 'Cleaning Fees',
        unit: '$',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        unit: '$',
      },
      {
        key: 'insurance',
        label: 'Insurance',
        unit: '$',
      },
      {
        key: 'utilities',
        label: 'Utilities',
        unit: '$',
      },
      {
        key: 'hoaFees',
        label: 'HOA Fees',
        unit: '$',
      },
      {
        key: 'other',
        label: 'Other',
        unit: '$',
      },
    ],
  },
  {
    key: 'purchasePrice',
    label: 'Purchase Price',
    tooltip: `The property price of a property that you'd like to simulate profit for.`,
    input: true,
  },
  {
    key: 'startupCosts',
    label: 'Startup Costs',
    tooltip: `It's the cost that occurs only once to get started with your short-term rentals. The startup costs typically include refurbishment fee and closing costs.`,
    input: false,
    subfields: [
      {
        key: 'homeFurnishings',
        label: 'Home Furnishings',
        unit: '$',
      },
      {
        key: 'homeImprovements',
        label: 'Home Improvements',
        unit: '$',
      },
      {
        key: 'closingCosts',
        label: 'Closing Costs',
        unit: '$',
      },
    ],
  },
];

export const rentalArbitrageCalculatorInputFields = [
  {
    key: 'monthlyRent',
    label: 'Monthly Rent',
    tooltip: 'Rent to be paid for the long term lease to the landlord.',
    input: true,
  },
  {
    key: 'monthlyExpense',
    label: 'Monthly Expense',
    tooltip:
      'In your monthly expense you can count in things like Utilities, Bills, Subscriptions and Cleaning Fees. These are recurring expenses that you are liable to pay every month. You can also factor in additional state or country wise charges that you have to pay to your local authorities.',
    input: true,
  },
  {
    key: 'oneTimeCost',
    label: 'One-time Cost',
    tooltip:
      'Apart from paying for your rent, you’ll need to take into account other starting costs like Furnishing, Deposit, Insurance, Appliances, Legal Paperwork and Refurbishing. ',
    input: true,
  },
];
