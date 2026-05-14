import { Metadata } from 'next';
import ARFactoryClient from './ARFactoryClient';

export const metadata: Metadata = {
  title: 'AR虚拟验厂 - 大迈国际贸易',
  description: '通过AR技术远程参观我们的工厂，了解生产流程和质量控制体系',
};

export default function ARFactoryPage() {
  return <ARFactoryClient />;
}
