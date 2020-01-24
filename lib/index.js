'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');

const trimParam = str => (typeof str === 'string' ? str.trim() : undefined);

module.exports = {
  provider: 'aws-s3-custom-config',
  name: 'Amazon Web Service S3 (custom config)',
  auth: {
  },
  init: config => {
    // Create configuration
    const awsConfig = {
      bucket: '',
      basePath: '',
      key: '',
      region: '',
      secret: '',
      ...strapi.config.awsS3,
    };

    // Trim the configuration parameters
    for (const propName in awsConfig) {
      if (awsConfig.hasOwnProperty(propName)) {
        awsConfig[propName] = trimParam(awsConfig[propName]);
      }
    }

    // Check that the required settings are not empty
    const requiredSettings = ['bucket', 'key', 'region', 'secret'];
    for (const propName of requiredSettings) {
      if (!awsConfig[propName]) {
        return {
          upload: () => Promise.reject(
            new Error(
              `AWS S3 is missing configuration value ${propName}. Please provide the setting in custom.json "awsS3" key.`
            )
          ),
          delete: () => Promise.reject(
            new Error(
              `AWS S3 is missing configuration value ${propName}. Please provide the setting in custom.json "awsS3" key.`
            )
          )
        }
      }
    }

    // Trim forward slashes from the base path
    awsConfig.basePath = awsConfig.basePath.replace(/^\/|\/$/g, '');
    // And make sure there is a trailing slash
    awsConfig.basePath += '/';

    // configure AWS S3 bucket connection
    AWS.config.update({
      accessKeyId: awsConfig.key,
      secretAccessKey: awsConfig.secret,
      region: awsConfig.region,
    });

    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {
        Bucket: awsConfig.bucket,
      },
    });

    return {
      upload: file => {
        return new Promise((resolve, reject) => {
          // upload file on S3 bucket
          const path = file.path ? `${awsConfig.basePath}${file.path}/` : awsConfig.basePath;
          S3.upload(
            {
              Key: `${path}${file.hash}${file.ext}`,
              Body: new Buffer(file.buffer, 'binary'),
              ACL: 'public-read',
              ContentType: file.mime,
              ContentDisposition: `attachment; filename="${file.name}"`
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              // set the bucket file url
              file.url = data.Location;

              resolve();
            }
          );
        });
      },
      delete: file => {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${awsConfig.basePath}${file.path}/` : awsConfig.basePath;
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
