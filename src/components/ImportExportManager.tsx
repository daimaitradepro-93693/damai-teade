'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Upload, FileSpreadsheet, AlertCircle, Check, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  price: string | number;
  description: string;
  specifications: Record<string, string>;
  stock: number;
  status: string;
}

interface ImportExportManagerProps {
  products: Product[];
  onImport: (products: Product[]) => void;
}

export function ImportExportManager({ products, onImport }: ImportExportManagerProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Product[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  // 导出功能
  const exportToCSV = () => {
    const headers = ['ID', '产品名称', '英文名称', '分类', '价格', '描述', '库存', '状态'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.id,
        `"${p.name}"`,
        `"${p.nameEn}"`,
        `"${p.category}"`,
        p.price,
        `"${p.description}"`,
        p.stock,
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToExcel = () => {
    // 简化的Excel导出（实际项目中应使用xlsx库）
    const headers = ['ID', '产品名称', '英文名称', '分类', '价格', '描述', '库存', '状态'];
    const data = [
      headers,
      ...products.map(p => [
        p.id,
        p.name,
        p.nameEn,
        p.category,
        p.price,
        p.description,
        p.stock,
        p.status
      ])
    ];

    // 创建HTML表格（可被Excel打开）
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
    html += '<head><meta charset="UTF-8"></head><body>';
    html += '<table border="1">';
    data.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</table></body></html>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `products_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToExcel();
    }
  };

  // 导入功能
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      parseImportFile(file);
    }
  };

  const parseImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        
        const parsedProducts: Product[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          if (values.length >= 5) {
            parsedProducts.push({
              id: values[0] || `import_${Date.now()}_${i}`,
              name: values[1]?.replace(/"/g, '') || '',
              nameEn: values[2]?.replace(/"/g, '') || '',
              category: values[3]?.replace(/"/g, '') || '',
              price: values[4] || 0,
              description: values[5]?.replace(/"/g, '') || '',
              specifications: {},
              stock: parseInt(values[6]) || 0,
              status: values[7]?.replace(/"/g, '') || 'active'
            });
          } else {
            errors.push(`第${i + 1}行数据格式不正确`);
          }
        }

        setImportPreview(parsedProducts);
        setImportErrors(errors);
      } catch (error) {
        setImportErrors(['文件解析失败，请检查文件格式']);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (importPreview.length > 0) {
      onImport(importPreview);
      setImportSuccess(true);
      setTimeout(() => {
        setImportDialogOpen(false);
        setImportFile(null);
        setImportPreview([]);
        setImportErrors([]);
        setImportSuccess(false);
      }, 2000);
    }
  };

  const downloadTemplate = () => {
    const template = 'ID,产品名称,英文名称,分类,价格,描述,库存,状态\nprod_001,示例产品,Sample Product,分类A,100,产品描述,50,active';
    const blob = new Blob(['\ufeff' + template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'product_import_template.csv';
    link.click();
  };

  return (
    <div className="flex gap-2">
      {/* 导出按钮 */}
      <div className="flex gap-2">
        <Select value={exportFormat} onValueChange={(v: 'csv' | 'excel') => setExportFormat(v)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          导出产品
        </Button>
      </div>

      {/* 导入按钮 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            导入产品
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>导入产品数据</DialogTitle>
            <DialogDescription>
              上传CSV或Excel文件批量导入产品数据
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 下载模板 */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FileSpreadsheet className="w-4 h-4" />
              <span>没有模板？</span>
              <button 
                onClick={downloadTemplate}
                className="text-blue-500 hover:underline"
              >
                下载导入模板
              </button>
            </div>

            {/* 文件上传 */}
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="import-file"
              />
              <Label htmlFor="import-file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  {importFile ? importFile.name : '点击选择文件或拖拽文件到此处'}
                </p>
                <p className="text-xs text-gray-400 mt-1">支持 CSV, Excel 格式</p>
              </Label>
            </div>

            {/* 错误提示 */}
            {importErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">导入错误</span>
                </div>
                <ul className="text-sm text-red-500 space-y-1">
                  {importErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 预览数据 */}
            {importPreview.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <span className="text-sm font-medium">预览数据 ({importPreview.length} 条)</span>
                </div>
                <div className="max-h-60 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">产品名称</th>
                        <th className="px-3 py-2 text-left">分类</th>
                        <th className="px-3 py-2 text-left">价格</th>
                        <th className="px-3 py-2 text-left">库存</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.slice(0, 10).map((product, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{product.name}</td>
                          <td className="px-3 py-2">{product.category}</td>
                          <td className="px-3 py-2">{product.price}</td>
                          <td className="px-3 py-2">{product.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importPreview.length > 10 && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      还有 {importPreview.length - 10} 条数据...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 成功提示 */}
            {importSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>成功导入 {importPreview.length} 条产品数据！</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={importPreview.length === 0 || importSuccess}
            >
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
