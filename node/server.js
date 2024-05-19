// Import the framework and instantiate it
import Fastify from 'fastify'
import { spawn } from 'child_process';
import crypto from 'crypto';

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

app.post('/mintNft', async function handler (req, res) {
    const data = req.body;
    const accountId = data.accountId;
    const tokenId = crypto.createHash('sha256');
    tokenId.update(data.title);
    const token = tokenId.digest('hex');
    const title = data.title;
    const media = data.media;
    console.log(`./mint.sh ${accountId} ${token} ${title} ${media}`);
    const mintProcess = spawn('./mint.sh', [accountId, token, title, media]);

    mintProcess.stdout.on('data', (data) => {
        // console.log(`Script output: ${data}`);
        // Check for the confirmation request in the stdout
        if (
            data.toString().includes('account already has a deployed contract')
        ) {
            mintProcess.stdin.write('y\n');
        }
    });

    mintProcess.stderr.on('data', (data) => {
        console.error(`Script stderr: ${data}`);
        res.send({ status: 'error' });
    });

    mintProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Script exited with code ${code}`);
            res.send({ status: 'error' });
        } else {
            res.send({ status: 'success' });
        }
    });
});

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}