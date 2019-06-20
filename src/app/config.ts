// config server url and image storage url here

export class Config {
  private static _serverUrl = 'http://47.102.131.149';

  static get serverUrl(): string {
    return this._serverUrl;
  }

  private static _imageStorageUrl = 'http://adweb-image.oss-cn-shanghai.aliyuncs.com';

  static get imageStorageUrl(): string {
    return this._imageStorageUrl;
  }
}
