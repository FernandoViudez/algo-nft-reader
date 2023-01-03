## NFT reader

## Motivation

Abstract the NFTs data manipulation from the business logic. While NFTs can follow different ARC's, this library should abstract the ways of decoding metadata or digital media to show into the different marketplaces.
The main idea is to handle metadata & digital media of the NFT easily, doesn't matter the ARC the NFT is following. You as client, should not understand the ARCs at all to develop under Algorand .

## Supported ARCs

- [ARC 0003](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0003.md)
- [ARC 0019](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
- [ARC 0069](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0069.md)

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
npm i nft-reader
```

#### Getting started

##### Typescript

```
import { NFTReader } from 'nft-reader';
const nftReader = new NFTReader({
    token: '',
    host: 'http://localhost',
    port: '8980',
});
```

##### Javascript vanilla

```
const { NFTReader } = require('nft-reader');
```

#### Getting metadata from ASA id

```
import { NFTReader } from 'nft-reader';
const nftReader = new NFTReader({
    token: '',
    host: 'http://localhost',
    port: '8980',
});
const asaId = 1;
const metadata = await nftReader.getAssetMetadata(asaId);
console.log(metadata);
```

#### From existing Indexer instance

```
import { Indexer } from 'algosdk';
const token  = "";
const server = "http://localhost";
const port   = 8980;
const indexerClient = new Indexer(token, server, port);

const nftReader = new NFTReader(indexerClient);
```

### TODO:

- getStandard() should return an array of arcs
- extra-metadata support
- localization metadata field integrity check

- v2:
  - methods for creating NFTs following each ARC
