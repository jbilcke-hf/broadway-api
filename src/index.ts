
import { Blob } from "node:buffer"

import express from "express"
import bodyParser from "body-parser"
import queryString from "query-string"
import { parseClap, ClapProject, serializeClap } from "@aitube/clap"
import { parseScriptToClap } from "@aitube/broadway"
import { readLocalOrRemotePlainText } from "@aitube/io"

const app = express()
const port = 3000

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
})

process.on('uncaughtException', (error: Error) => {
  console.error(`Caught exception: ${error}\n` + `Exception origin: ${error.stack}`);
})

// fix this error: "PayloadTooLargeError: request entity too large"
// there are multiple version because.. yeah well, it's Express!
// app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(bodyParser.text());

app.get("/", async (req, res) => {
  res.status(200)
  res.write(`<html>
  <head></head>
  <body style="display: flex;
  align-items: center;
  justify-content: center;

  background-color: #000000;
  opacity: 1;
  background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #000000 7px ), repeating-linear-gradient( #34353655, #343536 );

  ">
    <div style="">
      <p style="">
        <h1 style="
        color: rgba(255,255,255,0.9);
        font-size: 4.5vw;
        text-shadow: #000 1px 0 3px;
        font-family: Helvetica Neue, Helvetica, sans-serif;
        font-weight: 100;
        ">Broadway <span style="font-weight: 400">API</span></h1>

        <pre style="color: rgba(255,255,255,0.7); font-size: 2vw; text-shadow: #000 1px 0 3px;  font-family: monospace;">
$ curl -o screenplay.clap \\
       -X POST \\
       --data-binary @path/to/screenplay.txt \\
       https://jbilcke-hf-broadway-api.hf.space
        </pre>
        <br/>
      </p>
    </div>
  </body>
<html>`)
  res.end()
})


// the export robot has only one job: to export .clap files
app.post("/", async (req, res) => {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const formData = Object.keys(req.body)
  
  const body = formData.length > 0 ? (formData.at(0) || "") : (req.body ||| "")
  
  console.log(`received a POST request to convert a script:\n"${body.slice(0, 120)}..."`)

  try {
    const content: string = await readLocalOrRemotePlainText(body)
    const clap: ClapProject = await parseScriptToClap(content)
    const blob = await serializeClap(clap)
    const arrayBuffer = await blob.arrayBuffer()
    res.status(200)
    res.type('application/x-gzip')
    res.send(Buffer.from(arrayBuffer))
  } catch (err) {
    console.error(`Failed to parse the script: ${err}`)
    res.status(500)
    res.type('text/plain')
    res.send(`Failed to parse the script: ${err}`)
  }
})

app.listen(port, () => {
  console.log(`Open http://localhost:${port}`)
})