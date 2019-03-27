const Generator = require("yeoman-generator");
const path = require("path");
const url = require("url");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "specPath",
        message: "URL to your OpenApi specification file.",
        validate: specPath => {
          if (specPath === "") return "Please, input an url / path.";
          try {
            this._parsePath(specPath);
          } catch (TypeError) {
            return "Not a valid path / url";
          }
          return true;
        }
      }
    ]);
  }

  _parsePath(thePath) {
    let res;
    try {
      res = url.parse(thePath, false, true);
    } catch (TypeError) {
      res = path.resolve(thePath);
    }
    if (res.hostname === null) {
      res = path.resolve(thePath);
    }
    return res;
  }

  getSpecFile() {
    let { specPath } = this.answers;
    specPath = this._parsePath(specPath);
  }

  _meow() {
    this.log("meow");
  }
  _nya() {
    this.log("nya");
  }
};
