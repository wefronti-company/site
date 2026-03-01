/** Mapeamento ISO 3166-1 alpha-2 -> nome em pt-BR */
export const countryNames: Record<string, string> = {
  AF: 'Afeganistão', AL: 'Albânia', DZ: 'Argélia', AR: 'Argentina', AU: 'Austrália', AT: 'Áustria',
  BE: 'Bélgica', BR: 'Brasil', CA: 'Canadá', CN: 'China', CO: 'Colômbia', KR: 'Coreia do Sul',
  CU: 'Cuba', EG: 'Egito', ES: 'Espanha', US: 'Estados Unidos', FR: 'França', DE: 'Alemanha',
  GB: 'Reino Unido', IN: 'Índia', ID: 'Indonésia', IR: 'Irã', IT: 'Itália', JP: 'Japão',
  MX: 'México', NL: 'Países Baixos', PL: 'Polônia', PT: 'Portugal', RU: 'Rússia', SA: 'Arábia Saudita',
  ZA: 'África do Sul', TR: 'Turquia', UA: 'Ucrânia', VE: 'Venezuela', VN: 'Vietnã',
  AD: 'Andorra', AO: 'Angola', AM: 'Armênia', AZ: 'Azerbaijão', BD: 'Bangladesh', BH: 'Barein',
  BZ: 'Belize', BJ: 'Benim', BO: 'Bolívia', BA: 'Bósnia e Herzegovina', BW: 'Botsuana', BN: 'Brunei',
  BG: 'Bulgária', BF: 'Burkina Faso', BI: 'Burundi', KH: 'Camboja', CM: 'Camarões', CV: 'Cabo Verde',
  CL: 'Chile', QA: 'Catar', KZ: 'Cazaquistão', TD: 'Chade', CY: 'Chipre', CG: 'Congo', CD: 'RD Congo',
  CR: 'Costa Rica', CI: 'Costa do Marfim', HR: 'Croácia', DK: 'Dinamarca', EC: 'Equador', SV: 'El Salvador',
  AE: 'Emirados Árabes Unidos', ER: 'Eritreia', EE: 'Estônia', ET: 'Etiópia', FJ: 'Fiji', PH: 'Filipinas',
  FI: 'Finlândia', GA: 'Gabão', GM: 'Gâmbia', GH: 'Gana', GE: 'Geórgia', GR: 'Grécia', GT: 'Guatemala',
  GY: 'Guiana', GN: 'Guiné', GW: 'Guiné-Bissau', HT: 'Haiti', HN: 'Honduras', HU: 'Hungria', IS: 'Islândia',
  IE: 'Irlanda', IL: 'Israel', JM: 'Jamaica', JO: 'Jordânia', KE: 'Quênia', KW: 'Kuwait', LA: 'Laos',
  LV: 'Letônia', LB: 'Líbano', LR: 'Libéria', LY: 'Líbia', LT: 'Lituânia', LU: 'Luxemburgo', MY: 'Malásia',
  MG: 'Madagascar', MW: 'Malaui', ML: 'Mali', MA: 'Marrocos', MU: 'Maurícia', MR: 'Mauritânia', MN: 'Mongólia',
  MZ: 'Moçambique', MM: 'Mianmar', NA: 'Namíbia', NP: 'Nepal', NI: 'Nicarágua', NE: 'Níger', NG: 'Nigéria',
  NO: 'Noruega', NZ: 'Nova Zelândia', OM: 'Omã', PK: 'Paquistão', PA: 'Panamá', PY: 'Paraguai', PE: 'Peru',
  RO: 'Romênia', RW: 'Ruanda', SN: 'Senegal', RS: 'Sérvia', SG: 'Singapura', SK: 'Eslováquia', SI: 'Eslovênia',
  SO: 'Somália', LK: 'Sri Lanka', SD: 'Sudão', SE: 'Suécia', CH: 'Suíça', SY: 'Síria', TW: 'Taiwan',
  TJ: 'Tajiquistão', TH: 'Tailândia', TZ: 'Tanzânia', TL: 'Timor-Leste', TG: 'Togo', TN: 'Tunísia',
  UG: 'Uganda', UY: 'Uruguai', UZ: 'Uzbequistão', YE: 'Iêmen', ZM: 'Zâmbia', ZW: 'Zimbábue',
};

export function getCountryName(iso2: string): string {
  return countryNames[iso2?.toUpperCase()] ?? iso2 ?? '—';
}
