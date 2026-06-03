/* global React */
// ============================================================================
// OBRAS · DATA — 21 obras reais (WordPress bertiestrutural.com.br)
// ============================================================================

const WP = 'https://www.bertiestrutural.com.br/wp-content/uploads';

const OBRAS_CATS = [
  { key: 'todas',        label: 'Todas' },
  { key: 'supermercado', label: 'Supermercado' },
  { key: 'industrial',   label: 'Industrial' },
  { key: 'comercial',    label: 'Comercial' },
];

const OBRAS_LIST = [
  { id: 1,  titulo: 'Supermercado Hmais',    cat: 'supermercado', local: 'Palmeira – PR',           metragem: '3.105 m²',  capa: `${WP}/2026/05/dji_fly_20250703_075132_457_1751540523450_photo-1024x683.jpg` },
  { id: 2,  titulo: 'Supermercado Camilo',   cat: 'supermercado', local: 'Marialva – PR',            metragem: '9.000 m²',  capa: `${WP}/2026/05/DJI_20250814105447_0007_D-1024x767.png` },
  { id: 3,  titulo: 'Transportadora Falcão', cat: 'industrial',   local: 'Uruguaiana – RS',          metragem: '6.100 m²',  capa: `${WP}/2024/04/Capa-min-1024x576.jpeg` },
  { id: 4,  titulo: 'Comercial Ivaiporã',    cat: 'comercial',    local: 'Ivaiporã – PR',            metragem: '17.000 m²', capa: `${WP}/2024/04/CAPA-min-1-scaled-e1713901384669-1024x546.jpg` },
  { id: 5,  titulo: 'Viação Garcia',         cat: 'industrial',   local: 'Londrina – PR',            metragem: '18.000 m²', capa: `${WP}/2024/04/DJI_0879-1-1024x683.jpg` },
  { id: 6,  titulo: 'Muffato Apucarana',     cat: 'supermercado', local: 'Apucarana – PR',           metragem: '7.300 m²',  capa: `${WP}/2024/04/FIMI0231-1-1024x576.jpg` },
  { id: 7,  titulo: 'Fast Gôndolas',         cat: 'comercial',    local: 'Londrina – PR',            metragem: '13.000 m²', capa: `${WP}/2024/04/Photo_6553877_DJI_277_jpg_5300022_0_202262884410_photo_original.jpg-min-1024x576.jpg` },
  { id: 8,  titulo: 'Balaroti',              cat: 'comercial',    local: 'Londrina – PR',            metragem: '2.000 m²',  capa: `${WP}/2024/04/capa-1024x684.jpg` },
  { id: 9,  titulo: 'Carbamall',             cat: 'comercial',    local: 'Londrina – PR',            metragem: '2.700 m²',  capa: `${WP}/2024/04/PHOTO-2020-01-22-07-56-51-min-1024x574.jpg` },
  { id: 10, titulo: 'Muffato Beltrão',       cat: 'supermercado', local: 'Francisco Beltrão – PR',   metragem: '8.600 m²',  capa: `${WP}/2024/04/DJI_0601-1024x576.jpg` },
  { id: 11, titulo: 'Bavaresco',             cat: 'supermercado', local: 'Pontal do Paraná – PR',    metragem: '9.000 m²',  capa: `${WP}/2024/04/dji_fly_20250611_073810_245_1749639001524_photo-1024x683.jpg` },
  { id: 12, titulo: 'Super 88',              cat: 'supermercado', local: 'Londrina – PR',            metragem: '6.500 m²',  capa: `${WP}/2024/04/DJI_0895-1024x683.jpg` },
  { id: 13, titulo: 'TIC Curitiba',          cat: 'industrial',   local: 'Curitiba – PR',            metragem: '6.780 m²',  capa: `${WP}/2024/04/DJI_0517-1024x683.jpg` },
  { id: 14, titulo: 'Super Golff',           cat: 'supermercado', local: 'Cambé – PR',               metragem: '4.600 m²',  capa: `${WP}/2024/04/DJI_0488-1024x576.jpg` },
  { id: 15, titulo: 'Muffato Medianeira',    cat: 'supermercado', local: 'Medianeira – PR',          metragem: '11.100 m²', capa: `${WP}/2024/04/DJI_0601-1024x576.jpg` },
  { id: 16, titulo: 'Chácara Graciosa',      cat: 'comercial',    local: 'Londrina – PR',            metragem: '1.000 m²',  capa: `${WP}/2024/04/capa-min-768x512.jpg` },
  { id: 17, titulo: 'Jeep Maringá',          cat: 'comercial',    local: 'Maringá – PR',             metragem: '1.800 m²',  capa: `${WP}/2024/04/1-1-1024x576.jpg` },
  { id: 18, titulo: 'Millenium Mall',        cat: 'comercial',    local: 'Londrina – PR',            metragem: '1.750 m²',  capa: `${WP}/2024/04/DJI_0393-1024x683.jpg` },
  { id: 19, titulo: 'Inga Mall',             cat: 'comercial',    local: 'Londrina – PR',            metragem: '3.095 m²',  capa: `${WP}/2024/04/dji_fly_20250702_075538_421_1751454386144_photo-1024x683.jpg` },
  { id: 20, titulo: 'Tropical Mall',         cat: 'comercial',    local: 'Cambé – PR',               metragem: '2.700 m²',  capa: `${WP}/2024/04/dji_fly_20250417_103434_190_1744897707068_photo-1024x683.jpg` },
  { id: 21, titulo: 'Nipponflex Espumação',  cat: 'industrial',   local: 'Maringá – PR',             metragem: '15.000 m²', capa: `${WP}/2021/07/maxresdefault-1024x576.jpg` },
];

Object.assign(window, { OBRAS_CATS, OBRAS_LIST });
