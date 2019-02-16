
let servers: string[] = [];

if (process.env.NODE_ENV === 'test') {
  servers = ['test1.example.com', 'test2.example.com'];
} else {
  if (('SERVERS' in process.env)) {
    servers = (process.env.SERVERS as string).split(';');
  } else {
    dieNoServers();
  }
}

export const SERVER_URLS = servers;

function dieNoServers() {
  console.log('No servers specified. Input using "SERVERS" environment variable. Separate urls with semicolon (;)');
  process.exit(1);
}