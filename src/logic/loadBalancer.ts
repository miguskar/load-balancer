import request from 'request-promise';
import { HttpError } from '../utils/errors';

/**
 * The Load balancer class uses a round robin strategy to load balance requests to upstream servers
 */
export default class LoadBalancer {
  private serverUrls: string[];
  private nextServerIdx: number;

  constructor(serverUrls: string[]) {
    this.serverUrls = serverUrls;
    this.nextServerIdx = 0;
  }

  /**
   * Returns the next available media server
   * @param body The body of a request
   */
  async getAvailableServerURL(body: { channelId: string }): Promise<string> {
    const startIdx = this.nextServerIdx;
    const noOfServers = this.serverUrls.length;
    const endIdx = startIdx + noOfServers;
    for (let i = startIdx; i < endIdx; ++i) {
      const serverUrl = this.serverUrls[i % noOfServers];
      this.nextServerIdx = (i + 1) % noOfServers;
      try {
        const { url } = await this.sendRequest(`http://${serverUrl}:3000/allocateStream`, body);
        return url;
      } catch (err) {
        // If we ended up here, it means the request either timed out or we got an error
        // When that happens, we should just try the next server until the for loop ends
      }
    }
    throw new HttpError('No servers available', 500);
  }

  /**
   * Sends a request to a server to see if we can direct traffic there
   * @param url The url of the server
   * @param body The request body
   */
  private async sendRequest(
    url: string,
    body: { channelId: string }
  ): Promise<{ url: string; secret: string }> {
    return request(url, { timeout: 1000, method: 'POST', body, json: true });
  }
}
