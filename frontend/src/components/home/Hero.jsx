import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '../navigation/LocalizedLink';

/**
 * Component Hero hiển thị phần giới thiệu nổi bật ở đầu trang chủ.
 */
const Hero = ({ activeBanners = [] }) => {
  const { t } = useTranslation();
  const mainBanner = activeBanners.length > 0 ? activeBanners[0] : null;

  const defaultHero = {
    title: t('home.hero_title'),
    description: t('home.hero_desc'),
    image: "/images/gummy-hero.png",
    link: "/shop"
  };

  const title = mainBanner?.title || defaultHero.title;
  const description = mainBanner?.title ? t('home.latest_promo') : defaultHero.description;
  const image = mainBanner?.image || mainBanner?.imageUrl || defaultHero.image;
  const ctaLink = mainBanner?.linkUrl || mainBanner?.link || defaultHero.link;

  return (
    <section className="mt-4 md:mt-8 mb-12 md:mb-20 bg-gradient-to-r from-primary/40 to-secondary/10 rounded-[32px] md:rounded-[40px] relative overflow-hidden flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 p-8 md:p-20 z-10 text-center md:text-left">
        <span className="inline-block mb-4 md:mb-6 py-1.5 px-4 rounded-full bg-white/30 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest backdrop-blur-sm">
          {mainBanner ? t('home.hero_badge_campaign') : t('home.hero_badge_limited')}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight md:leading-[1.05] tracking-tight mb-6 md:mb-8 drop-shadow-sm uppercase">
          {title}
        </h1>
        <p className="text-base md:text-xl text-white/90 max-w-sm mx-auto md:mx-0 leading-relaxed mb-8 md:mb-10 font-medium">
          {description}
        </p>
        <LocalizedLink to={ctaLink} className="inline-block">
          <button className="bg-primary text-on_primary font-bold text-sm tracking-wide px-8 py-4 rounded-full flex items-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all mx-auto md:mx-0 shadow-lg shadow-primary/20 uppercase">
            {t('home.hero_cta')} <ArrowRight size={18} />
          </button>
        </LocalizedLink>
      </div>
      
      {/* Hero Right Image */}
      <div className="md:w-1/2 flex justify-center items-center p-8 md:p-0 relative z-10 w-full">
         <div className="w-full max-w-[320px] md:max-w-[450px] aspect-square bg-primary/10 rounded-[28px] md:rounded-[32px] overflow-hidden shadow-xl border-4 border-white/20 relative flex items-center justify-center group">
           <img src={image} alt="Promotion" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
         </div>
      </div>
    </section>
  );
};

export default Hero;
