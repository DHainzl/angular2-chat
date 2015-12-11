# angular2-chat

This is an example chat application written with angular2 and sockjs.

# server

The server is a small implementation in node. cd into the `server` subfolder and start it with

```
npm install
node index.js
```

# client

This is where the fun begins. It is written in angular2 (TypeScript) and uses SockJS for the communication with the server.

Open two Terminals. In the first, switch to the `client` subfolder and start the TypeScript Compiler with

```
npm install
npm run tsc
```

In the second one, switch to the `client` subfolder too and then you can start the simple server with

```
npm start
```

It should navigate automatically to the correct server.