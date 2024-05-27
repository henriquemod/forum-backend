export const env = {
  appPort: process.env.PORT ?? 3001,
  jwtSecret: process.env.JWT_SECRET ?? 'your_access_token_secret',
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET ?? 'your_refresh_token_secret',
  mongoUrl:
    'mongodb://127.0.0.1:27017/petqa?retryWrites=true&loadBalanced=false&replicaSet=rs0&readPreference=primary&connectTimeoutMS=10000',
  bcryptSalt: process.env.BCRYPT_SALT ?? 12
}
