## EmojiFace PWA

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

- I didn't use any JS framework (React) or any CSS preprocessor since it didn't make sense for such a small application, I don't know if it was expected.
- Added Eslint and prettier with Typescript support

Difficulties found: 
- Some problems with webpack and typescript config.
- Only way to test on iOs was through build & deploy to github.io. Couldn't do it locally, since you need a valid SSL certificate.
  This made mobile test a little bit slow. Next time should build a fast solution to debug on real devices. 
- Performance problems on mobile, getting WebGL error when resolution was to high
- I was getting a weird error on the production build (not with webpack-dev-server), and I found out it was caused by UglifyJS, so I had to disable it.
- I was stuck for a while with the canvas being static when setting <video> to display: none; on iOS only. 
  It is some kind of optimization in Safari, that made me waste a lot of time trying to show the coloured mask image with body parts (as in the demos)
  I realized I don't need to draw a mask (so no canvas needed), just need to calculate the area of the body part (face) and put there the emoji with just CSS
- If I had more time, I'd tweak the threseholds and the emoji placing algorithm, but it's already more time then I expected.