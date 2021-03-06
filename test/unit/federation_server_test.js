import http from "http";

describe("federation-server.js tests", function () {
  beforeEach(function () {
    this.server = new RoverSdk.FederationServer('https://acme.com:1337/federation', 'rover.network');
    this.axiosMock = sinon.mock(axios);
    RoverSdk.Config.setDefault();
  });

  afterEach(function () {
    this.axiosMock.verify();
    this.axiosMock.restore();
  });

  describe('FederationServer.constructor', function () {
    it("throws error for insecure server", function () {
      expect(() => new RoverSdk.FederationServer('http://acme.com:1337/federation', 'rover.network')).to.throw(/Cannot connect to insecure federation server/);
    });

    it("allow insecure server when opts.allowHttp flag is set", function () {
      expect(() => new RoverSdk.FederationServer('http://acme.com:1337/federation', 'rover.network', {allowHttp: true})).to.not.throw();
    });

    it("allow insecure server when global Config.allowHttp flag is set", function () {
      RoverSdk.Config.setAllowHttp(true);
      expect(() => new RoverSdk.FederationServer('http://acme.com:1337/federation', 'rover.network', {allowHttp: true})).to.not.throw();
    });
  });

  describe('FederationServer.resolveAddress', function () {
    beforeEach(function () {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com:1337/federation?type=name&q=bob%2Arover.org'))
        .returns(Promise.resolve({
          data: {
            rover_address: 'bob*rover.network',
            account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS'
          }
        }));
    });

    it("requests is correct", function (done) {
      this.server.resolveAddress('bob*rover.network')
        .then(response => {
          expect(response.rover_address).equals('bob*rover.network');
          expect(response.account_id).equals('GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS');
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });

    it("requests is correct for username as rover address", function (done) {
      this.server.resolveAddress('bob')
        .then(response => {
          expect(response.rover_address).equals('bob*rover.network');
          expect(response.account_id).equals('GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS');
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  describe('FederationServer.resolveAccountId', function () {
    beforeEach(function () {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com:1337/federation?type=id&q=GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS'))
        .returns(Promise.resolve({
          data: {
            rover_address: 'bob*rover.network',
            account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS'
          }
        }));
    });

    it("requests is correct", function (done) {
      this.server.resolveAccountId('GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS')
        .then(response => {
          expect(response.rover_address).equals('bob*rover.network');
          expect(response.account_id).equals('GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS');
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  describe('FederationServer.resolveTransactionId', function () {
    beforeEach(function () {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com:1337/federation?type=txid&q=3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889'))
        .returns(Promise.resolve({
          data: {
            rover_address: 'bob*rover.network',
            account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS'
          }
        }));
    });

    it("requests is correct", function (done) {
      this.server.resolveTransactionId('3389e9f0f1a65f19736cacf544c2e825313e8447f569233bb8db39aa607c8889')
        .then(response => {
          expect(response.rover_address).equals('bob*rover.network');
          expect(response.account_id).equals('GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS');
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  describe('FederationServer.createForDomain', function () {
    it("creates correct object", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="https://api.rover.network/federation"
`
        }));

      RoverSdk.FederationServer.createForDomain('acme.com')
        .then(federationServer => {
          expect(federationServer.serverURL.protocol()).equals('https');
          expect(federationServer.serverURL.hostname()).equals('api.rover.network');
          expect(federationServer.serverURL.path()).equals('/federation');
          expect(federationServer.domain).equals('acme.com');
          done();
        });
    });

    it("fails when rover.toml does not contain federation server info", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: ''
        }));

      RoverSdk.FederationServer.createForDomain('acme.com').should.be.rejectedWith(/rover.toml does not contain FEDERATION_SERVER field/).and.notify(done);
    });
  });

  describe('FederationServer.resolve', function () {
    it("succeeds for a valid account ID", function (done) {
      RoverSdk.FederationServer.resolve('GAFSZ3VPBC2H2DVKCEWLN3PQWZW6BVDMFROWJUDAJ3KWSOKQIJ4R5W4J')
        .should.eventually.deep.equal({account_id: 'GAFSZ3VPBC2H2DVKCEWLN3PQWZW6BVDMFROWJUDAJ3KWSOKQIJ4R5W4J'})
        .notify(done);
    });

    it("fails for invalid account ID", function (done) {
      RoverSdk.FederationServer.resolve('invalid').should.be.rejectedWith(/Invalid Account ID/).notify(done);
    });

    it("succeeds for a valid Rover address", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://rover.network/.well-known/rover.toml'))
        .returns(Promise.resolve({
          data: `
#   The endpoint which clients should query to resolve rover addresses
#   for users on your domain.
FEDERATION_SERVER="https://api.rover.network/federation"
`
        }));

      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://api.rover.network/federation?type=name&q=bob%2Arover.org'))
        .returns(Promise.resolve({
          data: {
            rover_address: 'bob*rover.network',
            account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS',
            memo_type: 'id',
            memo: '100'
          }
        }));

      RoverSdk.FederationServer.resolve('bob*rover.network')
        .should.eventually.deep.equal({
          rover_address: 'bob*rover.network',
          account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS',
          memo_type: 'id',
          memo: '100'
        })
        .notify(done);
    });

    it("fails for invalid Rover address", function (done) {
      RoverSdk.FederationServer.resolve('bob*rover.network*test').should.be.rejectedWith(/Invalid Rover address/).notify(done);
    });

    it("fails when memo is not string", function (done) {
      this.axiosMock.expects('get')
        .withArgs(sinon.match('https://acme.com:1337/federation?type=name&q=bob%2Arover.org'))
        .returns(Promise.resolve({
          data: {
            rover_address: 'bob*rover.network',
            account_id: 'GB5XVAABEQMY63WTHDQ5RXADGYF345VWMNPTN2GFUDZT57D57ZQTJ7PS',
            memo_type: 'id',
            memo: 100
          }
        }));

      this.server.resolveAddress('bob*rover.network')
        .should.be.rejectedWith(/memo value should be of type string/).notify(done);
    });

    it("fails when response exceeds the limit", function (done) {
      // Unable to create temp server in a browser
      if (typeof window != 'undefined') {
        return done();
      }
      var response = Array(RoverSdk.FEDERATION_RESPONSE_MAX_SIZE+10).join('a');
      let tempServer = http.createServer((req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.end(response);
      }).listen(4444, () => {
        new RoverSdk.FederationServer('http://localhost:4444/federation', 'rover.network', {allowHttp: true})
          .resolveAddress('bob*rover.network')
          .should.be.rejectedWith(/federation response exceeds allowed size of [0-9]+/)
          .notify(done)
          .then(() => tempServer.close());
      });
    });
  });
});
