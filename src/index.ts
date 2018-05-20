import app from './app';

const PORT = 3000;

const server = app.listen(PORT, () => console.log(`Load balancer listening on port ${PORT}`));

// Clean shut down
process.on('SIGINT', () => {
  console.log('Waiting for open connections to end');
  server.close((err: Error) => {
    console.log('Terminating express server');
    process.exit(err ? 1 : 0);
  });
});
