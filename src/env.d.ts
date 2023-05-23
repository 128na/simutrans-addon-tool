/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    APP_NAME: string | undefined;
    APP_VERSION: string | undefined;
    APP_REPOSITORY_URL: string | undefined;
    CSP: string;
  }
}
