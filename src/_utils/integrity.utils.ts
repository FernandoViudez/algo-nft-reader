import axios from 'axios';
import { sha256 } from 'multiformats/hashes/sha2';

export async function getIntegrityB64(url: string) {
  const arrayBuffer = (await axios.get(url, { responseType: 'arraybuffer' })).data;
  const hashBuffer = (await sha256.digest(arrayBuffer)).digest;
  const hex = Buffer.from(hashBuffer).toString('hex');
  return Buffer.from(hex, 'hex').toString('base64');
}
