/* global React */
// ============================================================================
// OBRAS · DATA — 21 obras com fotos e dados reais
// ============================================================================

const WP = 'https://www.bertiestrutural.com.br/wp-content/uploads';

const OBRAS_CATS = [
  { key: 'todas',        label: 'Todas' },
  { key: 'supermercado', label: 'Supermercado' },
  { key: 'industrial',   label: 'Industrial' },
  { key: 'comercial',    label: 'Comercial' },
];

const OBRAS_LIST = [
  {
    id: 21, cat: 'industrial', cover: 'assets/photos/nippon-capa.jpg',
    title: 'Nipponflex Espumação', catLabel: 'Industrial', city: 'Maringá – PR', area: '15.000 m²', status: 'Entregue',
    desc: 'Cobertura e pilares para fechamento executados em estrutura metálica, em aço galvanizado, com ligações parafusadas, telhas termo-acústicas e ventiladores naturais.',
    youtube: 'https://youtu.be/02_BGZIFano',
    gallery: ['assets/photos/nippon-capa.jpg','assets/photos/nippon-01.jpg','assets/photos/nippon-02.jpg','assets/photos/nippon-03.jpg','assets/photos/nippon-04.jpg','assets/photos/nippon-05.jpg','assets/photos/nippon-06.jpg'],
  },
  {
    id: 7, cat: 'supermercado', cover: 'assets/photos/muffato-medianeira-capa.jpg',
    title: 'Muffato Medianeira', catLabel: 'Supermercado', city: 'Medianeira – PR', area: '11.100 m²', status: 'Entregue',
    desc: 'Projeto das estruturas metálicas de cobertura e montagem de painéis de fechamento, telhas zipadas para cobertura, isolamento com face felt (lã de vidro), calhas, rufos de cobertura. Tempo de execução 120 dias.',
    youtube: 'https://youtu.be/4qlqqPA_6hs',
    gallery: ['assets/photos/muffato-medianeira-capa.jpg','assets/photos/muffato-medianeira-01.jpg','assets/photos/muffato-medianeira-02.jpg','assets/photos/muffato-medianeira-03.jpg'],
  },
  {
    id: 8, cat: 'supermercado', cover: 'assets/photos/super-golff-01.jpg',
    title: 'Super Golff', catLabel: 'Supermercado', city: 'Cambé – PR', area: '4.600 m²', status: 'Entregue',
    desc: 'Execução de cobertura em estrutura metálica 100% em aço de alta resistência, apoiadas sobre pilares e vigas de concreto armado, ligações parafusadas e telhas termo-acústicas. Tempo de execução 120 dias.',
    youtube: 'https://youtu.be/xZDdovfEZ7w',
    gallery: ['assets/photos/super-golff-01.jpg','assets/photos/super-golff-02.jpg','assets/photos/super-golff-03.jpg'],
  },
  {
    id: 9, cat: 'industrial', cover: 'assets/photos/tic-curitiba-capa.jpg',
    title: 'TIC Curitiba', catLabel: 'Industrial', city: 'Curitiba – PR', area: '6.780 m²', status: 'Entregue',
    desc: 'Galpão logístico, execução de cobertura em estrutura metálica 100% em aço de alta resistência, apoiadas sobre pilares e vigas de concreto armado, ligações parafusadas e telhas térmicas. Tempo de execução 120 dias.',
    youtube: 'https://youtu.be/pbokdWQA8Rk',
    gallery: ['assets/photos/tic-curitiba-capa.jpg','assets/photos/tic-curitiba-01.jpg','assets/photos/tic-curitiba-02.jpg','assets/photos/tic-curitiba-03.jpg'],
  },
  {
    id: 10, cat: 'supermercado', cover: 'assets/photos/super-88-capa.jpg',
    title: 'Super 88', catLabel: 'Supermercado', city: 'Londrina – PR', area: '6.500 m²', status: 'Entregue',
    desc: 'Estrutura 100% parafusada em aço galvanizado de alta resistência. Tempo de execução 140 dias.',
    gallery: ['assets/photos/super-88-capa.jpg','assets/photos/super-88-01.jpg','assets/photos/super-88-02.jpg'],
  },
  {
    id: 11, cat: 'supermercado', cover: 'assets/photos/bavaresco-capa.jpg',
    title: 'Bavaresco', catLabel: 'Supermercado', city: 'Pontal do Paraná – PR', area: '9.000 m²', status: 'Entregue',
    desc: 'Estruturas metálicas com aço galvanizado e pintura eletrostática, garantindo proteção duplex ideal para ambientes marinhos.',
    youtube: 'https://youtu.be/hOtbZm8Cig8',
    gallery: ['assets/photos/bavaresco-capa.jpg','assets/photos/bavaresco-01.jpg','assets/photos/bavaresco-02.jpg'],
  },
  {
    id: 12, cat: 'supermercado', cover: 'assets/photos/muffato-beltrao-capa.jpg',
    title: 'Muffato Beltrão', catLabel: 'Supermercado', city: 'Francisco Beltrão – PR', area: '8.600 m²', status: 'Entregue',
    desc: 'Projeto das estruturas metálicas de cobertura e montagem de painéis de fechamento, telhas zipadas para cobertura, isolamento com face felt (lã de vidro). Tempo de execução 120 dias.',
    youtube: 'https://youtu.be/noonzrTGMuY',
    gallery: ['assets/photos/muffato-beltrao-capa.jpg','assets/photos/muffato-beltrao-01.jpg','assets/photos/muffato-beltrao-02.jpg'],
  },
  {
    id: 13, cat: 'comercial', cover: 'assets/photos/tropical-mall-capa.jpg',
    title: 'Tropical Mall', catLabel: 'Comercial', city: 'Cambé – PR', area: '2.700 m²', status: 'Entregue',
    desc: 'Open mall executado 100% em estruturas metálicas. Soluções diferenciadas para a estrutura de fixação da pele de vidro e dos pergolados. Prazo de execução previsto: 90 dias.',
    gallery: ['assets/photos/tropical-mall-capa.jpg','assets/photos/tropical-mall-01.jpg','assets/photos/tropical-mall-02.jpg'],
  },
  {
    id: 14, cat: 'comercial', cover: 'assets/photos/inga-mall-capa.jpg',
    title: 'Inga Mall', catLabel: 'Comercial', city: 'Londrina – PR', area: '3.095 m²', status: 'Entregue',
    desc: 'Edificação projetada com estruturas metálicas em aço galvanizado de alta resistência. Soluções diferenciadas para marquises e pergolados. Prazo de execução: 100 dias.',
    youtube: 'https://youtu.be/4ufbxSeGn6E',
    gallery: ['assets/photos/inga-mall-capa.jpg','assets/photos/inga-mall-01.jpg','assets/photos/inga-mall-02.jpg'],
  },
  {
    id: 15, cat: 'comercial', cover: 'assets/photos/millenium-mall-capa.jpg',
    title: 'Millenium Mall', catLabel: 'Comercial', city: 'Londrina – PR', area: '1.750 m²', status: 'Entregue',
    desc: 'Open Mall com estruturas metálicas em aço galvanizado de alta resistência e ligações parafusadas. Tempo de execução 90 dias.',
    youtube: 'https://youtu.be/Pj-tA7g7X1w',
    gallery: ['assets/photos/millenium-mall-capa.jpg'],
  },
  {
    id: 16, cat: 'comercial', cover: 'assets/photos/jeep-maringa-capa.jpg',
    title: 'Jeep Maringá', catLabel: 'Comercial', city: 'Maringá – PR', area: '1.800 m²', status: 'Entregue',
    desc: 'Edificação comercial com acabamento de alto nível. Pórticos de alma cheia e estrutura secundária em Light Steel Frame. Obra tipo turn key. Tempo de execução 120 dias.',
    gallery: ['assets/photos/jeep-maringa-capa.jpg','assets/photos/jeep-maringa-01.jpg'],
  },
  {
    id: 17, cat: 'comercial', cover: 'assets/photos/chacara-graciosa-capa.jpg',
    title: 'Chácara Graciosa', catLabel: 'Comercial', city: 'Londrina – PR', area: '1.000 m²', status: 'Entregue',
    desc: 'Edifício projetado para eventos. Estrutura 100% metálica, cobertura termoacústica, fechamento com painéis metálicos e pilares em aço. Tempo de execução 90 dias.',
    gallery: ['assets/photos/chacara-graciosa-capa.jpg','assets/photos/chacara-graciosa-01.jpg','assets/photos/chacara-graciosa-02.jpg'],
  },
  { id: 1,  cat: 'supermercado', cover: `${WP}/2026/05/dji_fly_20250703_075132_457_1751540523450_photo-1024x683.jpg`,  title: 'Supermercado Hmais',    catLabel: 'Supermercado', city: 'Palmeira – PR',         area: '3.105 m²',  status: 'Entregue' },
  { id: 2,  cat: 'supermercado', cover: `${WP}/2026/05/DJI_20250814105447_0007_D-1024x767.png`,                          title: 'Supermercado Camilo',   catLabel: 'Supermercado', city: 'Marialva – PR',         area: '9.000 m²',  status: 'Entregue' },
  { id: 3,  cat: 'industrial',   cover: `${WP}/2024/04/Capa-min-1024x576.jpeg`,                                           title: 'Transportadora Falcão', catLabel: 'Industrial',   city: 'Uruguaiana – RS',       area: '6.100 m²',  status: 'Entregue' },
  { id: 4,  cat: 'comercial',    cover: `${WP}/2024/04/CAPA-min-1-scaled-e1713901384669-1024x546.jpg`,                    title: 'Comercial Ivaiporã',    catLabel: 'Comercial',    city: 'Ivaiporã – PR',         area: '17.000 m²', status: 'Entregue' },
  { id: 5,  cat: 'industrial',   cover: `${WP}/2024/04/DJI_0879-1-1024x683.jpg`,                                          title: 'Viação Garcia',         catLabel: 'Industrial',   city: 'Londrina – PR',         area: '18.000 m²', status: 'Entregue' },
  { id: 6,  cat: 'supermercado', cover: `${WP}/2024/04/FIMI0231-1-1024x576.jpg`,                                          title: 'Muffato Apucarana',     catLabel: 'Supermercado', city: 'Apucarana – PR',        area: '7.300 m²',  status: 'Entregue' },
  { id: 18, cat: 'comercial',    cover: `${WP}/2024/04/Photo_6553877_DJI_277_jpg_5300022_0_202262884410_photo_original.jpg-min-1024x576.jpg`, title: 'Fast Gôndolas', catLabel: 'Comercial', city: 'Londrina – PR', area: '13.000 m²', status: 'Entregue' },
  { id: 19, cat: 'comercial',    cover: `${WP}/2024/04/capa-1024x684.jpg`,                                                 title: 'Balaroti',              catLabel: 'Comercial',    city: 'Londrina – PR',         area: '2.000 m²',  status: 'Entregue' },
  { id: 20, cat: 'comercial',    cover: `${WP}/2024/04/PHOTO-2020-01-22-07-56-51-min-1024x574.jpg`,                       title: 'Carbamall',             catLabel: 'Comercial',    city: 'Londrina – PR',         area: '2.700 m²',  status: 'Entregue' },
];

Object.assign(window, { OBRAS_CATS, OBRAS_LIST });
