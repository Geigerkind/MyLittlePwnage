import { html } from 'lit-html/lib/lit-extended.js'

export const imprintTemplate = state => html`
<div class="container">
<h1>Imprint</h1><br />
<b>Contact: MyLittlePwnage@lergin.de</b>
<h1>Credits</h1><br />
<b><a href="https://haveibeenpwned.com">HaveIBeenPwned</a></b>: Provides an useful API to check passwords.<br /><br />
<b><a href="https://github.com/danielmiessler/SecLists/blob/master/Passwords/darkweb2017-top10K.txt">Daniel Miessler</a></b>: Provided password lists.
<b><a href="https://giphy.com">Giphy</a></b>: Providing funny gifs.
<h1>Authors</h1><br />
Created by Malte Laukötter, Jannik Friemann and Tom Dymel.
</div>
`
