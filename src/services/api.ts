// Base API configuration (Axios instance, interceptors, etc.)
// All API calls should go through this configured instance

import { env } from '@/config/env'

const API_BASE_URL = env.API_BASE_URL

export { API_BASE_URL }
