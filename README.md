## Arcs lib

## Available methods
Arc class:
- getStandard(): <arc3 | arc19 | arc69 | custom>
- getAssetMetadata()
- getAssetDigitalMedia()
- validateDigitalMediaIntegrity()
- validateMetadataIntegrity()

## Examples

#### Installation
```
npm i nft-arcs
```

#### Getting started
##### Typescript
```
import { Arc } from 'nft-arcs';
const NFTArc = new Arc({
    token: '',
    host: 'http://localhost',
    port: '8980',
});
```
##### Javascript vanilla
```
const { Arc } = require('nft-arcs');
```

#### Getting metadata from ASA id
```
import { Arc } from 'nft-arcs';
const NFTArc = new Arc({
    token: '',
    host: 'http://localhost',
    port: '8980',
});
const asaId = 1;
const metadata = await NFTArc.getAssetMetadata(asaId);
console.log(metadata);
```

#### From existing Indexer instance
``` 
import { Indexer } from 'algosdk';
const token  = "";
const server = "http://localhost";
const port   = 8980;
const indexerClient = new Indexer(token, server, port);

const NFTArc = new Arc(indexerClient);
```

### TODO:
- testing
- getStandard() should return an array of arcs
- extra-metadata support
- localization metadata field integrity check