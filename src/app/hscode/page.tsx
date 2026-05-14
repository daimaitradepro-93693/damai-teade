'use client';

import { useState } from 'react';
import { Search, Package, FileText, AlertCircle } from 'lucide-react';

const hsCodeDatabase = [
  {
    code: '8471',
    name: '计算机及办公设备',
    nameEn: 'Computers & Office Equipment',
    description: '计算机、自动数据处理设备、显示器、打印机等',
    duty: '0-15%',
    examples: ['笔记本电脑', '台式电脑', '打印机', '扫描仪']
  },
  {
    code: '8517',
    name: '通信设备',
    nameEn: 'Telecommunications Equipment',
    description: '电话机、手机、路由器、交换机等',
    duty: '0-10%',
    examples: ['智能手机', '路由器', '交换机', '对讲机']
  },
  {
    code: '8528',
    name: '电视机及设备',
    nameEn: 'TV & Video Equipment',
    description: '电视机、监视器、投影仪等',
    duty: '0-20%',
    examples: ['液晶电视', 'OLED电视', '投影仪', '监视器']
  },
  {
    code: '9503',
    name: '玩具',
    nameEn: 'Toys',
    description: '各种玩具、模型、拼图等',
    duty: '0-15%',
    examples: ['遥控玩具', '积木', '毛绒玩具', '电子玩具']
  },
  {
    code: '6204',
    name: '女士服装',
    nameEn: "Women's Clothing",
    description: '女式西装、套裙、连衣裙等',
    duty: '10-20%',
    examples: ['西装', '套裙', '连衣裙', '衬衫']
  },
  {
    code: '6203',
    name: '男士服装',
    nameEn: "Men's Clothing",
    description: '男式西装、衬衫、裤子等',
    duty: '10-20%',
    examples: ['西装', '衬衫', '裤子', '夹克']
  },
  {
    code: '6402',
    name: '鞋类',
    nameEn: 'Footwear',
    description: '各种鞋类、靴子、拖鞋等',
    duty: '10-25%',
    examples: ['运动鞋', '皮鞋', '拖鞋', '靴子']
  },
  {
    code: '9403',
    name: '家具',
    nameEn: 'Furniture',
    description: '各种家具、办公家具等',
    duty: '0-15%',
    examples: ['办公桌', '椅子', '沙发', '柜子']
  },
  {
    code: '8422',
    name: '机械及零部件',
    nameEn: 'Machinery & Parts',
    description: '各类机械、设备及零部件',
    duty: '0-15%',
    examples: ['发电机', '泵', '轴承', '齿轮']
  },
  {
    code: '3917',
    name: '塑料制品',
    nameEn: 'Plastic Products',
    description: '塑料管、板、膜等制品',
    duty: '5-15%',
    examples: ['塑料管', '塑料板', '塑料薄膜', '塑料容器']
  },
  {
    code: '5407',
    name: '合成纤维',
    nameEn: 'Synthetic Fibers',
    description: '合成纤维纱线及织物',
    duty: '5-15%',
    examples: ['涤纶丝', '尼龙丝', '合成纤维布', '纱线']
  },
  {
    code: '4819',
    name: '纸制品',
    nameEn: 'Paper Products',
    description: '纸箱、纸盒、纸袋等包装用品',
    duty: '5-10%',
    examples: ['纸箱', '纸盒', '纸袋', '包装纸']
  },
];

export default function HSCodePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<typeof hsCodeDatabase>([]);
  const [selectedCode, setSelectedCode] = useState<typeof hsCodeDatabase[0] | null>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults(hsCodeDatabase);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = hsCodeDatabase.filter(
      item =>
        item.code.includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.nameEn.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.examples.some(ex => ex.toLowerCase().includes(term))
    );
    setResults(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">海关编码查询</h1>
          </div>
          <p className="text-gray-600">输入产品名称或HS编码，查询对应的海关税号和监管条件</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入产品名称或HS编码（如：电脑、电视机、玩具）"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              查询
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {results.map((item) => (
            <div
              key={item.code}
              onClick={() => setSelectedCode(item)}
              className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedCode?.code === item.code ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-xl font-bold text-blue-600">{item.code}</span>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  税率 {item.duty}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.nameEn}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">未找到匹配的HS编码，请尝试其他关键词</p>
          </div>
        )}

        {selectedCode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">{selectedCode.code}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedCode.name}</h3>
                      <p className="text-sm text-gray-500">{selectedCode.nameEn}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCode(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">编码说明</h4>
                  <p className="text-gray-900">{selectedCode.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">关税税率</h4>
                  <p className="text-lg font-semibold text-green-600">{selectedCode.duty}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">常见产品示例</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCode.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      实际税率可能因贸易协定、原产地、具体产品规格而有所不同。建议在正式进出口前咨询专业报关行或海关。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
