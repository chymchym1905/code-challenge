export default {
  auth: {
    expiry: {
      minutes: 2000
    },
    secret: process.env.AUTH_SECRET,
  },
  env: {
    name: process.env.NODE_ENV || 'development',
    development: process.env.NODE_ENV === 'development',
    production: process.env.NODE_ENV === 'production',
  },
  server: {
    port: process.env.PORT || 3001,
  },
};
