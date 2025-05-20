let gun;

self.window = self;
self.document = {};

import("gun-es").then(async (d) => {
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
