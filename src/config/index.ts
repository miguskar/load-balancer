
if (!('SERVER' in process.env)) {
  dieNoServers();
}

const SERVERS = (process.env.SERVERS as string).split(';');

if (!SERVERS.length) {
  dieNoServers();
}

export const SERVER_URLS = SERVERS;

function dieNoServers() {
  console.log('No servers specified. Input using "SERVERS" environment variable. Separate urls with semicolon (;)');
  process.exit(1);
}