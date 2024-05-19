const nearAPI = require("near-api-js");
const { keyStores, KeyPair, connect } = nearAPI;

async function initializeConnection() {
  // Create an in-memory key store
  const myKeyStore = new keyStores.InMemoryKeyStore();
  
  // Define your private key
  const PRIVATE_KEY = "ed25519:3PvsESoqprUNdqoddJJceLpgEWoLkEoibvQ5NhRorc6fDcjPX3jcGr4MfansudPnoe9X6fRi4kpYa4ADiv8BzRKQ";
  
  // Create a key pair using the provided private key
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  
  // Add the key pair to the key store
  await myKeyStore.setKey("testnet", "example-account.testnet", keyPair);

  // Define the connection configuration
  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // First create a key store
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
  };

  // Create a connection to the NEAR testnet
  const nearConnection = await connect(connectionConfig);

  const account = await nearConnection.account("example-account.testnet");
  const details = await account.getAccountDetails();
  console.log(details);

  return nearConnection;
}

// Initialize the connection
initializeConnection().then((nearConnection) => {
  console.log("Connected to NEAR Testnet", nearConnection);
}).catch((error) => {
  console.error("Failed to connect to NEAR Testnet:", error);
});
