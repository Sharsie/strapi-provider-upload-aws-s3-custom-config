# strapi-provider-upload-s3-custom-config

Forked from https://github.com/strapi/strapi
Package: https://github.com/strapi/strapi/tree/v3.0.0-beta.17.5/packages/strapi-provider-upload-aws-s3

Allows custom configuration of the s3 provider through source code through `strapi.config.awsS3` configuration key.

```
    const awsConfig = {
      bucket: '',
      // Prefix on the s3 bucket, e.g. /my/subdir/path/
      basePath: '',
      key: '',
      region: '',
      secret: '',
      ...strapi.config.awsS3,
    };
```

## Resources

- [MIT License](LICENSE.md)

## Links

- [Strapi website](http://strapi.io/)
- [Strapi community on Slack](http://slack.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)
