/**
 * Production environment configuration.
 * Make sure this file is **only** replaced during the `production` build.
 *
 * The Angular app will call the backend through the Nginx proxy at
 * https://server.blog.ienza.tech (defined in website-deployment repo).
 */
export const environment = {
  production: true,
  apiUrl: 'https://server.blog.ienza.tech'
};
