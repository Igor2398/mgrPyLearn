// const chai = require("chai");
// // const request = require("request");
// const request = require("superagent");
// const chaiHttp = require("chai-http");
// const server = require("../app.js");



// //Assertion style
// chai.should();

// chai.use(chaiHttp);


// describe("Register API", () => {

//     describe("POST /api/register", ()=>{
//         it("It should NOT create new user", (done) => {
//             user = {
//                 firstName: "Dummy",
//                 lastName: "Dummy",
//                 userName: "Dummy5",
//                 email: "dummy5@gmail.com",
//                 password: "Unique!23"
//             };
//             chai.request(server)
//             .post("/api/register")
//             .send(user)
//             .end((err, response)=>{
//                 response.should.have.status(409);
//                 response.should.have.be.a("object");
//                 response.body.should.have.property('message').and.to.be.a('string');
//                 done();
//             });
//         });
//     });


//     describe("POST /api/register", ()=>{
//         it("It should create new user", (done) => {
//             user = {
//                 firstName: "unique1",
//                 lastName: "unique1",
//                 userName: "unique1",
//                 email: "unique1@gmail.com",
//                 password: "Unique!23"
//             };
//             chai.request(server)
//             .post("/api/register")
//             .send(user)
//             .end((err, response)=>{
//                 response.should.have.status(201);
//                 done();
//             });
//         });
//     });


// });
