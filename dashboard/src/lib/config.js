const env = process.env.NODE_ENV

export const baseURL = env == "development" ? "http://localhost:9897" : ""
