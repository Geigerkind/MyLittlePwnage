import { html } from 'lit-html/lib/lit-extended.js'

const trivia = [
  "A long concatination of words that you can remember easily has a better cryptographic strength than a short password with mixed symbols",
  "Forced frequent password changes weaken the choice of passwords",
  "Uniform random passwords are hard to remember, why not let the user choose them?",
  "Nist recommends: No password expiry without a reason",
  "Nist recommends: Longer passwords have a higher cryptographic strength than complex short ones",
  "Nist recommends: Passwords should have at least 8 characters",
  "Nist recommends: Use password managers, if you can",
  html`Avoid commonly used passwords. Check your choice at <a href=\"https://haveibeenpwned.com/Passwords\">HaveIBeenPwned</a>!`,
];

export function getTrivia() {
  return trivia[Math.floor(new Date().getTime() / 1000 / 60) % trivia.length]
}