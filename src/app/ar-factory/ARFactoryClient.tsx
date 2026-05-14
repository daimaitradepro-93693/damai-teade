'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Cpu, 
  Video, 
  Camera, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Navigation,
  Building,
  Factory,
  Users,
  Shield,
  Award,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  MessageSquare
} from 'lucide-react';

export default function ARFactoryClient() {
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const factoryScenes = [
    {
      id: 'entrance',
      name: '工厂大门',
      icon: Building,
      description: '欢迎来到大迈国际贸易工厂，我们的厂区占地50,000平方米',
      features: ['现代化厂区', '24小时安保', '访客接待中心'],
      image: '/images/factory-entrance.jpg'
    },
    {
      id: 'production',
      name: '生产车间',
      icon: Factory,
      description: '全自动化生产线，日产能力超过10,000件',
      features: ['自动化流水线', '精密检测设备', '无尘车间'],
      image: '/images/production-line.jpg'
    },
    {
      id: 'warehouse',
      name: '智能仓储',
      icon: Cpu,
      description: '智能仓储系统，库存管理准确率99.9%',
      features: ['AGV机器人', '智能分拣', '温控系统'],
      image: '/images/smart-warehouse.jpg'
    },
    {
      id: 'quality',
      name: '质检中心',
      icon: Shield,
      description: '严格的质量控制体系，确保每一件产品都符合标准',
      features: ['ISO9001认证', '全检制度', '追溯系统'],
      image: '/images/quality-center.jpg'
    },
    {
      id: 'team',
      name: '研发团队',
      icon: Users,
      description: '专业研发团队，持续创新改进产品',
      features: ['50+工程师', '专利技术', '持续创新'],
      image: '/images/rd-team.jpg'
    },
    {
      id: 'certification',
      name: '认证展示',
      icon: Award,
      description: '获得多项国际认证，品质有保障',
      features: ['ISO14001', 'CE认证', 'FCC认证'],
      image: '/images/certifications.jpg'
    }
  ];

  const stats = [
    { label: '工厂面积', value: '50,000', unit: '㎡', icon: Building },
    { label: '员工人数', value: '500+', unit: '人', icon: Users },
    { label: '日产能力', value: '10,000+', unit: '件', icon: Factory },
    { label: '出口国家', value: '80+', unit: '个', icon: Globe }
  ];

  const handleStartVR = () => {
    alert('VR模式需要VR设备支持，请使用VR头显设备访问此页面。');
  };

  const handleStartAR = () => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          alert('AR模式已启动！请允许摄像头权限以体验增强现实功能。');
        })
        .catch(() => {
          alert('摄像头权限被拒绝，无法启动AR功能。');
        });
    } else {
      alert('您的设备不支持AR功能，请使用支持摄像头的设备。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Smartphone className="w-4 h-4 mr-2" />
            沉浸式体验
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AR 虚拟验厂
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            无需跨国旅行，足不出户即可参观我们的工厂。通过AR/VR技术，
            您可以360°全方位了解我们的生产流程和质量控制体系。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartVR}
            >
              <Headphones className="w-5 h-5 mr-2" />
              VR模式
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
              onClick={handleStartAR}
            >
              <Smartphone className="w-5 h-5 mr-2" />
              AR模式
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-slate-800/50 border-slate-700 text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* VR Player Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 relative">
              {/* 模拟VR播放器界面 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 mx-auto">
                    <Video className="w-12 h-12 text-blue-400" />
                  </div>
                  <p className="text-slate-400 mb-4">点击播放开始虚拟参观</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        暂停
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        播放
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scene Navigation */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-black/50 rounded-full p-1">
                  {factoryScenes.map((scene, index) => (
                    <Button
                      key={scene.id}
                      variant="ghost"
                      size="sm"
                      className={`rounded-full ${activeScene === index ? 'bg-blue-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                      onClick={() => setActiveScene(index)}
                    >
                      {scene.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Scenes Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            选择参观区域
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factoryScenes.map((scene, index) => {
              const Icon = scene.icon;
              return (
                <Card 
                  key={scene.id}
                  className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-blue-500 ${activeScene === index ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}`}
                  onClick={() => setActiveScene(index)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{scene.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400 mb-4">
                      {scene.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {scene.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Device Support */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-center">支持的设备</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Monitor className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">PC端</h3>
                  <p className="text-slate-400 text-sm">
                    使用鼠标拖动查看360°全景，支持主流浏览器
                  </p>
                </div>
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">移动端</h3>
                  <p className="text-slate-400 text-sm">
                    陀螺仪控制视角，支持AR实时叠加功能
                  </p>
                </div>
                <div className="text-center">
                  <Headphones className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">VR设备</h3>
                  <p className="text-slate-400 text-sm">
                    支持主流VR头显，沉浸式体验工厂环境
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="pt-8 pb-8">
              <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                需要预约实地验厂？
              </h2>
              <p className="text-slate-400 mb-6">
                如果您希望进行实地考察，我们可以安排专人接待
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  预约实地验厂
                </Button>
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                  联系客服
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
