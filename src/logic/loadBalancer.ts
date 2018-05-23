import request from 'request-promise';
import { HttpError } from '../utils/errors';

export default class LoadBalancer {
  public static SERVER_URIS = [
    'case1-1.neti.systems',
    'case1-2.neti.systems',
    'case1-3.neti.systems'
  ];
  private static nextIndex = 0;

  static reset() {
    LoadBalancer.nextIndex = 0;
  }

  constructor() {}

  async getAvailableServerURL(body: { channelId: string }): Promise<string> {
    const startIndex = LoadBalancer.nextIndex;
    const noOfServers = LoadBalancer.SERVER_URIS.length;
    const endIndex = startIndex + noOfServers;
    for (let i = startIndex; i < endIndex; ++i) {
      const serverUrl = LoadBalancer.SERVER_URIS[i % noOfServers];
      try {
        LoadBalancer.nextIndex = (i + 1) % noOfServers;
        const { url } = await this.sendRequest(`http://${serverUrl}:3000/allocateStream`, body);
        console.log('setting next index to ', (i + 1) % noOfServers);
        return url;
      } catch (err) {
        console.log('got error', err);
        // If we ended up here, it means the request either timed out or we got an error
        // When that happens, we should try the next server
      }
    }
    return Promise.reject(new HttpError('No servers available', 500));
  }

  private async sendRequest(
    url: string,
    body: { channelId: string }
  ): Promise<{ url: string; secret: string }> {
    return request(url, { timeout: 1000, method: 'POST', body, json: true });
  }
}
