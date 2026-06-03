/* global React */
// ============================================================================
// OBRAS · DATA — 21 obras extraídas do WordPress bertiestrutural.com.br
// ============================================================================

const WP = 'https://www.bertiestrutural.com.br/wp-content/uploads';

const OBRAS = [
  { id: 1,  titulo: 'Supermercado Hmais',      segmento: 'Supermercado', local: 'Palmeira – PR',           metragem: '3.105 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2026/05/dji_fly_20250703_075132_457_1751540523450_photo-1024x683.jpg` },
  { id: 2,  titulo: 'Supermercado Camilo',     segmento: 'Supermercado', local: 'Marialva – PR',            metragem: '9.000 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2026/05/DJI_20250814105447_0007_D-1024x767.png` },
  { id: 3,  titulo: 'Transportadora Falcão',   segmento: 'Industrial',   local: 'Uruguaiana – RS',          metragem: '6.100 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/Capa-min-1024x576.jpeg` },
  { id: 4,  titulo: 'Comercial Ivaiporã',      segmento: 'Comercial',    local: 'Ivaiporã – PR',            metragem: '17.000 m²', tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/CAPA-min-1-scaled-e1713901384669-1024x546.jpg` },
  { id: 5,  titulo: 'Viação Garcia',           segmento: 'Industrial',   local: 'Londrina – PR',            metragem: '18.000 m²', tipo: 'Mista',              capa: `${WP}/2024/04/DJI_0879-1-1024x683.jpg` },
  { id: 6,  titulo: 'Muffato Apucarana',       segmento: 'Supermercado', local: 'Apucarana – PR',           metragem: '7.300 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/FIMI0231-1-1024x576.jpg` },
  { id: 7,  titulo: 'Fast Gôndolas',           segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '13.000 m²', tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/Photo_6553877_DJI_277_jpg_5300022_0_202262884410_photo_original.jpg-min-1024x576.jpg` },
  { id: 8,  titulo: 'Balaroti',                segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '2.000 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/capa-1024x684.jpg` },
  { id: 9,  titulo: 'Carbamall',               segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '2.700 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/PHOTO-2020-01-22-07-56-51-min-1024x574.jpg` },
  { id: 10, titulo: 'Muffato Beltrão',         segmento: 'Supermercado', local: 'Francisco Beltrão – PR',   metragem: '8.600 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0601-1024x576.jpg` },
  { id: 11, titulo: 'Bavaresco',               segmento: 'Supermercado', local: 'Pontal do Paraná – PR',    metragem: '9.000 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/dji_fly_20250611_073810_245_1749639001524_photo-1024x683.jpg` },
  { id: 12, titulo: 'Super 88',                segmento: 'Supermercado', local: 'Londrina – PR',            metragem: '6.500 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0895-1024x683.jpg` },
  { id: 13, titulo: 'TIC Curitiba',            segmento: 'Industrial',   local: 'Curitiba – PR',            metragem: '6.780 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0517-1024x683.jpg` },
  { id: 14, titulo: 'Super Golff',             segmento: 'Supermercado', local: 'Cambé – PR',               metragem: '4.600 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0488-1024x576.jpg` },
  { id: 15, titulo: 'Muffato Medianeira',      segmento: 'Supermercado', local: 'Medianeira – PR',          metragem: '11.100 m²', tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0601-1024x576.jpg` },
  { id: 16, titulo: 'Chácara Graciosa',        segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '1.000 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/capa-min-768x512.jpg` },
  { id: 17, titulo: 'Jeep Maringá',            segmento: 'Comercial',    local: 'Maringá – PR',             metragem: '1.800 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/1-1-1024x576.jpg` },
  { id: 18, titulo: 'Millenium Mall',          segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '1.750 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/DJI_0393-1024x683.jpg` },
  { id: 19, titulo: 'Inga Mall',               segmento: 'Comercial',    local: 'Londrina – PR',            metragem: '3.095 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/dji_fly_20250702_075538_421_1751454386144_photo-1024x683.jpg` },
  { id: 20, titulo: 'Tropical Mall',           segmento: 'Comercial',    local: 'Cambé – PR',               metragem: '2.700 m²',  tipo: 'Estrutura Metálica', capa: `${WP}/2024/04/dji_fly_20250417_103434_190_1744897707068_photo-1024x683.jpg` },
  { id: 21, titulo: 'Nipponflex Espumação',    segmento: 'Industrial',   local: 'Maringá – PR',             metragem: '15.000 m²', tipo: 'Estrutura Metálica', capa: `${WP}/2021/07/maxresdefault-1024x576.jpg` },
];

const SEGMENTOS = ['Todos', 'Supermercado', 'Industrial', 'Comercial'];

Object.assign(window, { OBRAS, SEGMENTOS });
