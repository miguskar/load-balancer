# Readme for load balancer

This load balancer balances requests in a round-robin fashion between available video-servers. The video-servers responds with a secret and a url, to which the client can then connect and obtain a video stream.

A typical response from a video-server can be
```
{
"url": "http://some-url.stream/svt1?token=12345",
"secret": "abcdef"
}
```
and the load-balancer forwards: 
```
{
"url": "http://some-url.stream/svt1?token=12345"
}
```
If the video-server takes longer than 1 second to respond, or returns a 500, the load balancer tries another video-server instead.

If all the video-servers fails to respond, the load balancer responds with a 500 error.


The `example/` folder contains a fake video-server that can be used for development


## Requirements
- Docker
- Docker-compose
OR 
- Nodejs 8.x (lower may work),
- NPM

## With docker


### Building and running project in a production environment
```
cd example
docker-compose build --no-cache
docker-compose up
```

### Running tests:
`docker-compose -p tests run -p 30
00 --rm load-balancer npm run watch-test`

### Serving project for development (using mock servers)
`docker-compose up`


## Without docker

### Setup
Run `npm i`

### Building project
To build the project, run `npm run build`. The build code will end up in a folder called *dist*.

### Running tests
To test the code, run `npm run test`. If you want to run test the each time the code changes, run `npm run watch-test`.

### Serving project
To serve the project on your local computer, run `npm run serve`.