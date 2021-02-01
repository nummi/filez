const AWS = require('aws-sdk/global')
const S3 = require('aws-sdk/clients/s3')

AWS.config.update({
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
})

const s3 = new AWS.S3()

const params = {
  Bucket: process.env.S3_UPLOAD_BUCKET,
  Delimiter: '',
  Prefix: '',
}

const prefix = 'https://mythbucket6679.s3.us-east-2.amazonaws.com/'

export default async (req, res) => {
  await s3.listObjectsV2(params, function (err, data) {
    if (err) throw err
    res.status(200).json({
      files: data.Contents.map((file) => {
        return {
          url: prefix + file.Key,
          name: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
        }
      }),
    })
  })
}
