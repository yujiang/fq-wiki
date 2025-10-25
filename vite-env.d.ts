interface ImportMetaEnv {
  // 在这里添加你需要的环境变量类型（可选）
  // 例如：VITE_API_URL: string;
  DEV: boolean;
  SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}