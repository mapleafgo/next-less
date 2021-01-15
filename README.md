# Next.js + Less Support

Use the latest official support for sass to support less

```
npm i @wenkang365t/next-less less
// or
yarn add @wenkang365t/next-less less
```

## Usage

Create a next.config.js in your project

```javascript
// next.config.js
const withLess = require("@wenkang365t/next-less");
module.exports = withLess(
  {
    /* less-loader lessOptions */
  },
  {
    /* config options here */
  }
);
```

Same as official sass, You can use component-level Less via CSS Modules and the `.module.less` extension.
