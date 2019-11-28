import '@babel/polyfill';
import loadCommerce from './commerce';
import loadStore from './store';
import jQuery from 'jquery';

loadCommerce();
loadStore();

// Expose jQuery
window.$ = jQuery;
