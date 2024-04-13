export const env = {
  appPort: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'your_access_token_secret',
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET ?? 'your_refresh_token_secret',
  mongoUrl:
    process.env.MONGO_URL ?? 'mongodb://rootuser:rootpass@localhost:27017',
  bcryptSalt: process.env.BCRYPT_SALT ?? 12
}
