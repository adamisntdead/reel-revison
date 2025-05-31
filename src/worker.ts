/// <reference types="@cloudflare/workers-types" />

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Try to serve the requested file
      const response = await env.ASSETS.fetch(request);
      
      // If the file exists, return it
      if (response.status === 200) {
        return response;
      }

      // If the file doesn't exist, serve index.html
      return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
    } catch (error) {
      // Log the error and return a 500 response
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}; 