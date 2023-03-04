// const chai = require("chai");
// // const request = require("request");
// const request = require("superagent");
// const chaiHttp = require("chai-http");
// const server = require("../app.js");

// var user1 = request.agent();
// user1
// .post('http://localhost:8080/api/login')
// .send({
//        email: "john@gmail.com",
//        password: 'Siema!23'
//  })
//   .end(function(err, res) {
//     // user1 will manage its own cookies
//     // res.redirects contains an Array of redirects
//   });

// // var superagent = require('superagent');
// var agent = request.agent();

// //Assertion style
// chai.should();

// chai.use(chaiHttp);


// describe("Tasks API", () => {
//     describe("POST /api/login", ()=>{
//     it('should create a user session successfully', function(done) {
//        agent
//        .post('http://localhost:8080/api/login')
//        .send({
//               email: "johny@gmail.com",
//               password: "Siema!23"
//         })
//         .end(async function(error, response) {
//                 await console.log(JSON.stringify(response))
//                 response.should.have.status(201);
//                 response.body.should.have.be.a(object);
                
//                 //response.body.email.should.equal("johny@gmail.com");
//                 return done();
//             });
//         });
//     });

//     // describe("GET /search/firstName=:firstName", (agent)=>{
//     //     // it('login', loginUser());
//     //     it("It should GET users with username starting with 'john'", (done) => {
//     //         const userName = "John";
//     //         chai.request(server)
//     //         agent
//     //         .get("/search/firstName=john")
//     //         // .send({email: "john@gmail.com", password: "Siema!23"})
//     //         .end(async(err, response)=>{
//     //             await response.should.have.status(200);
//     //             // response.should.have.be.a("object");
//     //             console.log(JSON.stringify(response));
//     //             // response.body.should.have.property('message').and.to.be.a('string');
//     //             done();
//     //         }).timeout(20000);
//     //     });
//     // });

//     describe("POST /api/leaderboard", (agent)=>{
//         it("It should GET full leaderboard", (done) => {
//             chai.request(server)
//             user1
//             .post("/api/leaderboard")
//             // .auth(emai "john@gmail.com", password: "Siema!23")
//             .end(async(err, response)=>{
//                 response.should.have.status(200);
//                 console.log(user1)
//                 console.log(JSON.stringify(response));
//                 done();
//             });
//         });
//     });


// });


// function loginUser() {
//     return function(done) {
//         serwer
//             .post('/api/login')
//             .send({ email: "john@gmail.com", password: 'Siema!23' })
//             .expect(200)
//             .expect('Location', '/account')
//             .end(onResponse);

//         function onResponse(err, res) {
//            if (err) return done(err);
//            return done();
//         }
//     };
// };

const chai = require("chai");
const chaiHttp = require("chai-http");
var should = require('chai').should;
var app = require('../app');
var request = require('superagent');
chai.use(chaiHttp);
//let's set up the data we need to pass to the login method
const userCredentials = {
    email: 'dummy5@gmail.com', 
    password: 'Unique!23'
  }
  //now let's login the user before we run any tests
  var authenticatedUser = request.agent(app);

  describe('GET /account', function(done){
      it('should return a 302 response if the user is NOT logged in', function(done){
        chai.request(app)
        .get('/account')
        // .send(userCredentials)
        .end((err, response)=>{
                response.should.have.status(302);
                // response.should.have.be.a("object");
          done();
        });
    });

    describe("GET /api/register", ()=>{
        it("It should NOT create new user", (done) => {
            chai.request(app)
            .get("/account")
            .end((err, response)=>{
                response.should.have.status(302);
                // response.should.have.be.a("object");
                // response.body.should.have.property('message').and.to.be.a('string');
                done();
            });
        });
    });

    });