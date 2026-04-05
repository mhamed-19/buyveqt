/**
 * Cloudflare Worker — Reddit JSON proxy for buyveqt.ca
 *
 * Proxies requests to Reddit's JSON API from Cloudflare's network
 * (which Reddit doesn't block, unlike Vercel's IPs).
 * Adds CORS headers so the Vercel app can fetch from it.
 */

const SUBREDDIT = 'JustBuyVEQT';
const UA = 'web:BuyVEQT:1.0 (by /u/buyveqt)';
const ALLOWED_PATHS = ['hot', 'new', 'top', 'about'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || 'https://buyveqt.ca',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    // Parse path: /hot, /new, /top, /about
    const path = url.pathname.replace(/^\//, '').split('/')[0] || 'hot';
    if (!ALLOWED_PATHS.includes(path)) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    // Build Reddit URL
    let redditUrl;
    if (path === 'about') {
      redditUrl = `https://old.reddit.com/r/${SUBREDDIT}/about.json`;
    } else {
      const limit = url.searchParams.get('limit') || '12';
      const t = url.searchParams.get('t') || '';
      redditUrl = `https://old.reddit.com/r/${SUBREDDIT}/${path}.json?limit=${limit}&raw_json=1`;
      if (path === 'top' && t) redditUrl += `&t=${t}`;
    }

    try {
      const res = await fetch(redditUrl, {
        headers: {
          'User-Agent': UA,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Reddit returned ' + res.status }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await res.text();
      return new Response(data, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Fetch failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
