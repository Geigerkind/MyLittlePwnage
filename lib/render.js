import { render } from 'lit-html/lib/lit-extended.js';
import { state } from './state';
import { pageTemplate } from './templates/page';

export function rerender() {
  render(pageTemplate(state), document.body)
}

/**
 * changes the page and rerenders the site
 */
export function changePage(newPage){
  state.page = newPage;

  rerender();
}