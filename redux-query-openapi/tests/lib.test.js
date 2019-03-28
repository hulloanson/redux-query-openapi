const assert = require("assert");
const { parsePath } = require("../lib");
describe("lib helpers", () => {
  describe("parsePath", () => {
    it("It should parse a file path to an URL object with protocol 'file'", () => {
      const path = "./meow";
      const expected = __dirname + "/meow";
      const actual = parsePath(path);
      assert(actual.protocol.match(/^file:?/));
      // TODO: NEXT: where I left off on 2019-03-28
      assert.equal(actual.protocol, expected);
    });
    it("should parse a url into an url object", () => {
      const url = "https://meow.com";
      const expected = new URL(url);
    });
  });
});
