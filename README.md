STRUCTURE
* /functions contains the node API. This is deployed to AWS Lambda
  * /functions/src contains the server.js file with the express API and the JSON with product data, working-feature-set.json
  * /functions/local.js sets up the API app to listen on localhost:8080
  * /functions/lambda.js sets up the lambda wrapper for the API app
* /src contains the src files for the web app. npm run build builds this into the /dist dir. 
* /dist is the production distribution. /src and /dist are all deployed to amplify 
* images are hosted on S3
* ignore all the firebase, firestore stuff

RUN LOCALLY
1. go to /functions and run node start. 
2. go root and npm start

DEPLOY API (LAMBDA FUNCTION)
From /functions run npm run deploy, which triggers serverless deploy

DEPLOY WEB APP (AMPLIFY HOSTING)
From root, run amplify publish. It may say there's no changes to deploy, deploy anyway. This command runs npm run build (I think) before deploying, which is nice.

OTHER NOTES
* '/omnibox','/api', '/products' API endpoints are proxied locally to :8080 in webpack-config

GIT STRUCTURE
* master is the production branch
* aws was for setting up the AWS stuff
* develop was the most recently worked on branch before aws
* the others are defunct

TODO
* consolidate AWS services into one Amplify package
* get Add to Cart, omnibox breadcrumb, and tags to work 
* a lot of refactoring
* remove firebase config