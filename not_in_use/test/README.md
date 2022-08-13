## UI - CDK App to create hosting for UI (S3 bucket and Cloudfront distribution) and deploy Angular App.

### Dependencies
 * `aws-sb-sh-base` - registry imports Cognito pool id and Cognito App client id from SH-BASE stack

### Environemnt variables
 * `STAGE` - environment name, eg. dev, prod, acme...
 * `DOMAIN` - base domain name
 * `ALLOWED_EMAILS_PATTERN` - regexp pattern for allowed emails to register in portal

**NOTE**: The variables above are mandatory, there are no defaults for them. Set these variables in Bitbucket deployment variables.

### Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template