# gun-es

## Gun database ESM build

For use of [GUN](https://gun.eco) in `<script type="module"></script>` environments in browser or in ESM first bundlers like Vite.

## How to install

Install via npm/pnpm/yarn/bun/deno.

```bash
pnpm i gun-es
```

## How to use

Import Gun and SEA as module and use them. According to respective documentation at [gun.eco](https://gun.eco)

```js
import { Gun, SEA } from "gun-es";

const pair = await SEA.pair();
const gun = Gun();
gun.user().auth(pair);
```

### No-store light-weight Min version

No Radix store in IndexedDB, no Promises API, no WebRTC. Pure gun for testing and data processing.

```js
import { Gun, SEA } from "gun-es/min";

const pair = await SEA.pair();
const gun = Gun();
gun.user().auth(pair);
```

### Using in a Web Worker

Gun is looking for `window` and `document` to work in the browser mode so we need to first mimic them in our worker environment and then load asynchronously. Such worker is still serializable and possible to build in a single HTML web-app along with main app.

### Full example of a `worker.js` with Gun and SEA

```js worker.js
let gun;

self.window = self;
self.document = {};

import("gun-es/min").then(async (d) => {
	gun = d.Gun();
	let pair = await d.SEA.pair();
	gun.user().auth(pair);
	gun.on("auth", () => {
		gun.user().get("timestamp").put(Date.now());
		gun
			.user()
			.get("timestamp")
			.once((t) => {
				postMessage("Agent authorized at: " + t);
			});
	});
});

onmessage = (m) => {
	console.log(m.data);
	if (m.data == "timestamp") {
		gun
			.user()
			.get("timestamp")
			.once((t) => {
				postMessage("Last auth at: " + t);
			});
	}
};
```

## Key derivation add-on

Original Gun SEA (Security Encryption Authorization) is based strictly on browser cryptography and thus provides only random key pair generation.

We use `@noble/curves/p256` package for deterministic key derivation based on any arbitrary input. It may be different sources of entropy from just a string to a BIP39 mnemonic, WebAuthn credId, other keypair or just about anything - even an image.

Now we can reliably generate keys from any given input. This opens many new ways for authentication and user creation. Try it!

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
