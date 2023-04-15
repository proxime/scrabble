declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV: 'production' | 'development';
            JWT_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
            MONGO_URI: string;
            PORT: number;
        }
    }
}

export {};
