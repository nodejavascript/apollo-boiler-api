# apollo-boiler-api

Real-time dashboards are usually built badly the first time — polling an endpoint that cannot keep up. This is
the other approach, packaged so it can be copied instead of re-derived: device messages arrive on **MQTT**,
the server republishes them as **GraphQL subscriptions**, and an Apollo client draws them the moment they land.

## The path a message takes

```
MQTT topic  ->  async-mqtt subscriber  ->  GraphQL subscription  ->  Apollo client
```

- `apollo-server-express` serves the schema over HTTP and over a web socket.
- `async-mqtt` subscribes to the broker and turns each message into a subscription event.
- `brain.js` is available for a small on-server model where a reading needs a judgement rather than a number.
- `insomnia.json` in the repository root is the ready-made request collection — open it in Insomnia and the
  queries are already written.

## Run it

```bash
npm install
cp .env.example .env    # broker URL, ports and secrets
npm start               # nodemon -r esm index.js
npm test                # standard --verbose
```

## Layout

```
index.js        entry point
src/
  directives/   schema directives
  lib/          shared helpers
  logic/        business rules
  models/       data models
  public/       static assets
  resolvers/    GraphQL resolvers
  routes/       HTTP routes
  typeDefs/     the schema
  validation/   input validation
  views/        server-rendered views
```

## Licence

MIT.
