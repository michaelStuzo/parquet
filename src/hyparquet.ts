import { ReadStream } from 'node:fs';
import { AsyncBuffer, parquetReadObjects } from 'hyparquet';
import { getFileStream } from './s3.client';

// https://github.com/hyparam/hyparquet/issues/39#issuecomment-2899784502

/**
 * Convert a node ReadStream to ArrayBuffer.
 *
 * Copied from hyparquet/src/utils.ts, to work around https://github.com/hyparam/hyparquet/issues/39.
 */
function readStreamToArrayBuffer(input: ReadStream): Promise<AsyncBuffer> {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [] as Buffer[];
    input.on('data', (chunk) => chunks.push(chunk as Buffer));
    input.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(
        buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        )
      );
    });
    input.on('error', reject);
  });
}

const run = async () => {
  const fileStream = getFileStream();
  const file = await readStreamToArrayBuffer(fileStream);
  const data = await parquetReadObjects({ file });
  console.log(data);
};

run()
  .then(() => console.log('Done'))
  .catch((err) => console.error('Error:', err));

// I always get this error no matter how I import hyparquet and what node version I use:
// Error: No "exports" main defined in /Users/myali/Documents/Code/parquet/node_modules/hyparquet/package.json
