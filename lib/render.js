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

  gtag('config', window.GA_TRACKING_ID, { 'page_path': `/${newPage}` });

  rerender();
}

if (window.location.pathname.startsWith("/-")){
  import(/* webpackChunkName: "gamelogic" */ './gameLogic').then(({ anonLogin, openGame }) => {
    if(!state.user){
      anonLogin().then(user => {
        openGame(window.location.pathname.substr(1));
  
        changePage('name');
      });
    }else{
      openGame(window.location.pathname.substr(1));

      changePage('name');
    }
  })
}