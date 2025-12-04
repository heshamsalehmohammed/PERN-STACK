const { env } = process;

const envSettings = {
  tz: env.TZ || 'Europe/Athens',
  backendHost: env.BASE_BACKEND_URL || 'http://127.0.0.1:3001/api/',
  accessKey: env.ACCESS_KEY || 'xK9mLp2vQwRt7nYhBjFc',

};

export default envSettings;
