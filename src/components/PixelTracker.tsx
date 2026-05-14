'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  PIXEL_CONFIG,
  hasFacebookPixel,
  hasGoogleAnalytics,
  hasGoogleAdsConversion
} from '@/lib/pixel-config';

// 广告像素追踪组件
// 用于Google Ads和Facebook/Meta Pixel转化追踪

interface PixelEvents {
  // 页面浏览
  pageView: () => void;
  // 查看产品
  viewProduct: (product: { id: string; name: string; category: string; price: number }) => void;
  // 添加到购物车
  addToCart: (product: { id: string; name: string; category: string; price: number; quantity: number }) => void;
  // 开始结算
  initiateCheckout: (data: { value: number; currency: string; items: Array<{ id: string; name: string; price: number; quantity: number }> }) => void;
  // 完成购买
  purchase: (data: { transactionId: string; value: number; currency: string; items: Array<{ id: string; name: string; price: number; quantity: number }> }) => void;
  // 完成注册
  completeRegistration: (method: string) => void;
  // 提交询盘
  submitInquiry: () => void;
  // 提交报价
  submitQuote: (value: number) => void;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function PixelTracker() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 检查是否有任何追踪配置
  const hasAnyTracking = hasFacebookPixel() || hasGoogleAnalytics() || hasGoogleAdsConversion();

  // Google Ads转化追踪
  const trackGoogleConversion = (eventName: string, params: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.gtag && hasGoogleAdsConversion()) {
      window.gtag('event', 'conversion', {
        send_to: PIXEL_CONFIG.googleAdsConversionId,
        event_name: eventName,
        ...params
      });
    }
  };

  // Facebook Pixel追踪
  const trackFacebookEvent = (eventName: string, params: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.fbq && hasFacebookPixel()) {
      window.fbq('track', eventName, params);
    }
  };

  // Google Analytics事件追踪
  const trackGoogleAnalyticsEvent = (eventName: string, params: Record<string, unknown> = {}) => {
    if (typeof window !== 'undefined' && window.gtag && hasGoogleAnalytics()) {
      window.gtag('event', eventName, params);
    }
  };

  // 暴露追踪函数到全局
  useEffect(() => {
    if (isClient && hasAnyTracking) {
      (window as unknown as Record<string, unknown>).trackPixel = {
        pageView: () => {
          trackGoogleAnalyticsEvent('page_view');
          trackGoogleConversion('page_view');
          trackFacebookEvent('PageView');
        },
        viewProduct: (product: { id: string; name: string; category: string; price: number }) => {
          trackGoogleAnalyticsEvent('view_item', {
            items: [{
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              price: product.price
            }]
          });
          trackGoogleConversion('view_item', {
            items: [{
              id: product.id,
              name: product.name,
              category: product.category,
              price: product.price
            }]
          });
          trackFacebookEvent('ViewContent', {
            content_ids: [product.id],
            content_name: product.name,
            content_category: product.category,
            content_type: 'product',
            value: product.price,
            currency: 'USD'
          });
        },
        addToCart: (product: { id: string; name: string; category: string; price: number; quantity: number }) => {
          trackGoogleAnalyticsEvent('add_to_cart', {
            items: [{
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              price: product.price,
              quantity: product.quantity
            }]
          });
          trackGoogleConversion('add_to_cart', {
            items: [{
              id: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              quantity: product.quantity
            }]
          });
          trackFacebookEvent('AddToCart', {
            content_ids: [product.id],
            content_name: product.name,
            content_type: 'product',
            value: product.price * product.quantity,
            currency: 'USD'
          });
        },
        initiateCheckout: (data: { value: number; currency: string; items: Array<{ id: string; name: string; price: number; quantity: number }> }) => {
          trackGoogleAnalyticsEvent('begin_checkout', {
            value: data.value,
            currency: data.currency,
            items: data.items
          });
          trackGoogleConversion('begin_checkout', {
            value: data.value,
            currency: data.currency,
            items: data.items
          });
          trackFacebookEvent('InitiateCheckout', {
            content_ids: data.items.map(i => i.id),
            content_type: 'product',
            value: data.value,
            currency: data.currency
          });
        },
        purchase: (data: { transactionId: string; value: number; currency: string; items: Array<{ id: string; name: string; price: number; quantity: number }> }) => {
          trackGoogleAnalyticsEvent('purchase', {
            transaction_id: data.transactionId,
            value: data.value,
            currency: data.currency,
            items: data.items
          });
          trackGoogleConversion('purchase', {
            transaction_id: data.transactionId,
            value: data.value,
            currency: data.currency,
            items: data.items
          });
          trackFacebookEvent('Purchase', {
            content_ids: data.items.map(i => i.id),
            content_type: 'product',
            value: data.value,
            currency: data.currency,
            content_name: 'Order ' + data.transactionId
          });
        },
        completeRegistration: (method: string) => {
          trackGoogleAnalyticsEvent('sign_up', { method });
          trackGoogleConversion('sign_up', { method });
          trackFacebookEvent('CompleteRegistration', {
            registration_method: method
          });
        },
        submitInquiry: () => {
          trackGoogleAnalyticsEvent('generate_lead');
          trackGoogleConversion('generate_lead');
          trackFacebookEvent('Lead');
        },
        submitQuote: (value: number) => {
          trackGoogleAnalyticsEvent('generate_lead', { value });
          trackGoogleConversion('generate_lead', { value });
          trackFacebookEvent('Lead', { value });
        }
      };
    }
  }, [isClient, hasAnyTracking]);

  // 如果没有配置任何追踪，不渲染脚本
  if (!hasAnyTracking) {
    return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {hasGoogleAnalytics() && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${PIXEL_CONFIG.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${PIXEL_CONFIG.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {hasFacebookPixel() && (
        <>
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document, 'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_CONFIG.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>

          {/* Facebook Pixel noscript fallback */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${PIXEL_CONFIG.facebookPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}

// 辅助函数 - 在其他组件中使用
export const trackPixel: PixelEvents = {
  pageView: () => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).pageView();
    }
  },
  viewProduct: (product) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).viewProduct(product);
    }
  },
  addToCart: (product) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).addToCart(product);
    }
  },
  initiateCheckout: (data) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).initiateCheckout(data);
    }
  },
  purchase: (data) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).purchase(data);
    }
  },
  completeRegistration: (method) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).completeRegistration(method);
    }
  },
  submitInquiry: () => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).submitInquiry();
    }
  },
  submitQuote: (value) => {
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackPixel) {
      ((window as unknown as Record<string, unknown>).trackPixel as PixelEvents).submitQuote(value);
    }
  }
};
