'use client';

import { useLanguage } from '@/i18n';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react';
import { SocialShare } from '@/components/SocialShare';

export default function ProductDetail() {
  const { language, t } = useLanguage();
  const params = useParams();
  const productId = params.id as string;

  // 根据产品ID获取类别ID
  const getCategoryId = (id: string): string => {
    const categoryMap: Record<string, string> = {
      // 日用百货 101-104
      '101': '1', '102': '1', '103': '1', '104': '1',
      // 建材家居 201-204
      '201': '2', '202': '2', '203': '2', '204': '2',
      // 智能设备 301-304
      '301': '3', '302': '3', '303': '3', '304': '3',
      // 化工能源 401-404
      '401': '4', '402': '4', '403': '4', '404': '4',
      // 纺织品皮革 501-504
      '501': '5', '502': '5', '503': '5', '504': '5',
    };
    return categoryMap[id] || '1';
  };

  const categoryId = getCategoryId(productId);

  // 根据ID获取产品数据
  const getProductData = () => {
    const products: Record<string, { 
      name: Record<string, string>; 
      category: Record<string, string>;
      description: Record<string, string>;
      features: Record<string, string[]>;
      specifications: Record<string, string[]>;
      images: string[];
    }> = {
      '1': {
        name: { 
          zh: '日用百货', 
          en: 'Daily Necessities', 
          ja: '日用品',
          ko: '일상용품',
          es: 'Artículos de Primera Necesidad',
          fr: 'Articles de Première Nécessité',
          de: 'Haushaltswaren',
          pt: 'Artigos de Primeira Necessidade',
          ru: 'Товары первой необходимости',
          ar: 'الضرورية اليومية'
        },
        category: { zh: '日用消费', en: 'Consumer Goods', ja: '消費財', ko: '소비재', es: 'Bienes de Consumo', fr: 'Biens de Consommation', de: 'Konsumgüter', pt: 'Bens de Consumo', ru: 'Потребительские товары', ar: 'سلع استهلاكية' },
        description: {
          zh: '涵盖日常生活所需的各类消费品，包括家居用品、厨房用品、个人护理产品等。我们提供高品质、价格合理的日用商品，满足消费者的日常需求。',
          en: 'Covers various consumer goods needed for daily life, including household items, kitchen supplies, personal care products, etc. We provide high-quality, affordable daily commodities to meet consumer needs.',
          ja: '家庭用品、キッチン用品、パーソナルケア製品など、、日常生活に必要な各種消費財を取り扱っています。高品質で手の届きやすい日常品をお届けします。',
          ko: '가정용품, 주방용품, 개인 관리 제품 등을 포함한 일상 생활에 필요한 다양한 소비재를 제공합니다.',
          es: 'Cubrimos diversos productos de consumo necesarios para la vida diaria, incluyendo artículos para el hogar, utensilios de cocina, productos de cuidado personal, etc.',
          fr: 'Nous couvrons divers produits de consommation nécessaires à la vie quotidienne, incluant des articles ménagers, des ustensiles de cuisine, des produits de soins personnels, etc.',
          de: 'Wir bieten verschiedene Konsumgüter für den täglichen Bedarf, einschließlich Haushaltsartikel, Küchenzubehör, Körperpflegeprodukte und mehr.',
          pt: 'Cobrindo vários produtos de consumo necessários para a vida diária, incluindo itens para casa, utensílios de cozinha, produtos de cuidados pessoais, etc.',
          ru: 'Мы предлагаем различные потребительские товары для повседневной жизни, включая товары для дома, кухонные принадлежности, средства личной гигиены и многое другое.',
          ar: 'نقدم مجموعة متنوعة من منتجات المستهلكين اللازمة للحياة اليومية، بما في ذلك مستلزمات المنزل وأدوات المطبخ ومنتجات العناية الشخصية والمزيد.'
        },
        features: {
          zh: ['家居用品', '厨房用品', '个人护理', '母婴用品', '美妆产品', '办公文具'],
          en: ['Household Items', 'Kitchen Supplies', 'Personal Care', 'Mother & Baby', 'Beauty Products', 'Office Supplies'],
          ja: ['家庭用品', 'キッチン用品', 'パーソナルケア', '母婴用品', 'ビューティー製品', '事務用品'],
          ko: ['가정용품', '주방용품', '개인 관리', '모자용품', '뷰티 제품', '사무용품'],
          es: ['Artículos para el Hogar', 'Utensilios de Cocina', 'Cuidado Personal', 'Madre y Bebé', 'Productos de Belleza', 'Suministros de Oficina'],
          fr: ['Articles Ménagers', 'Ustensiles de Cuisine', 'Soins Personnels', 'Mère et Bébé', 'Produits de Beauté', 'Fournitures de Bureau'],
          de: ['Haushaltsartikel', 'Küchenzubehör', 'Körperpflege', 'Mutter & Kind', 'Schönheitsprodukte', 'Bürobedarf'],
          pt: ['Itens para Casa', 'Utensílios de Cozinha', 'Cuidados Pessoais', 'Mãe e Bebê', 'Produtos de Beleza', 'Materiais de Escritório'],
          ru: ['Товары для дома', 'Кухонные принадлежности', 'Личная гигиена', 'Мать и ребенок', 'Товары для красоты', 'Канцтовары'],
          ar: ['مستلزمات المنزل', 'أدوات المطبخ', 'العناية الشخصية', 'الأم والطفل', 'منتجات التجميل', 'قرطاسية المكتب']
        },
        specifications: {
          zh: ['最小起订量：500件', '包装方式：纸盒/塑料袋', '交货期：15-30天', '付款方式：T/T、L/C'],
          en: ['MOQ: 500 pieces', 'Packing: Carton/Polybag', 'Lead Time: 15-30 days', 'Payment: T/T, L/C'],
          ja: ['最小注文：500個', '梱包：段ボール/ポリ袋', 'リードタイム：15-30日', '支払い：T/T、L/C'],
          ko: ['최소 주문: 500개', '포장: 골판지/폴리백', '리드타임: 15-30일', '결제: T/T, L/C'],
          es: ['MOQ: 500 piezas', 'Embalaje: Cartón/Bolsa', 'Plazo: 15-30 días', 'Pago: T/T, L/C'],
          fr: ['Qté min: 500 pièces', 'Emballage: Carton/Sac', 'Délai: 15-30 jours', 'Paiement: T/T, L/C'],
          de: ['Mindestbestellung: 500 Stück', 'Verpackung: Karton/Tüte', 'Lieferzeit: 15-30 Tage', 'Zahlung: T/T, L/C'],
          pt: ['MOQ: 500 peças', 'Embalagem: Caixa/Saco', 'Prazo: 15-30 dias', 'Pagamento: T/T, L/C'],
          ru: ['Минимальный заказ: 500 шт.', 'Упаковка: Картон/Пакет', 'Срок поставки: 15-30 дней', 'Оплата: T/T, L/C'],
          ar: ['الحد الأدنى للطلب: 500 قطعة', 'التغليف: كرتون/كيس', 'وقت التسليم: 15-30 يوم', 'الدفع: T/T، L/C']
        },
        images: ['/cosmetics-1.jpg', '/cosmetics-2.jpg', '/cosmetics-3.jpg', '/cosmetics-4.jpg']
      },
      '2': {
        name: { 
          zh: '建材家居', 
          en: 'Building Materials', 
          ja: '建築材料',
          ko: '건설 자재',
          es: 'Materiales de Construcción',
          fr: 'Matériaux de Construction',
          de: 'Baumaterialien',
          pt: 'Materiais de Construção',
          ru: 'Строительные материалы',
          ar: 'مواد البناء'
        },
        category: { zh: '建材贸易', en: 'Building Trade', ja: '建材貿易', ko: '건설 무역', es: 'Comercio de Materiales', fr: 'Commerce de Matériaux', de: 'Baustoffhandel', pt: 'Comércio de Materiais', ru: 'Торговля стройматериалами', ar: 'تجارة مواد البناء' },
        description: {
          zh: '提供各类建筑材料和家居装饰产品，包括钢材、水泥、陶瓷、照明设备等。我们与优质供应商合作，确保材料的质量和供应稳定性。',
          en: 'Providing various building materials and home decoration products, including steel, cement, ceramics, lighting equipment, etc. We cooperate with quality suppliers to ensure material quality and supply stability.',
          ja: '鉄骨、セメント、セラミックス、照明器具など、各種建築材料やホーム装饰製品を提供しています。',
          ko: '강철, 시멘트, 세라믹, 조명 장비 등을 포함한 다양한 건축 자재와 가정용 장식 제품을 제공합니다.',
          es: 'Proporcionamos diversos materiales de construcción y productos de decoración del hogar, incluyendo acero, cemento, cerámica, equipos de iluminación, etc.',
          fr: 'Nous fournissons divers matériaux de construction et produits de décoration domestique, incluant de l\'acier, du ciment, de la céramique, des équipements d\'éclairage, etc.',
          de: 'Wir bieten verschiedene Baumaterialien und Produkte für die Innenausstattung, einschließlich Stahl, Zement, Keramik, Beleuchtung und mehr.',
          pt: 'Fornecendo vários materiais de construção e produtos de decoração doméstica, incluindo aço, cimento, cerâmica, equipamentos de iluminação, etc.',
          ru: 'Мы предлагаем различные строительные материалы и товары для домашнего декора, включая сталь, цемент, керамику, осветительное оборудование и многое другое.',
          ar: 'نقدم مجموعة متنوعة من مواد البناء ومنتجات ديكور المنزل، بما في ذلك الفولاذ والإسمنت والسيراميك ومعدات الإضاءة والمزيد.'
        },
        features: {
          zh: ['钢材产品', '水泥制品', '陶瓷地砖', '照明设备', '五金配件', '装饰材料'],
          en: ['Steel Products', 'Cement Products', 'Ceramic Tiles', 'Lighting Equipment', 'Hardware Accessories', 'Decorative Materials'],
          ja: ['鋼材製品', 'セメント製品', 'セラミックスタイル', '照明設備', '金物アクセサリー', '装飾材料'],
          ko: ['강철 제품', '시멘트 제품', '세라믹 타일', '조명 장비', '하드웨어 악세서리', '장식 재료'],
          es: ['Productos de Acero', 'Productos de Cemento', 'Azulejos Cerámicos', 'Equipos de Iluminación', 'Accesorios de Ferretería', 'Materiales Decorativos'],
          fr: ['Produits en Acier', 'Produits en Ciment', 'Carrelage en Céramique', 'Équipement d\'Éclairage', 'Accessoires de Quincaillerie', 'Matériaux Décoratifs'],
          de: ['Stahlprodukte', 'Zementprodukte', 'Keramikfliesen', 'Beleuchtungsausrüstung', 'Hartwarenzubehör', 'Dekorationsmaterialien'],
          pt: ['Produtos de Aço', 'Produtos de Cimento', 'Azulejos Cerâmicos', 'Equipamentos de Iluminação', 'Acessórios de Ferragens', 'Materiais Decorativos'],
          ru: ['Стальные изделия', 'Цементные изделия', 'Керамическая плитка', 'Осветительное оборудование', 'Фурнитура', 'Декоративные материалы'],
          ar: ['منتجات الفولاذ', 'منتجات الإسمنت', 'بلاط السيراميك', 'معدات الإضاءة', 'ملحقات الأجهزة', 'المواد الزخرفية']
        },
        specifications: {
          zh: ['最小起订量：1000件', '包装方式：托盘/集装箱', '交货期：20-45天', '付款方式：T/T、L/C'],
          en: ['MOQ: 1000 pieces', 'Packing: Pallet/Container', 'Lead Time: 20-45 days', 'Payment: T/T, L/C'],
          ja: ['最小注文：1000個', '梱包：パレット/コンテナ', 'リードタイム：20-45日', '支払い：T/T、L/C'],
          ko: ['최소 주문: 1000개', '포장: 팔레트/컨테이너', '리드타임: 20-45일', '결제: T/T, L/C'],
          es: ['MOQ: 1000 piezas', 'Embalaje: Palé/Contenedor', 'Plazo: 20-45 días', 'Pago: T/T, L/C'],
          fr: ['Qté min: 1000 pièces', 'Emballage: Palette/Conteneur', 'Délai: 20-45 jours', 'Paiement: T/T, L/C'],
          de: ['Mindestbestellung: 1000 Stück', 'Verpackung: Palette/Container', 'Lieferzeit: 20-45 Tage', 'Zahlung: T/T, L/C'],
          pt: ['MOQ: 1000 peças', 'Embalagem: Palete/Contêiner', 'Prazo: 20-45 dias', 'Pagamento: T/T, L/C'],
          ru: ['Минимальный заказ: 1000 шт.', 'Упаковка: Паллет/Контейнер', 'Срок поставки: 20-45 дней', 'Оплата: T/T, L/C'],
          ar: ['الحد الأدنى للطلب: 1000 قطعة', 'التغليف: بالتة/حاوية', 'وقت التسليم: 20-45 يوم', 'الدفع: T/T، L/C']
        },
        images: ['/tiles-1.jpg', '/tiles-2.jpg', '/tiles-3.jpg', '/tiles-4.jpg']
      },
      '3': {
        name: { 
          zh: '智能设备', 
          en: 'Smart Devices', 
          ja: 'スマートデバイス',
          ko: '스마트 기기',
          es: 'Dispositivos Inteligentes',
          fr: 'Appareils Intelligents',
          de: 'Intelligente Geräte',
          pt: 'Dispositivos Inteligentes',
          ru: 'Умные устройства',
          ar: 'الأجهزة الذكية'
        },
        category: { zh: '智能科技', en: 'Smart Technology', ja: 'スマートテクノロジー', ko: '스마트 기술', es: 'Tecnología Inteligente', fr: 'Technologie Intelligente', de: 'Intelligente Technologie', pt: 'Tecnologia Inteligente', ru: 'Умные технологии', ar: 'التكنولوجيا الذكية' },
        description: {
          zh: '出口各类智能设备和科技产品，包括智能家居、可穿戴设备、无人机、智慧农业设备等。产品远销全球多个国家和地区。',
          en: 'Exporting various smart devices and technology products, including smart home, wearables, drones, smart agriculture equipment, etc. Products are sold to multiple countries and regions worldwide.',
          ja: 'スマートホーム、ウェアラブル、ドローン、スマート農業機器など、各種スマートデバイスやテクノロジープロダクトを輸出しています。',
          ko: '스마트홈, 웨어러블, 드론, 스마트 농업 장비 등을 포함한 다양한 스마트 기기와 기술 제품을 수출합니다.',
          es: 'Exportando diversos dispositivos inteligentes y productos tecnológicos, incluyendo hogar inteligente, dispositivos vestibles, drones, equipos de agricultura inteligente, etc.',
          fr: 'Exportant divers appareils intelligents et produits technologiques, incluant la maison intelligente, les wearables, les drones, les équipements d\'agriculture intelligente, etc.',
          de: 'Wir exportieren verschiedene intelligente Geräte und Technologieprodukte, einschließlich Smart Home, Wearables, Drohnen, intelligente Landwirtschaftsausrüstung und mehr.',
          pt: 'Exportando vários dispositivos inteligentes e produtos tecnológicos, incluindo casa inteligente, wearables, drones, equipamentos de agricultura inteligente, etc.',
          ru: 'Экспортируем различные умные устройства и технологические продукты, включая умный дом, носимую электронику, дроны, оборудование для умного сельского хозяйства и многое другое.',
          ar: 'نصدر مجموعة متنوعة من الأجهزة الذكية ومنتجات التكنولوجيا، بما في ذلك المنازل الذكية والأجهزة القابلة للارتداء والطائرات بدون طيار ومعدات الزراعة الذكية والمزيد.'
        },
        features: {
          zh: ['智能家居系统', '可穿戴设备', '无人机产品', '智慧农业设备', '智能车载设备', '物联网设备'],
          en: ['Smart Home Systems', 'Wearable Devices', 'Drone Products', 'Smart Agriculture', 'Smart Vehicle Devices', 'IoT Equipment'],
          ja: ['スマートホームシステム', 'ウェアラブルデバイス', 'ドローン製品', 'スマート農業', 'スマートカー機器', 'IoT機器'],
          ko: ['스마트 홈 시스템', '웨어러블 기기', '드론 제품', '스마트 농업', '스마트 차량 기기', 'IoT 장비'],
          es: ['Sistemas de Hogar Inteligente', 'Dispositivos Vestibles', 'Productos de Drones', 'Agricultura Inteligente', 'Dispositivos Vehiculares Inteligentes', 'Equipos IoT'],
          fr: ['Systèmes de Maison Intelligente', 'Appareils Vestibles', 'Produits de Drones', 'Agriculture Intelligente', 'Dispositifs Véhicules Intelligents', 'Équipement IoT'],
          de: ['Smart-Home-Systeme', 'Wearables', 'Drohnenprodukte', 'Intelligente Landwirtschaft', 'Intelligente Fahrzeuggeräte', 'IoT-Ausrüstung'],
          pt: ['Sistemas de Casa Inteligente', 'Dispositivos Vestíveis', 'Produtos de Drones', 'Agricultura Inteligente', 'Dispositivos Veiculares Inteligentes', 'Equipamentos IoT'],
          ru: ['Системы умного дома', 'Носимые устройства', 'Продукты дронов', 'Умное сельское хозяйство', 'Умные автомобильные устройства', 'IoT оборудование'],
          ar: ['أنظمة المنزل الذكي', 'الأجهزة القابلة للارتداء', 'منتجات الطائرات بدون طيار', 'الزراعة الذكية', 'أجهزة المركبات الذكية', 'معدات إنترنت الأشياء']
        },
        specifications: {
          zh: ['最小起订量：100件', '包装方式：彩盒/中性包装', '交货期：30-60天', '付款方式：T/T、L/C、PayPal'],
          en: ['MOQ: 100 pieces', 'Packing: Color Box/Neutral', 'Lead Time: 30-60 days', 'Payment: T/T, L/C, PayPal'],
          ja: ['最小注文：100個', '梱包：カラーボックス/中性包装', 'リードタイム：30-60日', '支払い：T/T、L/C、PayPal'],
          ko: ['최소 주문: 100개', '포장: 컬러박스/중립 포장', '리드타임: 30-60일', '결제: T/T, L/C, PayPal'],
          es: ['MOQ: 100 piezas', 'Embalaje: Caja de Color/Neutral', 'Plazo: 30-60 días', 'Pago: T/T, L/C, PayPal'],
          fr: ['Qté min: 100 pièces', 'Emballage: Boîte Colorée/Neutre', 'Délai: 30-60 jours', 'Paiement: T/T, L/C, PayPal'],
          de: ['Mindestbestellung: 100 Stück', 'Verpackung: Farbbox/Neutral', 'Lieferzeit: 30-60 Tage', 'Zahlung: T/T, L/C, PayPal'],
          pt: ['MOQ: 100 peças', 'Embalagem: Caixa Colorida/Neutra', 'Prazo: 30-60 dias', 'Pagamento: T/T, L/C, PayPal'],
          ru: ['Минимальный заказ: 100 шт.', 'Упаковка: Цветная коробка/Нейтральная', 'Срок поставки: 30-60 дней', 'Оплата: T/T, L/C, PayPal'],
          ar: ['الحد الأدنى للطلب: 100 قطعة', 'التغليف: صندوق ملون/محايد', 'وقت التسليم: 30-60 يوم', 'الدفع: T/T، L/C، PayPal']
        },
        images: ['/smart-home-1.jpg', '/smart-home-2.jpg', '/smart-home-3.jpg', '/smart-home-4.jpg']
      },
      '4': {
        name: { 
          zh: '化工能源', 
          en: 'Chemical & Energy', 
          ja: '化学エネルギー',
          ko: '화학 에너지',
          es: 'Químicos y Energía',
          fr: 'Chimie et Énergie',
          de: 'Chemie und Energie',
          pt: 'Química e Energia',
          ru: 'Химия и энергетика',
          ar: 'الكيمياء والطاقة'
        },
        category: { zh: '化工贸易', en: 'Chemical Trade', ja: '化学貿易', ko: '화학 무역', es: 'Comercio Químico', fr: 'Commerce Chimique', de: 'Chemiehandel', pt: 'Comércio Químico', ru: 'Химическая торговля', ar: 'التجارة الكيميائية' },
        description: {
          zh: '专业从事化工产品和能源物资的国际贸易，包括塑料制品、橡胶、煤炭、矿石等。我们严格遵守国际贸昐准，确保产品安全和环保合规。',
          en: 'Specializing in international trade of chemical products and energy materials, including plastic products, rubber, coal, minerals, etc. We strictly comply with international trade standards to ensure product safety and environmental compliance.',
          ja: 'プラスチック製品、ゴム、石炭、鉱物などを含む化学製品とエネルギー物资の国際貿易を専門としています。',
          ko: '플라스틱 제품, 고무, 석탄, 광물 등을 포함한 화학 제품 및 에너지 물자의 국제 교역을 전문으로 합니다.',
          es: 'Especializados en comercio internacional de productos químicos y materiales energéticos, incluyendo productos plásticos, caucho, carbón, minerales, etc.',
          fr: 'Spécialisés dans le commerce international de produits chimiques et de matériaux énergétiques, incluant des produits plastiques, du caoutchouc, du charbon, des minéraux, etc.',
          de: 'Wir sind spezialisiert auf den internationalen Handel mit Chemieprodukten und Energierohstoffen, einschließlich Kunststoffprodukte, Gummi, Kohle, Mineralien und mehr.',
          pt: 'Especializados em comércio internacional de produtos químicos e materiais energéticos, incluindo produtos plásticos, borracha, carvão, minerais, etc.',
          ru: 'Специализируемся на международной торговле химической продукцией и энергоносителями, включая пластиковые изделия, резину, уголь, минералы и многое другое.',
          ar: 'نتخصص في التجارة الدولية للمنتجات الكيميائية ومواد الطاقة، بما في ذلك المنتجات البلاستيكية والمطاط والفحم والمعادن والمزيد.'
        },
        features: {
          zh: ['塑料制品', '橡胶产品', '煤炭能源', '金属矿石', '化工原料', '石油制品'],
          en: ['Plastic Products', 'Rubber Products', 'Coal Energy', 'Metal Minerals', 'Chemical Raw Materials', 'Petroleum Products'],
          ja: ['プラスチック製品', 'ゴム製品', '石炭エネルギー', '金属鉱物', '化学原料', '石油製品'],
          ko: ['플라스틱 제품', '고무 제품', '석탄 에너지', '금속 광물', '화학 원료', '석유 제품'],
          es: ['Productos de Plástico', 'Productos de Caucho', 'Energía de Carbón', 'Minerales Metálicos', 'Materias Primas Químicas', 'Productos de Petróleo'],
          fr: ['Produits en Plastique', 'Produits en Caoutchouc', 'Énergie du Charbon', 'Minéraux Métalliques', 'Matières Premières Chimiques', 'Produits Pétroliers'],
          de: ['Kunststoffprodukte', 'Gummiprodukte', 'Kohleenergie', 'Metallmineralien', 'Chemische Rohstoffe', 'Erdölprodukte'],
          pt: ['Produtos de Plástico', 'Produtos de Borracha', 'Energia de Carvão', 'Minérios Metálicos', 'Matérias Primas Químicas', 'Produtos de Petróleo'],
          ru: ['Пластиковые изделия', 'Резиновые изделия', 'Угольная энергия', 'Металлические минералы', 'Химическое сырье', 'Нефтепродукты'],
          ar: ['منتجات بلاستيكية', 'منتجات مطاطية', 'طاقة الفحم', 'معادن معدنية', 'المواد الخام الكيميائية', 'منتجات البترول']
        },
        specifications: {
          zh: ['最小起订量：5吨', '包装方式：吨袋/集装箱', '交货期：15-30天', '付款方式：T/T、L/C'],
          en: ['MOQ: 5 tons', 'Packing: Jumbo Bag/Container', 'Lead Time: 15-30 days', 'Payment: T/T, L/C'],
          ja: ['最小注文：5トン', '梱包：ジャンボバッグ/コンテナ', 'リードタイム：15-30日', '支払い：T/T、L/C'],
          ko: ['최소 주문: 5톤', '포장: 점보백/컨테이너', '리드타임: 15-30일', '결제: T/T, L/C'],
          es: ['MOQ: 5 toneladas', 'Embalaje: Bolsa Jumbo/Contenedor', 'Plazo: 15-30 días', 'Pago: T/T, L/C'],
          fr: ['Qté min: 5 tonnes', 'Emballage: Sac Jumbo/Conteneur', 'Délai: 15-30 jours', 'Paiement: T/T, L/C'],
          de: ['Mindestbestellung: 5 Tonnen', 'Verpackung: Jumbo Bag/Container', 'Lieferzeit: 15-30 Tage', 'Zahlung: T/T, L/C'],
          pt: ['MOQ: 5 toneladas', 'Embalagem: Big Bag/Contêiner', 'Prazo: 15-30 dias', 'Pagamento: T/T, L/C'],
          ru: ['Минимальный заказ: 5 тонн', 'Упаковка: Биг-бэг/Контейнер', 'Срок поставки: 15-30 дней', 'Оплата: T/T, L/C'],
          ar: ['الحد الأدنى للطلب: 5 أطنان', 'التغليف: كيس كبير/حاوية', 'وقت التسليم: 15-30 يوم', 'الدفع: T/T، L/C']
        },
        images: ['/plastic-1.jpg', '/plastic-2.jpg', '/rubber-3.jpg', '/rubber-4.jpg']
      },
      '5': {
        name: { 
          zh: '纺织品皮革', 
          en: 'Textiles & Leather', 
          ja: '繊維皮革',
          ko: '섬유 가죽',
          es: 'Textiles y Cuero',
          fr: 'Textiles et Cuir',
          de: 'Textilien und Leder',
          pt: 'Têxteis e Couro',
          ru: 'Текстиль и кожа',
          ar: 'المنسوجات والجلود'
        },
        category: { zh: '纺织皮革', en: 'Textile & Leather', ja: '繊維皮革', ko: '섬유 가죽', es: 'Textil y Cuero', fr: 'Textile et Cuir', de: 'Textil und Leder', pt: 'Têxtil e Couro', ru: 'Текстиль и кожа', ar: 'المنسوجات والجلود' },
        description: {
          zh: '出口各类纺织品和皮革制品，包括针纺织品、皮革制品、家用纺织品等。我们提供高品质的面料和成品，满足国际市场的需求。',
          en: 'Exporting various textiles and leather products, including knitted fabrics, leather goods, home textiles, etc. We provide high-quality fabrics and finished products to meet international market demands.',
          ja: '针织品、皮革製品、家庭用纺织品など、各種纺织品と皮革製品を輸出しています。高品質な生地と最終製品をお届けします。',
          ko: '플라천, 가죽 제품, 가정용 섬유 등을 포함한 다양한 섬유 제품과 가죽 제품을 수출합니다.',
          es: 'Exportando diversos textiles y productos de cuero, incluyendo tejidos de punto, artículos de cuero, textiles para el hogar, etc.',
          fr: 'Exportant divers textiles et produits en cuir, incluant des tricots, des articles en cuir, des textiles domestiques, etc.',
          de: 'Wir exportieren verschiedene Textilien und Lederprodukte, einschließlich Strickwaren, Lederartikel, Heimtextilien und mehr.',
          pt: 'Exportando vários têxteis e produtos de couro, incluindo malhas, artigos de couro, têxteis domésticos, etc.',
          ru: 'Экспортируем различные текстильные изделия и кожгалантерею, включая трикотаж, кожаные изделия, домашний текстиль и многое другое.',
          ar: 'نصدر مجموعة متنوعة من المنسوجات ومنتجات الجلد، بما في ذلك الأقمشة المحيكة ومنتجات الجلد والمنسوجات المنزلية والمزيد.'
        },
        features: {
          zh: ['针织面料', '皮革制品', '家纺产品', '服装辅料', '箱包皮具', '鞋类材料'],
          en: ['Knitted Fabrics', 'Leather Goods', 'Home Textiles', 'Garment Accessories', 'Bags & Cases', 'Footwear Materials'],
          ja: ['編み生地', '皮革製品', 'ホーム textiles', '衣料品アクセサリー', 'バッグ・ケース', '鞋材料'],
          ko: ['편직 원단', '가죽 제품', '가정용 섬유', '의류 악세서리', '가방·케이스', '신발 재료'],
          es: ['Tejidos de Punto', 'Artículos de Cuero', 'Textiles para el Hogar', 'Accesorios de Confección', 'Bolsas y Estuches', 'Materiales para Calzado'],
          fr: ['Tissus Tricotés', 'Articles en Cuir', 'Textiles Domestiques', 'Accessoires de Confection', 'Sacs et Étuis', 'Matériaux de Chaussures'],
          de: ['Gestrickte Stoffe', 'Lederwaren', 'Heimtextilien', 'Bekleidungszubehör', 'Taschen und Hüllen', 'Schuhmaterialien'],
          pt: ['Tecidos de Malha', 'Artigos de Couro', 'Têxteis Domésticos', 'Acessórios de Confecção', 'Bolsas e Estojos', 'Materiais para Calçados'],
          ru: ['Трикотажные ткани', 'Кожаные изделия', 'Домашний текстиль', 'Аксессуары для одежды', 'Сумки и чехлы', 'Материалы для обуви'],
          ar: ['الأقمشة المحيكة', 'منتجات الجلد', 'المنسوجات المنزلية', 'إكسسوارات الملابس', 'الحقائب والحالات', 'مواد الأحذية']
        },
        specifications: {
          zh: ['最小起订量：500件', '包装方式：纸箱/编织袋', '交货期：20-40天', '付款方式：T/T、L/C'],
          en: ['MOQ: 500 pieces', 'Packing: Carton/Woven Bag', 'Lead Time: 20-40 days', 'Payment: T/T, L/C'],
          ja: ['最小注文：500個', '梱包：段ボール/織袋', 'リードタイム：20-40日', '支払い：T/T、L/C'],
          ko: ['최소 주문: 500개', '포장: 골판지/직조봉투', '리드타임: 20-40일', '결제: T/T, L/C'],
          es: ['MOQ: 500 piezas', 'Embalaje: Cartón/Bolsa de Tela', 'Plazo: 20-40 días', 'Pago: T/T, L/C'],
          fr: ['Qté min: 500 pièces', 'Emballage: Carton/Sac Tissé', 'Délai: 20-40 jours', 'Paiement: T/T, L/C'],
          de: ['Mindestbestellung: 500 Stück', 'Verpackung: Karton/Gewebesack', 'Lieferzeit: 20-40 Tage', 'Zahlung: T/T, L/C'],
          pt: ['MOQ: 500 peças', 'Embalagem: Caixa/Saco de Tecido', 'Prazo: 20-40 dias', 'Pagamento: T/T, L/C'],
          ru: ['Минимальный заказ: 500 шт.', 'Упаковка: Картон/Тканевый мешок', 'Срок поставки: 20-40 дней', 'Оплата: T/T, L/C'],
          ar: ['الحد الأدنى للطلب: 500 قطعة', 'التغليف: كرتون/كيس قماشي', 'وقت التسليم: 20-40 يوم', 'الدفع: T/T، L/C']
        },
        images: ['/textile-1.jpg', '/textile-2.jpg', '/textile-3.jpg', '/textile-4.jpg']
      }
    };
    
    // 直接使用categoryId获取对应类别的产品数据
    return products[categoryId] || products['1'];
  };

  const product = getProductData();
  const lang = language as keyof typeof product.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            href={`/categories/${categoryId}#products`} 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {language === 'zh' ? '返回产品列表' : 'Back to Products'}
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Product Images */}
          <div className="relative h-64 md:h-80 bg-gray-100">
            <img
              src={product.images[0]}
              alt={product.name[lang] || product.name.zh}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Link href={`/categories/${categoryId}#products`} className="hover:text-blue-600">{t.nav.home || '首页'}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link href="/#products" className="hover:text-blue-600">{t.nav.products || '产品中心'}</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">{product.name[lang] || product.name.zh}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {product.name[lang] || product.name.zh}
            </h1>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-6">
              {product.category[lang] || product.category.zh}
            </span>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description[lang] || product.description.zh}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'zh' ? '产品类别' : language === 'ja' ? '製品カテゴリ' : language === 'ko' ? '제품 카테고리' : language === 'es' ? 'Categorías de Productos' : language === 'fr' ? 'Catégories de Produits' : language === 'de' ? 'Produktkategorien' : language === 'pt' ? 'Categorias de Produtos' : language === 'ru' ? 'Категории продуктов' : language === 'ar' ? 'فئات المنتجات' : 'Product Categories'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(product.features[lang] || product.features.zh).map((feature, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-gray-700">
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {language === 'zh' ? '产品规格' : language === 'ja' ? '製品仕様' : language === 'ko' ? '제품 사양' : language === 'es' ? 'Especificaciones' : language === 'fr' ? 'Spécifications' : language === 'de' ? 'Spezifikationen' : language === 'pt' ? 'Especificações' : language === 'ru' ? 'Характеристики' : language === 'ar' ? 'المواصفات' : 'Specifications'}
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {(product.specifications[lang] || product.specifications.zh).map((spec, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh' ? '对此产品感兴趣？' : 'Interested in this product?'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'zh' ? '联系我们获取详细报价和产品目录' : 'Contact us for detailed quotes and product catalog'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="tel:15999660432"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'zh' ? '立即致电' : 'Call Now'}
                </a>
                <a 
                  href="mailto:daimai.tradepro@gmail.com"
                  className="inline-flex items-center bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {language === 'zh' ? '发送邮件' : 'Send Email'}
                </a>
                <Link 
                  href="/#contact"
                  className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t.nav.consultNow || '在线咨询'}
                </Link>
              </div>
              
              {/* Social Share */}
              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="text-sm text-gray-500 mb-3 text-center">
                  {language === 'zh' ? '分享到社交媒体' : 'Share on Social Media'}
                </p>
                <div className="flex justify-center">
                  <SocialShare 
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={product.name[lang]}
                    description={product.description[lang]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
