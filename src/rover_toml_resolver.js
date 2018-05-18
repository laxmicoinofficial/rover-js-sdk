import axios from 'axios';
import Promise from 'bluebird';
import toml from 'toml';
import {Config} from "./config";

// STELLAR_TOML_MAX_SIZE is the maximum size of rover.toml file
export const STELLAR_TOML_MAX_SIZE = 100 * 1024;

/**
 * RoverTomlResolver allows resolving `rover.toml` files.
 */
export class RoverTomlResolver {
  /**
   * Returns a parsed `rover.toml` file for a given domain.
   * Returns a `Promise` that resolves to the parsed rover.toml object. If `rover.toml` file does not exist for a given domain or is invalid Promise will reject.
   * ```js
   * RoverSdk.RoverTomlResolver.resolve('acme.com')
   *   .then(stellarToml => {
   *     // stellarToml in an object representing domain rover.toml file.
   *   })
   *   .catch(error => {
   *     // rover.toml does not exist or is invalid
   *   });
   * ```
   * @see <a href="https://www.rover.network/developers/guides/concepts/rover-toml.html" target="_blank">Rover.toml doc</a>
   * @param {string} domain Domain to get rover.toml file for
   * @param {object} [opts]
   * @param {boolean} [opts.allowHttp] - Allow connecting to http servers, default: `false`. This must be set to false in production deployments!
   * @returns {Promise}
   */
  static resolve(domain, opts = {}) {
    let allowHttp = Config.isAllowHttp();
    if (typeof opts.allowHttp !== 'undefined') {
        allowHttp = opts.allowHttp;
    }

    let protocol = 'https';
    if (allowHttp) {
        protocol = 'http';
    }
    return axios.get(`${protocol}://${domain}/.well-known/rover.toml`, {maxContentLength: STELLAR_TOML_MAX_SIZE})
      .then(response => {
      	try {
            let tomlObject = toml.parse(response.data);
            return Promise.resolve(tomlObject);
        } catch (e) {
            return Promise.reject(new Error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`));
        }
      })
      .catch(err => {
        if (err.message.match(/^maxContentLength size/)) {
          throw new Error(`rover.toml file exceeds allowed size of ${STELLAR_TOML_MAX_SIZE}`);
        } else {
          throw err;
        }
      });
  }
}
