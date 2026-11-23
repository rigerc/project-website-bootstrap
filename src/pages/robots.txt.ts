import type { APIRoute } from 'astro';
import { SITE_URL_FALLBACK } from '@/config/site-url';

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() || SITE_URL_FALLBACK).replace(/\/$/, '');
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
