const mix = require('laravel-mix');

mix
  .js('src/js/bundle.js', 'public/assets/js')
  .sass('src/sass/bundle.scss', 'public/assets/css')
  .setPublicPath('public');
