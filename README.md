---
title: Broadway API
emoji: 🍿🤖
colorFrom: red
colorTo: blue
sdk: docker
pinned: false
app_port: 3000
---

Convert a script to a clap

# Public API

![Broadway-API](broadway-api.jpg)

# Using the API locally

```bash
curl -o screenplay.clap \
     -X POST \
    --data-binary @path/to/screenplay.txt \
    http://localhost:3000
```

# Installation

It is important that you make sure to use the correct version of Node (Node 20)

1. `nvm use`
2. `npm i`
3. clone `.env` to `.env.local`
4. edit `.env.local` to define the secrets / api access keys
5. `npm run start`

# Testing the Docker image

Note: you need to install Docker, and it needs to be already running.

You will also need to build it for *your* architecture.

```bash
docker build --platform linux/arm64 -t broadway-api .
docker run -it -p 7860:7860 broadway-api
```

