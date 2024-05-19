import { create } from '@web3-storage/w3up-client'

const client = await create();

console.log("created");

const account = await client.login('mmmzzz66g@gmail.com');

console.log("stuff");

const files = await filesFromPaths(['./images']);

console.log(files)
   
const cid = await client.uploadDirectory(files)

console.log(cid);