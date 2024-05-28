if (process.env.NODE_ENV !== 'production') {
  import('dotenv')
    .then((dotenv) => {
      dotenv.config()
    })
    .catch((err) => {
      console.error('Failed to load dotenv:', err)
    })
}

const loadEnv = (key: string): string => {
  const env = process.env[key]

  if (!env) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return env
}

export const env = {
  appPort: loadEnv('PORT'),
  jwtSecret: loadEnv('JWT_SECRET'),
  refreshTokenSecret: loadEnv('REFRESH_TOKEN_SECRET'),
  mongoUrl: `mongodb://127.0.0.1:27017/${loadEnv('MONGO_DB_NAME')}?retryWrites=true&loadBalanced=false&replicaSet=rs0&readPreference=primary&connectTimeoutMS=10000`,
  bcryptSalt: Number(loadEnv('BCRYPT_SALT')),
  features: {
    userActivationByEmail: loadEnv('USER_ACTIVATION_BY_EMAIL') === 'true',
    openAiApiKey: process.env.OPEN_AI_API_KEY,
    aiAcceptanceLevel: Number(process.env.AI_ACCEPTANCE_LEVEL || 10),
    allowAiReplies: process.env.ALLOW_AI_REPLIES === 'true'
  }
}
