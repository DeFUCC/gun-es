# gun-es

## Gun database ESM build

For use of [GUN](https://gun.eco) in `<script type="module"></script>` environments in browser or in ESM first bundlers like Vite.

## How to install

Install via npm/pnpm/yarn/bun/deno.

```bash
pnpm i gun-es
```

## How to use

Import Gun and SEA as module and use them.

```js
import { Gun, SEA } from "gun-es";

const pair = await SEA.pair();
const gun = Gun();
gun.user().auth(pair);
```

## Key derivation add-on

Original Gun SEA (Security Encryption Authorization) doesn't provide key derivation that coulld be used to deterministically generate key pairs from an arbitrary input. It may be different sources of entropy from just a string to a BIP39 mnemonic, WebAuthn credId, other keypair or just about anything - even an image. You can only generate a random key - this is very secure, but a little limiting.

Now we have a secure key derivation function for Gun. With it we can reliably generate keys from any given input. This opens many new ways for authentication and user creation. Try it!

```js
import { Gun, SEA } from "gun-es";
import derivePair from "gun-es/derive";

const pair = await derivePair("password or another string", [
	"extra",
	"entropy",
	"sources",
]);
const gun = Gun();
gun.user().auth(pair);
```
