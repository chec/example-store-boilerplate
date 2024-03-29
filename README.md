# Commerce.js boilerplate

Use this boilerplate to generate a bare-bones example storefront + cart + checkout using Commerce.js. 

Use the test data provided, or add your Chec account's public API key to pull product data.

![](https://github.com/chec/example-store-boilerplate/blob/master/public/assets/images/Screen%20Shot%202020-06-22%20at%205.09.45%20PM.png)

## Requirements

You will need the following to run this store:

* NodeJS, v8/10 or newer
* Yarn, or npm

## Getting started

To run the store (from your command line):

* Clone this project, e.g. `git clone https://github.com/chec/example-store-boilerplate.git`
* Navigate into the folder, e.g. `cd example-store-boilerplate`
* Install the dependencies, e.g. `yarn` or `npm install`
* Create a `.env` file (you can use `.env.example` as a template) and insert your Chec public key as `MIX_CHEC_API_KEY`
* Start the dev server, e.g. `yarn hot` or `npm run hot`

This will start a local server running on http://localhost:8080, which you can use to test it out.

## How it works

This store has a couple of basic HTML pages (see `public/index.html` for example) which load up some JavaScript and
CSS. From here we use a series of JavaScript functions (see `src/js/store.js`) to communicate with the
[Commerce.js SDK](https://github.com/chec/commerce.js) and render products and cart information on the page.

These calls are often wrapped in jQuery AJAX requests, and the results are passed through
[Handlebars](https://handlebarsjs.com/) templates in order to keep the dynamic requests templated for the examples.

Here are the libraries and tools we use in this example:

* CSS: Bootstrap, with some custom SCSS
* JavaScript: a mix of vanilla/ES6 and jQuery, compiled with Laravel Mix
* Markup: Standard HTML, with dynamic templates using Handlebars
* Build: Node.js with Yarn (or NPM) 

Everything you see in this repository is an example of how you could use Commerce.js in your own project. You are
of course free to modify the code in this repository as you please. Commerce.js can be implemented into any frontend
framework. For more information, see [the Commerce.js documentation](https://commercejs.com/docs).

## Issues

If you find any problems with this example store, please feel free to raise an issue on
[our GitHub repository](https://github.com/chec/example-store-boilerplate/issues). Pull requests are also welcomed!

## License

BSD-3-Clause - see [LICENSE.md](LICENSE.md).

## ⚠️ Note

### This repository is no longer maintained
However, we will accept issue reports and contributions for this repository. See the [contribute to the commerce community](https://commercejs.com/docs/community/contribute) page for more information on how to contribute to our open source projects. For update-to-date APIs, please check the latest version of the [API documentation](https://commercejs.com/docs/api/).
