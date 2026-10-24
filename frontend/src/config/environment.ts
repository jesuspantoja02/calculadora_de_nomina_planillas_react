export const environment = {
  /**
   * Desarrollo: `/api/v1` (proxy en vite.config.ts → localhost:3000).
   * Producción (Render): define `VITE_API_URL` en el build del Static Site.
   */
  apiUrl: import.meta.env.VITE_API_URL ?? '/api/v1',
};
