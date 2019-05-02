## EmojiFace PWA

Demo: https://javrok.github.io/emojibody/

To run locally

````
yarn install
````
or equivalent ``npm install`` 
 

and then
````$xslt
yarn start
````

For production build run:
````$xslt
yarn build
````

Notes:

- Added Eslint and prettier with Typescript support
- Weird error on the production build (not with webpack-dev-server), found out it was caused by UglifyJS, so I had to disable it.
