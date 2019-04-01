const assert = require("assert");
const {
  parsePath,
  getLocal,
  getNet,
  parseSpec,
  getFileContent
} = require("../lib");
describe("lib helpers", () => {
  describe("parsePath", () => {
    it("It should parse relative file path to an URL object with `protocol` = 'file' and `path` the absolute path", () => {
      const path = "./meow";
      const expected = __dirname + "/meow";
      const actual = parsePath(path);
      // Assert protocol to be file
      assert(actual.protocol.match(/^file:?$/));
      // `actual.path` should be an absolute path
      assert.equal(actual.path, expected);
    });
    it("should parse a HTTPS url into an URL object with expected protocol, hostname and path", () => {
      const url = "https://meow.com/meow";
      const actual = parsePath(url);
      assert(actual.protocol.match(/^https:?$/));
      assert.equal(actual.host === "meow.com");
      assert.equal(actual.path === "/meow");
    });
    it("should parse a HTTP url into an URL object with expected protocol, hostname and path", () => {
      const url = "http://meow.com/meow";
      const actual = parsePath(url);
      assert(actual.protocol.match(/^http:?$/));
      assert.equal(actual.host, "meow.com");
      assert.equal(actual.path, "/meow");
    });
    it("should parse a file url into a file url object", () => {
      const url = "file:///home/meow/nyan.txt";
      const actual = parsePath(url);
      assert(actual.protocol.match(/^file:?$/));
      assert.equal(actual.path, "/home/meow/nyan.txt");
    });
    it("should return a url object with procotcol http if none is given", () => {
      const url = "//";
    });
  });
  describe("getLocal", () => {
    it("should get a local file's content correctly", () => {
      const path = __dirname + "/nyan.txt";
      const expected = "nya,nya!";
      const actual = getLocal(path);
      assert.equal(actual, expected);
    });
    it("should throw a TypeError if the file is not a regular file", () => {
      const dir = __dirname + "/nyandir";
      assert.throws(() => {
        getLocal(dir);
      }, TypeError);
    });
    it("should throw a TypeError if the file is not accessible", () => {
      const nonExistent = "blablabla.txt";
      assert.throws(() => {
        getLocal(nonExistent);
      }, TypeError);
    });
  });
  describe("getNet", () => {
    // NEXT: find out how a mock server can be set up.
    it("should get correct content through http(s)", () => {
      const expected = "nya,nya!";
      const actual = getNet(process.env.mockServerUrl);
      assert.equal(expected, actual);
    });
    it("should default to ");
  });
});
