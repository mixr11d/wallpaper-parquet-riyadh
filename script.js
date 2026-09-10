/**
 * ==========================================================================
 * Project: توريد وتركيب ورق الجدران وباركيه الأرضيات في الرياض
 * Architecture: Vanilla JavaScript - High Performance & CRO Engine
 * Features: Lazy Google Ads Tracking, Dev Protection, Quote Calculator & Form WhatsApp Bridge
 * ==========================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. الإعدادات والبيانات الأساسية (Config)
  // --------------------------------------------------------------------------
  const APP_CONFIG = {
    clientPhone: '966559886596',
    clientPhoneFormatted: '0559886596',
    devPhone: '966578539687',
    googleAds: {
      conversionId: 'AW-xxxxxxxxxxxxx',
      callLabel: 'xxxxxxxxxxxxxxxxx',
      whatsAppLabel: 'xxxxxxxxxxxxxx',
      formLabel: 'xxxxxxxxxxxxxxxxxxx'
    },
    pricingRates: {
      'wallpaper-rolls': 25, // سعر تقريبي للفة أو المتر حسب الخدمة
      '3d-wallpaper': 45,
      'linen-wallpaper': 35,
      'wood-parquet': 55,
      'spc-parquet': 65,
      'herringbone-parquet': 80
    }
  };

  // --------------------------------------------------------------------------
  // 2. محرك تتبع إعلانات قوقل فائق الأداء (Lazy Loaded Google Ads Engine)
  // --------------------------------------------------------------------------
  let gtagLoaded = false;

  function isDeveloperSession() {
    // استثناء رقم المطور أو المعاينة المباشرة لمنع حرق الميزانية
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev_preview') === 'true') return true;
    if (localStorage.getItem('is_dev_mode') === 'true') return true;
    return false;
  }

  function initGoogleAdsTracking() {
    if (gtagLoaded || isDeveloperSession()) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG.googleAds.conversionId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', APP_CONFIG.googleAds.conversionId);
    gtagLoaded = true;
  }

  // تحميل التتبع في وضع خمول المعالج بعد تفاعل المستخدم
  function scheduleLazyTracking() {
    const triggerEvents = ['click', 'touchstart', 'scroll'];
    const handler = function () {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initGoogleAdsTracking(), { timeout: 2000 });
      } else {
        setTimeout(initGoogleAdsTracking, 500);
      }
      triggerEvents.forEach(evt => window.removeEventListener(evt, handler));
    };

    triggerEvents.forEach(evt => window.addEventListener(evt, handler, { passive: true, once: true }));
  }

  // إرسال أحداث التحويل الآمنة
  window.reportConversion = function (conversionType, customCallback) {
    if (isDeveloperSession()) {
      console.warn(`[Tracking Bypassed - Dev Mode Active]: Event: ${conversionType}`);
      if (typeof customCallback === 'function') customCallback();
      return;
    }

    if (typeof window.gtag === 'function') {
      let label = '';
      if (conversionType === 'call') label = APP_CONFIG.googleAds.callLabel;
      if (conversionType === 'whatsapp') label = APP_CONFIG.googleAds.whatsAppLabel;
      if (conversionType === 'form') label = APP_CONFIG.googleAds.formLabel;

      window.gtag('event', 'conversion', {
        send_to: `${APP_CONFIG.googleAds.conversionId}/${label}`,
        event_callback: function () {
          if (typeof customCallback === 'function') customCallback();
        }
      });

      // مهلة أمان قصوى 600ms في حال بطء الاتصال
      setTimeout(() => {
        if (typeof customCallback === 'function') {
          customCallback();
          customCallback = null;
        }
      }, 600);
    } else {
      if (typeof customCallback === 'function') customCallback();
    }
  };

  // --------------------------------------------------------------------------
  // 3. إدارة القوائم وتجربة الجوال (Header & Mobile Drawer)
  // --------------------------------------------------------------------------
  function setupNavigation() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-drawer-backdrop');
    const drawerCloseBtn = document.querySelector('.mobile-drawer-close');
    const accordionBtn = document.querySelector('.mobile-accordion-btn');
    const accordionContent = document.querySelector('.mobile-accordion-content');
    const siteHeader = document.querySelector('.site-header');

    function toggleDrawer(open) {
      if (!drawer || !backdrop || !hamburgerBtn) return;
      const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', isOpen);
      backdrop.classList.toggle('is-open', isOpen);
      hamburgerBtn.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => toggleDrawer());
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => toggleDrawer(false));
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => toggleDrawer(false));
    }

    // الأكورديون الخاص بقائمة الخدمات بالجوال
    if (accordionBtn && accordionContent) {
      accordionBtn.addEventListener('click', function () {
        const isExpanded = accordionContent.classList.contains('is-expanded');
        accordionContent.classList.toggle('is-expanded', !isExpanded);
        const icon = accordionBtn.querySelector('.accordion-chevron');
        if (icon) {
          icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      });
    }

    // تأثير رأس الموقع عند التمرير
    window.addEventListener('scroll', function () {
      if (!siteHeader) return;
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 4. زر الصعود للأعلى (Back To Top)
  // --------------------------------------------------------------------------
  function setupBackToTop() {
    const scrollBtn = document.querySelector('.floating-scroll-left');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('is-visible');
      } else {
        scrollBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 5. حاسبة التكلفة ونموذج التسعير الفوري عبر الواتساب
  // --------------------------------------------------------------------------
  function setupQuoteCalculator() {
    const calcForm = document.getElementById('quick-quote-form');
    if (!calcForm) return;

    const serviceSelect = calcForm.querySelector('[name="service_type"]');
    const areaInput = calcForm.querySelector('[name="room_area"]');
    const resultDisplay = document.getElementById('calc-estimate-value');

    function calculateEstimate() {
      if (!resultDisplay || !serviceSelect || !areaInput) return;
      const rate = APP_CONFIG.pricingRates[serviceSelect.value] || 0;
      const area = parseFloat(areaInput.value) || 0;
      const total = rate * area;

      if (total > 0) {
        resultDisplay.textContent = `${total.toLocaleString('ar-SA')} ر.س تقريباً`;
      } else {
        resultDisplay.textContent = '-- ر.س';
      }
    }

    if (serviceSelect) serviceSelect.addEventListener('change', calculateEstimate);
    if (areaInput) areaInput.addEventListener('input', calculateEstimate);

    calcForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const district = calcForm.querySelector('[name="district"]')?.value || 'الرياض';
      const serviceName = serviceSelect?.options[serviceSelect.selectedIndex]?.text || 'استفسار عن الديكورات';
      const areaVal = areaInput?.value || 'غير محددة';

      const messageText = `السلام عليكم ورحمة الله، أود طلب تسعيرة لـ:\n- الخدمة: ${serviceName}\n- الحي المستهدف: ${district}\n- المساحة التقديرية: ${areaVal} م²\n- المصدر: الموقع الإلكتروني`;
      const encodedMsg = encodeURIComponent(messageText);
      const targetUrl = `https://wa.me/${APP_CONFIG.clientPhone}?text=${encodedMsg}`;

      window.reportConversion('form', function () {
        window.open(targetUrl, '_blank');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. تتبع النقرات التلقائي للأزرار العائمة والاتصال
  // --------------------------------------------------------------------------
  function setupConversionClickTrackers() {
    document.addEventListener('click', function (e) {
      const callLink = e.target.closest('a[href^="tel:"]');
      if (callLink) {
        window.reportConversion('call');
        return;
      }

      const waLink = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      if (waLink) {
        window.reportConversion('whatsapp');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. التهيئة عند تحميل المستند
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    scheduleLazyTracking();
    setupNavigation();
    setupBackToTop();
    setupQuoteCalculator();
    setupConversionClickTrackers();
  });

})();
