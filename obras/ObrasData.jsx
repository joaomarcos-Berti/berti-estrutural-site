/* global window */
// ============================================================================
// OBRAS · BASE DE DADOS
// 12 obras divididas em 3 segmentos: comerciais · mercados · industriais.
// Dados fictícios realistas — revisar/substituir pelos projetos reais.
// O campo `size` controla o ritmo do mosaico (std / wide / tall).
// ============================================================================

const P = 'assets/photos/';

const OBRAS_CATS = [
  { key: 'todas',       label: 'Todas as obras' },
  { key: 'comerciais',  label: 'Comerciais' },
  { key: 'mercados',    label: 'Mercados' },
  { key: 'industriais', label: 'Industriais' },
];

const OBRAS_LIST = [
  // ── MERCADOS ──────────────────────────────────────────────────────────
  {
    id: 'atacarejo-cascavel',
    cat: 'mercados', catLabel: 'Mercados',
    title: 'Atacarejo Cascavel',
    city: 'Cascavel · PR', year: '2024', status: 'Entregue',
    area: '6.500 m²', tons: '520 t', vao: '32 m',
    cover: P + 'supermarket-ceiling.jpg',
    gallery: [P + 'supermarket-ceiling.jpg', P + 'supermarket-banners.jpg', P + 'bim-detalhe-3.jpg'],
    desc: 'Cobertura de grande vão livre para piso de vendas sem pilares intermediários, mezanino técnico e estrutura para câmaras frias. Montagem 100% parafusada com a loja entregue no prazo da inauguração.',
    size: 'wide',
  },
  {
    id: 'supermercado-norte',
    cat: 'mercados', catLabel: 'Mercados',
    title: 'Supermercado Norte',
    city: 'Maringá · PR', year: '2025', status: 'Entregue',
    area: '4.200 m²', tons: '340 t', vao: '28 m',
    cover: P + 'supermarket-banners.jpg',
    gallery: [P + 'supermarket-banners.jpg', P + 'supermercado-interior.jpg'],
    desc: 'Estrutura para varejo de alto fluxo com pé-direito generoso e iluminação zenital. Gôndolas e racks de estoque integrados ao projeto estrutural desde a fase BIM.',
    size: 'std',
  },
  {
    id: 'rede-hortifruti',
    cat: 'mercados', catLabel: 'Mercados',
    title: 'Rede Hortifruti',
    city: 'Londrina · PR', year: '2024', status: 'Entregue',
    area: '3.100 m²', tons: '245 t', vao: '24 m',
    cover: P + 'supermercado-interior.jpg',
    gallery: [P + 'supermercado-interior.jpg', P + 'supermarket-ceiling.jpg'],
    desc: 'Loja de bairro com cobertura metálica leve e área de hortifrúti climatizada. Galvanização de alta resistência dispensa manutenção de pintura.',
    size: 'std',
  },
  {
    id: 'atacarejo-londrina',
    cat: 'mercados', catLabel: 'Mercados',
    title: 'Atacarejo Vila Nova',
    city: 'Londrina · PR', year: '2025', status: 'Em obra',
    area: '7.800 m²', tons: '610 t', vao: '36 m',
    cover: P + 'aerial.jpg',
    gallery: [P + 'aerial.jpg', P + 'obra-londrina-aerea.jpg', P + 'bim-detalhe-1.jpg'],
    desc: 'Complexo de atacarejo com estacionamento coberto e doca de descarga. Engenharia para grandes vãos e fluxo intenso de cargas, executada em centro urbano consolidado.',
    size: 'tall',
  },

  // ── COMERCIAIS ────────────────────────────────────────────────────────
  {
    id: 'showroom-automotivo',
    cat: 'comerciais', catLabel: 'Comercial',
    title: 'Showroom Automotivo',
    city: 'Londrina · PR', year: '2025', status: 'Entregue',
    area: '1.800 m²', tons: '145 t', vao: '22 m',
    cover: P + 'interior-truss.jpg',
    gallery: [P + 'interior-truss.jpg', P + 'canopy.jpg', P + 'bim-detalhe-2.jpg'],
    desc: 'Marquise de aço aparente e fachada de vidro com mínimo de pilares, valorizando a exposição dos veículos. Estrutura pensada para virar assinatura visual da concessionária.',
    size: 'wide',
  },
  {
    id: 'loja-materiais',
    cat: 'comerciais', catLabel: 'Comercial',
    title: 'Loja de Materiais',
    city: 'Apucarana · PR', year: '2024', status: 'Entregue',
    area: '2.400 m²', tons: '190 t', vao: '26 m',
    cover: P + 'canopy.jpg',
    gallery: [P + 'canopy.jpg', P + 'interior-truss.jpg'],
    desc: 'Showroom amplo com pé-direito alto e área de retirada coberta. Aço aparente pintado integra estética industrial à experiência de compra.',
    size: 'std',
  },
  {
    id: 'arena-beach',
    cat: 'comerciais', catLabel: 'Comercial · Lazer',
    title: 'Arena Beach Tennis',
    city: 'Londrina · PR', year: '2024', status: 'Entregue',
    area: '1.200 m²', tons: '95 t', vao: '30 m',
    cover: P + 'factory-interior.jpg',
    gallery: [P + 'factory-interior.jpg', P + 'sport-canopy.jpg'],
    desc: 'Cobertura esportiva de grande vão sem pilares na área de jogo, com pilares inclinados que viram identidade arquitetônica. Estrutura leve e resistente a cargas de vento.',
    size: 'std',
  },
  {
    id: 'centro-comercial-bim',
    cat: 'comerciais', catLabel: 'Comercial',
    title: 'Centro Comercial',
    city: 'Maringá · PR', year: '2026', status: 'Em projeto',
    area: '5.400 m²', tons: '430 t', vao: '34 m',
    cover: P + 'bim-detalhe-2.jpg',
    gallery: [P + 'bim-detalhe-2.jpg', P + 'bim-detalhe-1.jpg', P + 'bim-detalhe-3.jpg'],
    desc: 'Galeria comercial multiuso em fase de modelagem BIM. Cada ligação é detalhada e validada em 3D antes da fabricação, garantindo encaixe milimétrico na montagem.',
    size: 'std',
  },

  // ── INDUSTRIAIS ───────────────────────────────────────────────────────
  {
    id: 'galpao-logistico',
    cat: 'industriais', catLabel: 'Industrial',
    title: 'Galpão Logístico',
    city: 'Arapongas · PR', year: '2024', status: 'Entregue',
    area: '12.000 m²', tons: '1.200 t', vao: '40 m',
    cover: P + 'galpao-industrial-aereo.jpg',
    gallery: [P + 'galpao-industrial-aereo.jpg', P + 'estrutura-galpao.jpg', P + 'bim-detalhe-1.jpg'],
    desc: 'Pavilhão logístico de grande porte com vãos de 40 m e marquise de docas. Dimensionado para operação 24/7 e tráfego pesado de empilhadeiras e caminhões.',
    size: 'wide',
  },
  {
    id: 'industria-colchoes',
    cat: 'industriais', catLabel: 'Industrial',
    title: 'Indústria de Colchões',
    city: 'Rolândia · PR', year: '2023', status: 'Entregue',
    area: '9.300 m²', tons: '880 t', vao: '38 m',
    cover: P + 'sport-canopy.jpg',
    gallery: [P + 'sport-canopy.jpg', P + 'factory-interior.jpg'],
    desc: 'Planta fabril com mezanino de produção e ponte rolante. Estrutura preparada para cargas suspensas e linhas de produção contínuas.',
    size: 'std',
  },
  {
    id: 'pavilhao-industrial',
    cat: 'industriais', catLabel: 'Industrial',
    title: 'Pavilhão Industrial',
    city: 'Cambé · PR', year: '2025', status: 'Em obra',
    area: '8.600 m²', tons: '720 t', vao: '36 m',
    cover: P + 'estrutura-galpao.jpg',
    gallery: [P + 'estrutura-galpao.jpg', P + 'galpao-industrial-aereo.jpg'],
    desc: 'Montagem em andamento de pavilhão fabril com treliças de grande altura. Peças içadas e parafusadas em obra, sem solda no canteiro.',
    size: 'tall',
  },
  {
    id: 'planta-industrial-bim',
    cat: 'industriais', catLabel: 'Industrial',
    title: 'Planta Industrial',
    city: 'Ibiporã · PR', year: '2026', status: 'Em projeto',
    area: '15.000 m²', tons: '1.450 t', vao: '42 m',
    cover: P + 'bim-detalhe-1.jpg',
    gallery: [P + 'bim-detalhe-1.jpg', P + 'bim-detalhe-3.jpg', P + 'bim-detalhe-2.jpg'],
    desc: 'Indústria pesada modelada integralmente em BIM. Mais de 1.400 toneladas de aço detalhadas peça a peça, com listas de fabricação CNC e rastreabilidade total.',
    size: 'std',
  },
];

window.OBRAS_CATS = OBRAS_CATS;
window.OBRAS_LIST = OBRAS_LIST;
