var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

// const app = require('/../app.js')

var server = require('../app');
const app = require('../app.js')

var token = null

describe('routes : index', function() {

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    done();
  });

  // no authentication, request should get 200
  // we can access public folder without auth
  describe('GET /images/sponge.jpg', function() {
    it('should show image without asking for auth', function(done) {
      chai.request(server)
      .get('/home')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        done();
      });
    });
  });


  // no authentication, request should get 200
  describe('GET /home', function() {
    it('should render the index', function(done) {
      chai.request(server)
      .get('/home')
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        done();
      });
    });
  });

  
  // this reuqest should get 500 without the jwt
  describe('GET /profile', function() {
    it('should throw an error', function(done) {
      chai.request(server)
      .get('/profile')
      .end(function(err, res) {
        res.redirects.length.should.equal(0);
        res.status.should.equal(500);
        res.type.should.equal('text/plain');
        done();
      });
    });
  });

  // testing the POST and getting the jwt that it is needed in the next test
  describe('POST /jwt', function() {
    it('should throw an error', function(done) {
      chai.request(server)
      .post('/jwt')
      .end(function(err, res) {


      	// res.text is a string
      	// get jwt; we will use it on the next request in test
      	token = res.text.substring(10, res.text.length - 2)

        res.status.should.equal(200);
        res.type.should.equal('application/json');
        done();
      });
    });
  });



	// check endpoint when we send Authorization token
  describe('GET /profile', function() {
    it('should throw an error', function(done) {
      chai.request(server)
      .get('/profile')
      .set('Authorization', 'Bearer ' + token) // set Authorization in header
      .end(function(err, res) {
        res.status.should.equal(200);
        done();
      });
    });
  });
 })