import { html } from 'lit-html/lib/lit-extended.js'

export const imprintTemplate = state => html`
<div class="container">
<h1>Credits</h1><br />
<b><a href="https://haveibeenpwned.com">HaveIBeenPwned</a></b>: Provides an useful API to check passwords.<br /><br />
<b><a href="https://github.com/danielmiessler/SecLists/blob/master/Passwords/">Daniel Miessler</a></b>: Provided password lists.<br>
<b><a href="https://wolferahm.deviantart.com/">Wolferahm</a></b>: Providing the title image and icon.<br>
<b><a href="https://giphy.com">Giphy</a></b>: Providing funny gifs.<br>
<h1>Authors</h1><br />
Created by <a href="https://lergin.de">Malte Laukötter</a>, Jannik Friemann and Tom Dymel.
<br /><br />
<b>Contact:</b> MyLittlePwnage@lergin.de
</div>
`
