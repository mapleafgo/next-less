# Next.js v9.3+ Less Support

Use the latest official support for sass to support less

```bash
npm i @mapleafgo/next-less less
# or
yarn add @mapleafgo/next-less less
```

## Usage

Create a next.config.js in your project

```javascript
// next.config.js
const withLess = require("@mapleafgo/next-less");
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
