// Copyright (c) 2025 NTT InfraNet
'use strict'

const {
  S3,
  HeadObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand
} = require('@aws-sdk/client-s3')

const getS3ClientBase = ({
  accessKeyId,
  secretAccessKey,
  sessionToken = ''
}) => {
  const s3Config = {
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken
    },
    region: 'ap-northeast-1'
  }

  return new S3(s3Config)
}

const getStreamAndHeader = async (config, { s3Client = null, key }) => {
  const _s3client = s3Client || getS3ClientBase(await config.assumeRole())
  let code = 200
  let header = null
  let fileStream = null

  try {
    header = await _s3client.send(
      new HeadObjectCommand({ Bucket: config.bucket, Key: key })
    )
  } catch (e) {
    code = e.$metadata.httpStatusCode
  }

  if (code === 200) {
    fileStream = await _s3client.send(
      new GetObjectCommand({ Bucket: config.bucket, Key: key })
    )
  }

  return {
    code,
    header,
    fileStream: fileStream != null ? fileStream : null
  }
}

const getObjectByPrefix = async (config, { s3Client = null, prefix }) => {
  const _s3client = s3Client || getS3ClientBase(await config.assumeRole())

  return _s3client.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: prefix
    })
  )
}

const uploadObject = async (config, { s3Client = null, key, body, length }) => {
  const _s3client = s3Client || getS3ClientBase(await config.assumeRole())

  return _s3client.send(
    new PutObjectCommand({
      Body: body,
      ContentLength: length,
      Bucket: config.bucket,
      Key: key,
      ContentType: 'application/octet-stream'
    })
  )
}

const copyObject = async (
  config,
  {
    s3Client = null,
    sourceObjectKey,
    destObjectKey
  }
) => {
  const _s3client = s3Client || getS3ClientBase(await config.assumeRole())

  return _s3client.send(
    new CopyObjectCommand({
      Bucket: config.bucket,
      CopySource: sourceObjectKey,
      Key: destObjectKey
    })
  )
}

const deleteObject = async (config, { s3Client = null, key }) => {
  const _s3client = s3Client || getS3ClientBase(await config.assumeRole())

  return _s3client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  )
}

module.exports = {
  getS3ClientBase,
  getStreamAndHeader,
  getObjectByPrefix,
  uploadObject,
  copyObject,
  deleteObject
}
