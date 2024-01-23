/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_ARCHIVE_URL: string
    VITE_GRAPHQL_URL: string
    VITE_CONRTACT_PK: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
  }