const argon2 = require('argon2');
const hash = '$argon2i$v=19$m=16,t=2,p=1$MzQ1MzQ1NDM0NjM$aJ7QPnIqQmEDZ23WWa0rPA';
const password = 'argon'; // guessing

async function test() {
    try {
        const match = await argon2.verify(hash, password);
        console.log('Match with "argon":', match);
    } catch (e) {
        console.error('Error during verify:', e);
    }
}
test();
