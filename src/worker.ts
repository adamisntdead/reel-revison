/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    
    // Serve static assets from the dist directory
    if (url.pathname.startsWith('/assets/')) {
      return env.ASSETS.fetch(request);
    }

    // For all other routes, serve index.html
    return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
  }
}; 