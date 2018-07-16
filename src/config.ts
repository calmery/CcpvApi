export default {
  development: {
    username: '',
    password: '',
    database: 'ccpv_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: '',
    password: '',
    database: 'ccpv_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: "DATABASE_URL"
  }
}
