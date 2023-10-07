let BACKEND_URL;

if (process.env.NODE_ENV === 'production') {
  BACKEND_URL = 'http://157.7.205.82:3000';
} else {
  BACKEND_URL = 'http://localhost:3000';
}

export const BASE_URL = BACKEND_URL;