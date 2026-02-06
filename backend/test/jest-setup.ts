/**
 * Node 22で導入されたWeb Storage API (localStorage, sessionStorage) が
 * Jestのクリーンアップ処理中にアクセスされることで発生する警告を抑制します。
 * また、将来的なリソースリークを防ぐためのグローバルな設定をここで行います。
 */

Object.defineProperty(global, 'localStorage', {
  value: undefined,
  configurable: true,
});

Object.defineProperty(global, 'sessionStorage', {
  value: undefined,
  configurable: true,
});

// Node 22+ のlocalStorage警告を抑制
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args: any[]) => {
  if (typeof warning === 'string' && warning.includes('--localstorage-file')) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return (originalEmitWarning as any).call(process, warning, ...args);
};
