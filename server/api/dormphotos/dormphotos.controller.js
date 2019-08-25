const fs = require('fs')
const aws = require('aws-sdk')
const s3 = new aws.S3()
const logger = require('../../modules/logger')

const uuidv4 = require('uuid/v4')

const DormPhoto = require('./dormphotos.model')

const uploadFile = async (dorm, floor, { name: fileName, path: filePath, type: fileType }) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath)
    stream.on('error', function (err) {
      reject(err)
    })

    s3.upload(
      {
        ACL: 'public-read',
        Bucket: 'late-dorm-photos',
        Body: stream,
        Key: `dorm-photo-${dorm}-${floor ? floor + '-' : ''}${uuidv4()}`,
        ContentType: fileType
      },
      function (err, data) {
        if (err) {
          reject(err)
        } else if (data) {
          resolve({ key: data.Key, url: data.Location })
        }
      }
    )
  })
}

async function getDormPhotos (ctx) {
  let dormPhotos

  try {
    dormPhotos = await DormPhoto.find({ confirmed: true })
  } catch (e) {
    logger.error(`Failed to get confirmed dorm photos: ${e}`)
    return ctx.internalServerError('There was an issue grabbing the dorm photos.')
  }

  ctx.ok({ dormPhotos })
}

async function uploadDormPhoto (ctx) {
  if (!ctx.request.files.photo) {
    return ctx.badRequest('You did not upload a photo!')
  }

  const { dorm, floor } = ctx.request.body

  if (!dorm) {
    return ctx.badRequest('You did not specify the dorm!')
  }

  const { key, url } = await uploadFile(dorm, floor, ctx.request.files.photo)

  const newDormPhoto = new DormPhoto({
    _student: ctx.state.user, // might be none
    imageURL: url,
    dorm,
    floor,
    confirmed: false
  })

  ctx.ok({ newDormPhoto })
}

module.exports = {
  getDormPhotos,
  uploadDormPhoto
}
