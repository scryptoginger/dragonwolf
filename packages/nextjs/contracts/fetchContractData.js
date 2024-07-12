const fetch = require("node-fetch");

fetch(`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then(response => response.json())
  .then(data => {
    console.log({ data });
  })
  .catch(error => {
    console.error(error);
  });
