"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Package,
  Settings,
  Truck,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

interface CategoryProduct {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  applications: string[];
  products: CategoryProduct[];
}

const categoryData: Record<string, Category> = {
  "1": {
    id: "1",
    name: "日用百货",
    category: "消费品类",
    image: "/daily-goods.jpg",
    description:
      "提供各类日用消费品，包括日用品、家电、母婴用品、化妆品、文具办公用品等。产品覆盖日常生活方方面面，品质优良，价格实惠。",
    features: [
      "精选优质供应商",
      "严格品质管控",
      "丰富的产品种类",
      "便捷的采购渠道",
      "完善的售后服务",
      "具有竞争力的价格",
    ],
    applications: [
      "超市零售",
      "电商平台",
      "连锁便利店",
      "批发分销",
      "企业采购",
    ],
    products: [
      { id: 101, name: "家庭清洁用品", description: "各类清洁剂、洗涤用品", image: "/cosmetics-1.jpg" },
      { id: 102, name: "厨房用品", description: "餐具、炊具、厨房小家电", image: "/appliances-1.jpg" },
      { id: 103, name: "个人护理", description: "洗发水、沐浴露、护肤品", image: "/cosmetics-2.jpg" },
      { id: 104, name: "母婴用品", description: "婴儿纸尿裤、奶瓶、玩具", image: "/stationery-1.jpg" },
    ],
  },
  "2": {
    id: "2",
    name: "建材家居",
    category: "建筑装饰",
    image: "/building-materials.jpg",
    description:
      "提供各类建筑材料和装饰材料，包括钢材、水泥、陶瓷、照明设备等。产品广泛应用于建筑工程和室内装修。",
    features: [
      "国标品质认证",
      "厂家直供价格",
      "专业的技术指导",
      "完善的物流配送",
      "质量保证体系",
      "一站式采购服务",
    ],
    applications: [
      "房地产开发",
      "建筑工程施工",
      "室内装修设计",
      "市政基础设施建设",
      "工业园区建设",
    ],
    products: [
      { id: 201, name: "钢材管材", description: "各类建筑用钢材、管材", image: "/tiles-1.jpg" },
      { id: 202, name: "水泥沙石", description: "建筑用水泥、砂石材料", image: "/tiles-2.jpg" },
      { id: 203, name: "陶瓷瓷砖", description: "各类建筑陶瓷、瓷砖", image: "/tiles-3.jpg" },
      { id: 204, name: "照明灯具", description: "室内外照明设备", image: "/lighting-1.jpg" },
    ],
  },
  "3": {
    id: "3",
    name: "智能设备",
    category: "科技产品",
    image: "/smart-devices.jpg",
    description:
      "提供各类智能设备和配件，包括智能农机、无人机、智能家居、智能穿戴等。产品融合前沿科技，创新设计理念。",
    features: [
      "前沿科技产品",
      "创新设计理念",
      "智能化解决方案",
      "国际品质认证",
      "定制化服务",
      "全球联保支持",
    ],
    applications: [
      "智能家居",
      "健康管理",
      "交通出行",
      "工业自动化",
      "智慧城市",
    ],
    products: [
      { id: 301, name: "智能农机装备", description: "农业自动化设备", image: "/smart-home-1.jpg" },
      { id: 302, name: "智能无人机", description: "商用及消费级无人机", image: "/smart-home-2.jpg" },
      { id: 303, name: "智能家居", description: "智能家居控制系统", image: "/smart-home-3.jpg" },
      { id: 304, name: "智能穿戴", description: "智能手表、手环等", image: "/smart-home-4.jpg" },
    ],
  },
  "4": {
    id: "4",
    name: "化工能源",
    category: "工业原材料",
    image: "/chemical-products.jpg",
    description:
      "提供各类化工产品和能源物资，包括塑料制品、橡胶、石油制品、煤炭、矿石等。产品广泛应用于工业生产领域。",
    features: [
      "安全可靠的品质",
      "专业的化工资质",
      "严格的安全管控",
      "专业的运输体系",
      "合规的资质认证",
      "稳定的供应能力",
    ],
    applications: [
      "石油化工",
      "塑料加工",
      "橡胶制品",
      "能源发电",
      "冶金矿产",
    ],
    products: [
      { id: 401, name: "塑料原料", description: "各类工业塑料原料", image: "/plastic-1.jpg" },
      { id: 402, name: "橡胶制品", description: "工业用橡胶制品", image: "/rubber-1.jpg" },
      { id: 403, name: "石油化工产品", description: "各类石油化工原料", image: "/plastic-3.jpg" },
      { id: 404, name: "金属矿石", description: "各类工业用金属矿石", image: "/rubber-3.jpg" },
    ],
  },
  "5": {
    id: "5",
    name: "纺织品皮革",
    category: "纺织服装",
    image: "/textile-products.jpg",
    description:
      "提供各类纺织品和皮革制品，包括针纺织品、皮革制品、家用纺织品等。产品涵盖服装、家居等多个领域。",
    features: [
      "优质的面料品质",
      "精湛的制作工艺",
      "时尚的设计风格",
      "多样的产品选择",
      "良好的穿着体验",
      "具有竞争力的价格",
    ],
    applications: [
      "服装制造",
      "家居纺织",
      "皮革制品加工",
      "家纺用品",
      "鞋帽配饰",
    ],
    products: [
      { id: 501, name: "服装面料", description: "各类服装用纺织品", image: "/textile-1.jpg" },
      { id: 502, name: "家纺用品", description: "床上用品、窗帘等", image: "/textile-2.jpg" },
      { id: 503, name: "皮革制品", description: "箱包、皮具等", image: "/textile-3.jpg" },
      { id: 504, name: "鞋材面料", description: "各类鞋类用材料", image: "/textile-4.jpg" },
    ],
  },
};

export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function loadCategory() {
      const { id } = await params;
      const cat = categoryData[id];
      if (cat) {
        setCategory(cat);
      }
    }
    loadCategory();
  }, [params]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            未找到该产品类别
          </h1>
          <Link
            href="#products"
            className="text-blue-600 hover:text-blue-700"
          >
            返回产品列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/#products"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">返回产品展示</span>
            </Link>
            <div className="flex items-center space-x-4">
              <a
                href="tel:15999660432"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Phone className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">15999660432</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
              {category.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              {category.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Products Grid */}
        <section id="products" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">产品列表</h2>
            </div>
            <span className="text-gray-500">{category.products.length} 个产品</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product, idx) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">产品优势</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center bg-white rounded-lg p-4 shadow-sm"
              >
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Applications Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Globe className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">应用领域</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {category.applications.map((app, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
              >
                <span className="text-blue-800 font-medium">{app}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">立即咨询 {category.name}</h2>
            <p className="text-lg text-white/90 mb-8">
              专业团队为您提供一对一服务，了解更多产品详情和报价
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:15999660432"
                className="flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                电话咨询
              </a>
              <a
                href="mailto:daimai.tradepro@gmail.com"
                className="flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                邮件咨询
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>
            &copy; 2024 大迈国际贸易有限公司. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
