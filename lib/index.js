import { rerender } from './render';
import { state } from './state';

rerender()

window.state = state;
window.rerender = rerender;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

console.log(`%cBuild: [AIV]{date}[/AIV]`, `font-weight: bold`)