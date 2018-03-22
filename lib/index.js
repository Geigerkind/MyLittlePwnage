import './main.css'
import { rerender } from './render';
import { state } from './state';

rerender()

window.state = state;
window.rerender = rerender;
