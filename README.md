## NFT reader

## Motivation

Abstract the NFTs data manipulation from the business logic. While NFTs can follow different ARC's, this library should abstract the ways of decoding metadata or digital media to show into the different marketplaces.
The main idea is to handle metadata & digital media of the NFT easily, doesn't matter the ARC the NFT is following. You as client, should not understand the ARCs at all to develop under Algorand .

## Available methods (from any NFT following arcs: 3, 19, or 69)

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

- getStandard() should return an array of arcs
- extra-metadata support
- localization metadata field integrity check
- v2:
  - methods for creating NFTs according client needs
