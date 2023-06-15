import { log } from 'console';

import fetch, { Response } from 'node-fetch';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
// import { createProxyMiddleware } from 'http-proxy-middleware';

// const options = {
//     target: 'https://api.openai.com/',
//     changeOrigin: true,
//     ws: false,
//     pathRewrite: {
//         '/chat/completions': '/v1/chat/completions'
//     }
// }

// const proxy1 = createProxyMiddleware(options);

const baseURL = 'https://api.openai.com/v1';
const app = express();

const logger = (request, response, next) => {
    log(`data in request:\n${JSON.stringify(request.body)}`);
    next();
}

app.use(bodyParser.json());
app.use(logger);
app.use(cors());


app.post('/', async (request, response) => {
    const { uri } = request.body;
    const gpt_response: Response = await fetch(baseURL + uri, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Authorization': request.headers.authorization
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: request.body.messages
        })
    });

    const stream = gpt_response.body;


    response.setHeader('Content-Type', 'application/json');

    stream.pipe(response);
});


app.listen(3000, () => log(`middleware is running on port 3000`));
