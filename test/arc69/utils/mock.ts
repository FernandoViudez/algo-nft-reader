import { SinonStub } from 'sinon';
import { Arc69Metadata } from '../../../src/arc69/types/json.scheme';
import { isJson } from '../../../src/_utils/json';

export const setMockObj = ({
  mockObj,
  emptyResponse = false,
  emptyTxn = false,
  isTxn = true,
  NFTmetadata,
}: {
  mockObj: SinonStub;
  emptyResponse?: boolean;
  emptyTxn?: boolean;
  isTxn?: boolean;
  NFTmetadata?: Arc69Metadata | any;
}) => {
  mockObj.callsFake(() => {
    if (isTxn) {
      return emptyResponse
        ? Promise.resolve(undefined)
        : Promise.resolve({
            note: emptyTxn
              ? undefined
              : Buffer.from(
                  isJson(NFTmetadata) ? JSON.stringify(NFTmetadata) : NFTmetadata
                ).toString('base64'),
          });
    } else {
      return emptyResponse ? {} : NFTmetadata;
    }
  });
};
