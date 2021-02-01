const AWS = require('aws-sdk/global')

import { parseDate } from '../../utils'

AWS.config.update({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
})

const s3 = new AWS.S3()
const BUCKET = process.env.S3_UPLOAD_BUCKET
const REGION = process.env.S3_UPLOAD_REGION

const params = {
  Bucket: BUCKET,
  Delimiter: '',
  Prefix: '',
}

const createURL = function (file) {
  return `https://${BUCKET}${REGION === 'eu-central-1' ? '.' : '-'}s3${
    REGION === 'us-east-1' ? '' : '-' + REGION
  }.amazonaws.com/${file.Key}`
}

export default async (req, res) => {
  try {
    const response = await s3.listObjectsV2(params).promise()

    res.status(200).json({
      files: response.Contents.map((file) => {
        return {
          url: createURL(file),
          name: file.Key,
          size: file.Size,
          lastModified: parseDate(file.LastModified),
        }
      }),
    })
  } catch (err) {
    res.status(500).json({
      error: err.message,
    })
  }
}
