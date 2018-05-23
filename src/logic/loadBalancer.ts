import request from 'request-promise';
import { HttpError } from '../utils/errors';

export default class LoadBalancer {
  private serverUrls: string[];
  private nextServerIdx: number;

  constructor(serverUrls: string[]) {
    this.serverUrls = serverUrls;
    this.nextServerIdx = 0;
  }

  async getAvailableServerURL(body: { channelId: string }): Promise<string> {
    const startIdx = this.nextServerIdx;
    const noOfServers = this.serverUrls.length;
    const endIdx = startIdx + noOfServers;
    for (let i = startIdx; i < endIdx; ++i) {
      const serverUrl = this.serverUrls[i % noOfServers];
      try {
        this.nextServerIdx = (i + 1) % noOfServers;
        const { url } = await this.sendRequest(`http://${serverUrl}:3000/allocateStream`, body);
        console.log('setting next index to ', (i + 1) % noOfServers);
        return url;
      } catch (err) {
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
