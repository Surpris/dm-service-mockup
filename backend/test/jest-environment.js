const NodeEnvironment = require('jest-environment-node').TestEnvironment;

/**
 * Node 22で導入されたWeb Storage APIがJestの環境クリーンアップ時に
 * 警告を発生させる問題に対処するためのカスタム環境です。
 */
class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // グローバルオブジェクトからStorage APIを削除または無効化します
    if (this.global.localStorage) {
      Object.defineProperty(this.global, 'localStorage', {
        value: undefined,
        configurable: true,
      });
    }
    if (this.global.sessionStorage) {
      Object.defineProperty(this.global, 'sessionStorage', {
        value: undefined,
        configurable: true,
      });
    }
  }
}

module.exports = CustomEnvironment;
