/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Serve static assets from the dist directory
      if (url.pathname.startsWith('/assets/')) {
        return env.ASSETS.fetch(request);
      }

      // For all other routes, serve index.html
      const indexRequest = new Request(`${url.origin}/index.html`, request);
      return env.ASSETS.fetch(indexRequest);
    } catch (error) {
      // Log the error and return a 500 response
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}; 