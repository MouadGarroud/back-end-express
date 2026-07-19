import env from './env.config.js';

export const morganConfig = env.NODE_ENV === 'production' ? 'combined' : 'dev';
