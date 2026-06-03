/* global React */
// ============================================================================
// OBRAS · DATA — 21 obras reais
// Campos do Lightbox: id, cat, cover, title, catLabel, city, area, status, gallery, desc, youtube
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
    id: 21, cat: 'industrial',
    cover: 'assets/photos/nippon-capa.jpg',
    title: 'Nipponflex Espumação', catLabel: 'Industrial',
    city: 'Maringá – PR', area: '15.000 m²', status: 'Entregue',
    desc: 'Cobertura e pilares para fechamento executados em estrutura metálica, em aço galvanizado, com ligações parafusadas, telhas termo-acústicas e ventiladores naturais.',
    youtube: 'https://youtu.be/02_BGZIFano',
    gallery: ['assets/photos/nippon-capa.jpg','assets/photos/nippon-01.jpg','assets/photos/nippon-02.jpg','assets/photos/nippon-03.jpg','assets/photos/nippon-04.jpg','assets/photos/nippon-05.jpg','assets/photos/nippon-06.jpg'],
  },
  { id: 1,  cat: 'supermercado', cover: `${WP}/2026/05/dji_fly_20250703_075132_457_1751540523450_photo-1024x683.jpg`,                                  title: 'Supermercado Hmais',    catLabel: 'Supermercado', city: 'Palmeira – PR',           area: '3.105 m²',  status: 'Entregue' },
  { id: 2,  cat: 'supermercado', cover: `${WP}/2026/05/DJI_20250814105447_0007_D-1024x767.png`,                                                        title: 'Supermercado Camilo',   catLabel: 'Supermercado', city: 'Marialva – PR',            area: '9.000 m²',  status: 'Entregue' },
  { id: 3,  cat: 'industrial',   cover: `${WP}/2024/04/Capa-min-1024x576.jpeg`,                                                                        title: 'Transportadora Falcão', catLabel: 'Industrial',   city: 'Uruguaiana – RS',          area: '6.100 m²',  status: 'Entregue' },
  { id: 4,  cat: 'comercial',    cover: `${WP}/2024/04/CAPA-min-1-scaled-e1713901384669-1024x546.jpg`,                                                 title: 'Comercial Ivaiporã',    catLabel: 'Comercial',    city: 'Ivaiporã – PR',            area: '17.000 m²', status: 'Entregue' },
  { id: 5,  cat: 'industrial',   cover: `${WP}/2024/04/DJI_0879-1-1024x683.jpg`,                                                                       title: 'Viação Garcia',         catLabel: 'Industrial',   city: 'Londrina – PR',            area: '18.000 m²', status: 'Entregue' },
  { id: 6,  cat: 'supermercado', cover: `${WP}/2024/04/FIMI0231-1-1024x576.jpg`,                                                                       title: 'Muffato Apucarana',     catLabel: 'Supermercado', city: 'Apucarana – PR',           area: '7.300 m²',  status: 'Entregue' },
  { id: 7,  cat: 'comercial',    cover: `${WP}/2024/04/Photo_6553877_DJI_277_jpg_5300022_0_202262884410_photo_original.jpg-min-1024x576.jpg`,            title: 'Fast Gôndolas',         catLabel: 'Comercial',    city: 'Londrina – PR',            area: '13.000 m²', status: 'Entregue' },
  { id: 8,  cat: 'comercial',    cover: `${WP}/2024/04/capa-1024x684.jpg`,                                                                             title: 'Balaroti',              catLabel: 'Comercial',    city: 'Londrina – PR',            area: '2.000 m²',  status: 'Entregue' },
  { id: 9,  cat: 'comercial',    cover: `${WP}/2024/04/PHOTO-2020-01-22-07-56-51-min-1024x574.jpg`,                                                    title: 'Carbamall',             catLabel: 'Comercial',    city: 'Londrina – PR',            area: '2.700 m²',  status: 'Entregue' },
  { id: 10, cat: 'supermercado', cover: `${WP}/2024/04/DJI_0601-1024x576.jpg`,                                                                         title: 'Muffato Beltrão',       catLabel: 'Supermercado', city: 'Francisco Beltrão – PR',   area: '8.600 m²',  status: 'Entregue' },
  { id: 11, cat: 'supermercado', cover: `${WP}/2024/04/dji_fly_20250611_073810_245_1749639001524_photo-1024x683.jpg`,                                   title: 'Bavaresco',             catLabel: 'Supermercado', city: 'Pontal do Paraná – PR',    area: '9.000 m²',  status: 'Entregue' },
  { id: 12, cat: 'supermercado', cover: `${WP}/2024/04/DJI_0895-1024x683.jpg`,                                                                         title: 'Super 88',              catLabel: 'Supermercado', city: 'Londrina – PR',            area: '6.500 m²',  status: 'Entregue' },
  { id: 13, cat: 'industrial',   cover: `${WP}/2024/04/DJI_0517-1024x683.jpg`,                                                                         title: 'TIC Curitiba',          catLabel: 'Industrial',   city: 'Curitiba – PR',            area: '6.780 m²',  status: 'Entregue' },
  { id: 14, cat: 'supermercado', cover: `${WP}/2024/04/DJI_0488-1024x576.jpg`,                                                                         title: 'Super Golff',           catLabel: 'Supermercado', city: 'Cambé – PR',               area: '4.600 m²',  status: 'Entregue' },
  { id: 15, cat: 'supermercado', cover: `${WP}/2024/04/DJI_0601-1024x576.jpg`,                                                                         title: 'Muffato Medianeira',    catLabel: 'Supermercado', city: 'Medianeira – PR',          area: '11.100 m²', status: 'Entregue' },
  { id: 16, cat: 'comercial',    cover: `${WP}/2024/04/capa-min-768x512.jpg`,                                                                          title: 'Chácara Graciosa',      catLabel: 'Comercial',    city: 'Londrina – PR',            area: '1.000 m²',  status: 'Entregue' },
  { id: 17, cat: 'comercial',    cover: `${WP}/2024/04/1-1-1024x576.jpg`,                                                                              title: 'Jeep Maringá',          catLabel: 'Comercial',    city: 'Maringá – PR',             area: '1.800 m²',  status: 'Entregue' },
  { id: 18, cat: 'comercial',    cover: `${WP}/2024/04/DJI_0393-1024x683.jpg`,                                                                         title: 'Millenium Mall',        catLabel: 'Comercial',    city: 'Londrina – PR',            area: '1.750 m²',  status: 'Entregue' },
  { id: 19, cat: 'comercial',    cover: `${WP}/2024/04/dji_fly_20250702_075538_421_1751454386144_photo-1024x683.jpg`,                                   title: 'Inga Mall',             catLabel: 'Comercial',    city: 'Londrina – PR',            area: '3.095 m²',  status: 'Entregue' },
  { id: 20, cat: 'comercial',    cover: `${WP}/2024/04/dji_fly_20250417_103434_190_1744897707068_photo-1024x683.jpg`,                                   title: 'Tropical Mall',         catLabel: 'Comercial',    city: 'Cambé – PR',               area: '2.700 m²',  status: 'Entregue' },
];

Object.assign(window, { OBRAS_CATS, OBRAS_LIST });
