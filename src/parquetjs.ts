import parquet from '@dsnp/parquetjs';
import { getClient, getParams } from './s3.client';

const run = async () => {
  const reader = await parquet.ParquetReader.openS3(getClient(), getParams());

  // create a new cursor
  const cursor = reader.getCursor();

  // read all records from the file and print them
  let record = null;
  while ((record = await cursor.next())) {
    console.log(record);
  }
};

run()
  .then(() => console.log('Done'))
  .catch((err) => console.error('Error:', err));
