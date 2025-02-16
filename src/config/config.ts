export default () => ({
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    database: {
      dialect: process.env.DB_DIALECT || 'mysql', 
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
});

  