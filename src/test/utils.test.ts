import * as assert from "assert";
import { getNonce } from "../utils";

describe("getNonce", () => {
  it("returns a 32-character string", () => {
    const nonce = getNonce();
    assert.strictEqual(nonce.length, 32);
  });

  it("returns an alphanumeric string", () => {
    const nonce = getNonce();
    assert.match(nonce, /^[A-Za-z0-9]+$/);
  });

  it("produces unique values on successive calls", () => {
    const nonce1 = getNonce();
    const nonce2 = getNonce();
    assert.notStrictEqual(nonce1, nonce2);
  });
});
