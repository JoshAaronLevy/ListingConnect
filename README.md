# Deployment Notes Using [docker-machine](https://docs.docker.com/machine/install-machine/)

> **All `npm run` commands are defined in `package.json`**

## Steps to deploy to live server

#### First time only! -- Connect to docker host w/ [docker-machine](#install-docker-machine) (v0.6 required)
`npm run docker-init-server`

#### Before Deploying, Run this to Target Your Environment:
`eval $(docker-machine env listingconnect.com)`

> Test with `docker-machine ls` - no errors means we're good to proceed.

#### After A `grunt build` - We're ready to package the code for deployment:
`npm run docker-build-server`

#### Finally deploy with docker: (may take a little while, it's not frozen...)
`npm run docker-deploy-server`

`docker-compose down` - if a 'port in use' error occurs.

`npm run docker-run-server` - if any issues with the deploy command above.

#### If needed, SSH To LC Server:

```sh
ssh root@listingconnect.com
```


<a id='install-docker-machine'></a>
### Install Docker Machine v0.6

```sh
# check current version with:
docker-machine -v
# Install w/ the following:
sudo curl -L https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > sudo /usr/local/bin/docker-machine
sudo chmod +x /usr/local/bin/docker-machine
```


# EVERYTHINGISAWESOME

## API Setup - W/ Docker

```sh
cd api/
docker build -t lc-api .
# run in a console window:
docker run -p '3000:3000' -it --rm --name proxy1 lc-api
# run as service (background)
docker run -p '3000:3000' -d --name proxy1 lc-api
# STOP + REMOVE old instance
docker stop proxy1 && docker rm proxy1

```


Now visit http://172.17.42.1:3030/parse/auth?



#### Tried this WYSIWYG, and it uses angular
https://cdnjs.cloudflare.com/ajax/libs/textAngular/1.4.3/dist/textAngular.min.js
https://cdnjs.cloudflare.com/ajax/libs/textAngular/1.4.3/dist/textAngular-rangy.min.js
https://cdnjs.cloudflare.com/ajax/libs/textAngular/1.4.3/dist/textAngular-sanitize.min.js

https://cdnjs.cloudflare.com/ajax/libs/textAngular/1.4.3/dist/textAngular.css

#### Try this WYSIWYG
https://github.com/TerryMooreII/angular-wysiwyg

#### ~Try~ Tried NicEdit, not quite

> You may need these:
> export PARSE_APP_KEY="ibtGE3QDskKpCPPaQEngFdhn7balw7XKvSdH3p0L"
> export PARSE_JS_KEY="Uog161Iu2u8UgxxCFuLMf5tjhtpEv3K2AlL5t4DU"
> export PARSE_REST_KEY="gp4DhNptzgBsoxxvzlmTkw83yYbolZQC5dc73UOx"


```sh

export PARSE_APP_KEY=NMdx1O7ox42GXs7AgEzmEEK5ciV7d8swXGpxpIgm
export PARSE_REST_KEY=mHKKpFdSemWRUoC0Dz59AG3kF2EXtKvbXtlMsroV
export PARSE_JS_KEY=Uog161Iu2u8UgxxCFuLMf5tjhtpEv3K2AlL5t4DU


<!-- {"createdAt":"2015-09-13T14:27:24.563Z","email":"a","name":"a","objectId":"hs6Qqp67V6","phone":"a","shippingAddress1":"a","shippingAddress2":"a","shippingAttn":"a","shippingCity":"a","shippingState":"a","shippingZip":0,"sponsor":"a","subscription":"a","termsAgreed":true,"updatedAt":"2015-09-13T14:27:37.507Z"} -->
# Create a user:
#
curl -X POST \
  -H "X-Parse-Application-Id: $PARSE_APP_KEY" \
  -H "X-Parse-REST-API-Key: $PARSE_REST_KEY" \
  -H "X-Parse-Revocable-Session: 1" \
  -H "Content-Type: application/json" \
  -d '{"username":"josh@test.com","password":"josh","phone":"123-456-7890","email":"josh@test.com"}' \
  http://172.17.42.1:3030/parse/users
  https://api.parse.com/1/users
  #http://172.17.42.1:3030/parse/users
  #https://api.parse.com/1/users

# Needs real
curl -X POST \
  -H "X-Parse-Application-Id: $PARSE_APP_KEY" \
  -H "X-Parse-Master-Key: " \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Moderators",
        "ACL": {
          "*": {
            "read": true
          }
        }
      }' \
  https://api.parse.com/1/roles

# LOGIN WORKS!!!
curl -X POST -H "Content-Type: application/json" -G \
  --data-urlencode 'username=dan' \
  --data-urlencode 'password=1aldwych' \
  http://172.17.42.1:3030/auth

# List roles
curl -X GET \
  -H "X-Parse-Application-Id: $PARSE_APP_KEY" \
  -H "X-Parse-REST-API-Key: $PARSE_REST_KEY" \
  -H "Content-Type: application/json" \
  http://172.17.42.1:3030/parse/roles

# Random ID Generator
$scope.property.propertyID = Math.random().toString().substr(1,6);

# Update the referenced User ID's + MASTER KEY below!!!!
curl -X PUT \
  -H "X-Parse-Application-Id: $PARSE_APP_KEY" \
  -H "X-Parse-Master-Key: 780ORnxW7koH5mr1P0lfFRMnU7QOiL19cDjrXJeV" \
  -H "Content-Type: application/json" \
  -d '{
        "users": {
          "__op": "AddRelation",
          "objects": [
            {
              "__type": "Pointer",
              "className": "_User",
              "objectId": "OoTL2XlbwD"
            }
          ]
        }
      }' \
  https://api.parse.com/1/roles/SmL59iJzxQ

curl -X GET \
 -H "X-Parse-Application-Id: NMdx1O7ox42GXs7AgEzmEEK5ciV7d8swXGpxpIgm" \
 -H "X-Parse-REST-API-Key: mHKKpFdSemWRUoC0Dz59AG3kF2EXtKvbXtlMsroV" \
 https://api.parse.com/1/roles/SmL59iJzxQ


# Update the referenced User ID's + MASTER KEY below!!!!
curl -X POST \
  -H "X-Parse-Application-Id: $PARSE_APP_KEY" \
  -H "X-Parse-REST-API-Key: $PARSE_REST_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Admins",
        "ACL": {
          "*": {
            "read": true
          }
        },
        "users": {
          "__op": "AddRelation",
          "objects": [
            {
              "__type": "Pointer",
              "className": "_User",
              "objectId": "wmfkO5z9iA"
            }
          ]
        }
      }' \
  http://172.17.42.1:3030/parse/roles


curl -X POST \
  -H "X-Parse-Application-Id: ibtGE3QDskKpCPPaQEngFdhn7balw7XKvSdH3p0L" \
  -H "X-Parse-REST-API-Key: gp4DhNptzgBsoxxvzlmTkw83yYbolZQC5dc73UOx" \
  -H "Content-Type: application/json" \
  -d '{"email":"a","name":"a","phone":"a","shippingAddress1":"a","shippingAddress2":"a","shippingAttn":"a","shippingCity":"a","shippingState":"a","shippingZip":0,"sponsor":"a","subscription":"a","termsAgreed":true}' \
  https://api.parse.com/1/classes/Payment

```
# listingconnect-blog
