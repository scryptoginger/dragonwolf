import { DragonWolf } from '~~/hardhat/contracts/DragonWolf.sol';

const fetchURL = DragonWolf.baseURL;

importJSON() {
    fetch(fetchURL)
        .then(response => response.json())
        .then(data => this.setState({ items: data}));
}
        
        //'https://ipfs.io/ipfs/bafybeichdpu3ded2ccgfznlki6djbtjcly47ho5ftyhi4doimbdfxnp4xe/'