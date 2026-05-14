'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">隐私政策</h1>
        <p className="text-gray-500 mb-8">最后更新日期：2024年1月1日</p>

        <div className="bg-white rounded-lg shadow-sm p-8 prose prose-sm max-w-none">
          <h2>1. 引言</h2>
          <p>
            大迈国际贸易有限公司（以下简称"我们"）非常重视您的隐私。本隐私政策说明了我们如何收集、使用、披露、传输和存储您的个人信息。通过使用我们的网站和服务，您同意本隐私政策中描述的做法。
          </p>

          <h2>2. 我们收集的信息</h2>
          <h3>2.1 您提供给我们的信息</h3>
          <ul>
            <li><strong>账户信息</strong>：姓名、电子邮箱、电话号码、公司名称、地址等</li>
            <li><strong>订单信息</strong>：购买的产品、付款信息、配送地址等</li>
            <li><strong>沟通信息</strong>：您发送给我们的消息、咨询、反馈等</li>
            <li><strong>询盘信息</strong>：通过RFQ表格提交的产品需求信息</li>
          </ul>

          <h3>2.2 我们自动收集的信息</h3>
          <ul>
            <li><strong>设备信息</strong>：IP地址、浏览器类型、操作系统、设备标识符</li>
            <li><strong>使用信息</strong>：访问的页面、停留时间、点击行为、搜索查询</li>
            <li><strong>位置信息</strong>：基于IP地址的大致地理位置</li>
            <li><strong>Cookie信息</strong>：详见我们的Cookie政策</li>
          </ul>

          <h2>3. 我们如何使用您的信息</h2>
          <ul>
            <li>处理和完成您的订单</li>
            <li>提供客户服务和支持</li>
            <li>发送订单更新、发货通知和相关沟通</li>
            <li>回应您的询盘和问题</li>
            <li>改进我们的网站、产品和服务</li>
            <li>进行市场调研和分析</li>
            <li>防止欺诈和保障安全</li>
            <li>遵守法律义务</li>
          </ul>

          <h2>4. 信息分享</h2>
          <p>我们可能在以下情况下分享您的信息：</p>
          <ul>
            <li><strong>服务提供商</strong>：支付处理商、物流公司、云服务提供商等</li>
            <li><strong>业务合作伙伴</strong>：经您同意后与合作伙伴共享</li>
            <li><strong>法律要求</strong>：响应法律程序或政府要求</li>
            <li><strong>业务转让</strong>：在合并、收购或资产出售时</li>
          </ul>
          <p>我们不会向第三方出售您的个人信息。</p>

          <h2>5. 国际数据传输</h2>
          <p>
            作为一家国际贸易公司，您的信息可能会被传输到您所在国家以外的国家进行处理。我们将采取适当的安全措施来保护您的信息，包括：
          </p>
          <ul>
            <li>标准合同条款（SCC）</li>
            <li>数据传输协议</li>
            <li>技术保护措施（加密）</li>
          </ul>

          <h2>6. 您的权利（GDPR）</h2>
          <p>根据欧盟通用数据保护条例（GDPR），您拥有以下权利：</p>
          <ul>
            <li><strong>访问权</strong>：获取我们持有的关于您的个人信息的副本</li>
            <li><strong>更正权</strong>：更正不准确或不完整的信息</li>
            <li><strong>删除权</strong>：要求删除您的个人信息</li>
            <li><strong>限制处理权</strong>：限制我们如何使用您的信息</li>
            <li><strong>数据可携权</strong>：以结构化格式获取您的数据</li>
            <li><strong>反对权</strong>：反对某些类型的处理</li>
            <li><strong>撤回同意权</strong>：随时撤回您之前给予的同意</li>
          </ul>
          <p>要行使这些权利，请通过 <a href="mailto:privacy@damai.com">privacy@damai.com</a> 联系我们。</p>

          <h2>7. 您的权利（CCPA）</h2>
          <p>根据加州消费者隐私法案（CCPA），加州居民拥有以下权利：</p>
          <ul>
            <li>知情权：了解我们收集哪些信息以及如何使用</li>
            <li>删除权：要求删除个人信息</li>
            <li>选择退出权：选择退出个人信息销售（我们不出售个人信息）</li>
            <li>非歧视权：行使隐私权利不会受到歧视</li>
          </ul>

          <h2>8. 数据安全</h2>
          <p>我们采取以下措施保护您的信息：</p>
          <ul>
            <li>SSL/TLS加密传输</li>
            <li>数据存储加密</li>
            <li>访问控制和身份验证</li>
            <li>定期安全审计</li>
            <li>员工隐私培训</li>
          </ul>

          <h2>9. 数据保留</h2>
          <p>
            我们只会在实现本政策所述目的所需的期限内保留您的个人信息，或法律要求或允许的期限内。一般来说：
          </p>
          <ul>
            <li>账户信息：账户活跃期间</li>
            <li>订单信息：法律要求的会计记录期限（通常7年）</li>
            <li>营销信息：直到您选择退出的最长保存期限</li>
          </ul>

          <h2>10. Cookie</h2>
          <p>
            我们使用Cookie和类似技术来改善您的体验。详见我们的
            <Link href="/cookies" className="text-blue-600 hover:underline">Cookie政策</Link>。
          </p>

          <h2>11. 儿童隐私</h2>
          <p>
            我们的服务不面向18岁以下的人员。我们不会故意收集儿童的个人信息。如果我们发现我们无意中收集了儿童的信息，我们将采取措施删除该信息。
          </p>

          <h2>12. 政策更新</h2>
          <p>
            我们可能会不时更新本隐私政策。重大变更时，我们将通过电子邮件或网站通知您。建议您定期查看本政策。
          </p>

          <h2>13. 联系我们</h2>
          <p>如果您对本隐私政策有任何疑问，请联系我们：</p>
          <ul>
            <li>电子邮件：<a href="mailto:privacy@damai.com">privacy@damai.com</a></li>
            <li>电话：+86-159-9966-0432</li>
            <li>地址：中国海南省海口市龙华区大同路XX号</li>
            <li>欧盟数据保护官（DPO）：dpo@damai.com</li>
          </ul>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="font-medium">监管投诉权</p>
            <p className="text-sm text-gray-600 mt-2">
              如果您认为我们对您的个人信息处理不当，您有权向数据保护监管机构提出投诉。
              欧盟居民的监管机构是您所在国家的数据保护局。
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/terms" className="text-blue-600 hover:underline">使用条款</Link>
          <span>·</span>
          <Link href="/cookies" className="text-blue-600 hover:underline">Cookie政策</Link>
          <span>·</span>
          <Link href="/shipping" className="text-blue-600 hover:underline">配送政策</Link>
        </div>
      </div>
    </div>
  );
}
