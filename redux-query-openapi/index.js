const Generator = require("yeoman-generator");
const path = require("path");
const url = require("url");
const fs = require("fs");
const {
  parsePath,
  getNet,
  getLocal,
  parseSpec,
  getSpecFile
} = require("./lib");
const compose = require("just-compose");

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
            parsePath(specPath);
          } catch (TypeError) {
            return "Not a valid path / url";
          }
          return true;
        }
      }
    ]);
  }

  run() {
    let spec;
    try {
      spec = compose(
        parseSpec,
        getSpecFile,
        parsePath
      )(this.answers.specPath);
    } catch (e) {
      this.log("There was an error: ", e);
    }
    this.log(spec);
  }
};
