import type { HeaderLink, SiteConfig } from '@/types/config';

export const siteConfig: SiteConfig = {
  siteTitle: 'GLSL Sketch Note',
  siteDesc: 'GLSL Sketch Note',
  siteUrl: 'https://nono-k.github.io',
  siteBase: 'glsl-sketch-note',
  siteType: 'website',
  siteLocale: 'ja_JP',
  siteIcon: '/favicon.svg',
  siteImg: '/ogp.png',
};

export const headerLink: HeaderLink[] = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
];
