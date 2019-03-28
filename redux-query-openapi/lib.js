const fs = require("fs");
const path = require("path");
const url = require("url");
global.fetch = require("node-fetch");
global.FormData = require("form-data");
global.URLSearchParams = require("url").URLSearchParams;
const wretch = require("wretch");
const yaml = require("js-yaml");

/**
 * Get file content as string given an `URL` object
 *
 * @param {URL} location An URL object which should have 'file',
 * 'http' or 'https' as its `protocol`.
 * @returns {string} which is the file content in UTF-8
 */
const getFileContent = location => {
  const { protocol } = location;
  if (protocol.match(/^file:?/)) {
    return getLocal(location.path);
  } else if (protocol.match(/^https?:?/)) {
    return getNet(url.format(location));
  } else {
    throw TypeError("Wrong source. Should be file, http or https");
  }
};

/**
 * Parse YAML or JSON file that should contain an OpenApi spec
 *
 * @param {string} raw Raw text that should include YAML / JSON content
 * @returns {object} A plain object that represent the file structure in the YAML / JSON file
 * @throws {SyntaxError} If `raw` cannot be parsed as JSON or js-yaml consider it invalid YAML
 * (see https://github.com/nodeca/js-yaml)
 */
const parseSpec = raw => {
  let spec;
  try {
    spec = yaml.safeLoad(raw);
  } catch (e) {
    spec = JSON.parse(raw);
  }
  return spec;
};

/**
 * Get OpenApi spec file from local filesystem.
 *
 * @param {string} thePath Should be an absolute path.
 * @returns {string} Raw text from the file
 */
const getLocal = thePath => {
  const stat = fs.statSync(thePath);
  if (!stat.isFile()) {
    throw new TypeError(`Local path ${thePath} is not a regular file`);
  }
  return fs.readFileSync(thePath).toString();
};

/**
 * Get OpenApi spec file from the net
 *
 * @param {string} url An url starting with `http://` or `https://`.
 * @returns {string} Raw text from the response body
 */
const getNet = async url => {
  const text = await wretch(url)
    .get()
    .text();
  return text;
};
/**
 * Parse a filepath / an url and get and URL object. Defaults to http if protocol not given
 *
 * @param {string} thePath
 * @returns {URL}
 */
const parsePath = thePath => {
  let res, err;
  try {
    res = url.parse(thePath, false, true);
  } catch (e) {
    err = e;
  }
  if (res.hostname === null || err) {
    res = path.resolve(thePath);
    res = url.pathToFileURL(res);
  } else {
    if (res.protocol !== null && !res.protocol.match(/^((https?)|file):?$/)) {
      res.protocol = res.protocol || "http";
      throw new TypeError("Wrong source. Must be HTTP(S), or a local file.");
    }
  }
  return res;
};

module.exports = {
  getSpecFile: getFileContent,
  parseSpec,
  parsePath
};
