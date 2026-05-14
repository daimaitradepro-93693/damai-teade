/**
 * 广告像素追踪配置
 * 
 * 使用说明：
 * 1. Facebook/Meta Pixel ID 获取方式：
 *    - 登录 https://business.facebook.com/
 *    - 进入「事件管理工具」→「数据源」→「像素」
 *    - 创建或复制您的像素 ID
 * 
 * 2. Google Analytics ID 获取方式：
 *    - 登录 https://analytics.google.com/
 *    - 创建媒体资源，获取衡量 ID（格式：G-XXXXXXXXXX）
 * 
 * 3. Google Ads 转化ID 获取方式：
 *    - 登录 https://ads.google.com/
 *    - 进入「工具和设置」→「转化」
 *    - 创建转化操作，获取转化 ID（格式：AW-123456789）
 */

export const PIXEL_CONFIG = {
  // Facebook/Meta Pixel ID（格式：123456789012345）
  // 填入后启用Facebook广告追踪
  facebookPixelId: '',

  // Google Analytics 4 衡量ID（格式：G-XXXXXXXXXX）
  // 填入后启用Google Analytics追踪
  googleAnalyticsId: '',

  // Google Ads 转化ID（格式：AW-123456789/转化标签）
  // 填入后启用Google Ads转化追踪
  googleAdsConversionId: '',

  // 是否启用追踪（可用于开发环境禁用）
  enabled: process.env.NODE_ENV === 'production',
};

// 检查是否配置了Facebook Pixel
export const hasFacebookPixel = () => {
  return PIXEL_CONFIG.enabled && PIXEL_CONFIG.facebookPixelId.length > 0;
};

// 检查是否配置了Google Analytics
export const hasGoogleAnalytics = () => {
  return PIXEL_CONFIG.enabled && PIXEL_CONFIG.googleAnalyticsId.length > 0;
};

// 检查是否配置了Google Ads转化
export const hasGoogleAdsConversion = () => {
  return PIXEL_CONFIG.enabled && PIXEL_CONFIG.googleAdsConversionId.length > 0;
};
