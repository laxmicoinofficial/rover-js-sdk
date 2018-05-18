import http from "http";

describe("rover_toml_resolver.js tests", function () {
  beforeEach(function () {
    this.axiosMock = sinon.mock(axios);
    RoverSdk.Config.setDefault();
  });

  afterEach(function () {
    this.axiosMock.verify();
    this.axiosMock.restore();
  });

  describe('RoverTomlResolver.resolve', function () {
    it("returns rover.toml object for valid request and rover.toml file", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="https://api.rover.network/federation"
`
        }));

      RoverSdk.RoverTomlResolver.resolve('acme.com')
        .then(stellarToml => {
          expect(stellarToml.FEDERATION_SERVER).equals('https://api.rover.network/federation');
          done();
        });
    });

    it("returns rover.toml object for valid request and rover.toml file when allowHttp is `true`", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('http://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="http://api.rover.network/federation"
`
        }));

      RoverSdk.RoverTomlResolver.resolve('acme.com', {allowHttp: true})
        .then(stellarToml => {
          expect(stellarToml.FEDERATION_SERVER).equals('http://api.rover.network/federation');
          done();
        });
    });

    it("returns rover.toml object for valid request and rover.toml file when global Config.allowHttp flag is set", function (done) {
      RoverSdk.Config.setAllowHttp(true);

      this.axiosMock.expects('get')
        .withArgs(sinon.match('http://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="http://api.rover.network/federation"
`
        }));

      RoverSdk.RoverTomlResolver.resolve('acme.com')
        .then(stellarToml => {
          expect(stellarToml.FEDERATION_SERVER).equals('http://api.rover.network/federation');
          done();
        });
    });

    it("rejects when rover.toml file is invalid", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
/#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="https://api.rover.network/federation"
`
        }));

      RoverSdk.RoverTomlResolver.resolve('acme.com').should.be.rejectedWith(/Parsing error on line/).and.notify(done);
    });

    it("rejects when there was a connection error", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/rover.toml'))
        .returns(Promise.reject());

      RoverSdk.RoverTomlResolver.resolve('acme.com').should.be.rejected.and.notify(done);
    });

    it("fails when response exceeds the limit", function (done) {
      // Unable to create temp server in a browser
      if (typeof window != 'undefined') {
        return done();
      }
      var response = Array(RoverSdk.STELLAR_TOML_MAX_SIZE+10).join('a');
      let tempServer = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'text/x-toml; charset=UTF-8');
        res.end(response);
      }).listen(4444, () => {
        RoverSdk.RoverTomlResolver.resolve("localhost:4444", {allowHttp: true})
          .should.be.rejectedWith(/rover.toml file exceeds allowed size of [0-9]+/)
          .notify(done)
          .then(() => tempServer.close());
      });
    });
  });
});
