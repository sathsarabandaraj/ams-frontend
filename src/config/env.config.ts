import dotenv from 'dotenv'

dotenv.config()

export const API_URI = process.env.NEXT_PUBLIC_API_URI ?? 'http://localhost:3000/api'
export const MOBILE_BREADCRUMBS_LIMIT = parseInt(process.env.NEXT_PUBLIC_MOBILE_BREADCRUMBS_LIMIT) ?? 3
export const DESKTOP_BREADCRUMBS_LIMIT = parseInt(process.env.NEXT_PUBLIC_DESKTOP_BREADCRUMBS_LIMIT) ?? 5
