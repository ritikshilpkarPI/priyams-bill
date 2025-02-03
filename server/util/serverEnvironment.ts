export const SERVER_ENVIRONMENT = Object.freeze({
    NODE_ENV: process.env.NODE_ENV || "dev",
    SERVER_PORT: process.env.SERVER_PORT || 3001,
})