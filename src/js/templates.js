/* global window */
import Handlebars from 'handlebars';
import $ from 'jquery';

export default (name) => {
  let template = null;
  $.ajax({
    'async': false,
    'type': 'GET',
    'dataType': 'html',
    'url': `/templates/${name}.hbs`,
    'data': '',
    success: data => {
      template = Handlebars.compile(data);
    },
  });
  return template;
};
