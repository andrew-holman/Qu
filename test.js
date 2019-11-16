var assert = require('assert');
var chakram = require('chakram');
var expect = chakram.expect;

describe("HTTP assertions", function () {
    it("should have response code of 200", function () {
        var response = chakram.get("http://localhost:8080/demo/all");
        expect(response).to.have.status(200);
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should have response code of 400 without args", function () {
        var response = chakram.post("http://localhost:8080/demo/user/get/userName");
        expect(response).to.have.status(400);
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should have response code of 200 with args", function () {
        var response = chakram.post("http://localhost:8080/demo/user/get/userName?userName=cholman");
        expect(response).to.have.status(200);
        expect(response).not.to.be.encoded.with.gzip;
        expect(response).to.comprise.of.json( {
            "userId": 5,
            "userName": "Cholman",
            "displayName": "Cndrew",
            "userPassword": "3rdPass@!#3",
            "classId": null
        });
        return chakram.wait();
    });
});
describe("General Functionality", function(){
    it("should not contain the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/get/userName?userName=testUser");
        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json( {
            "userId": -1,
            "userName": null,
            "displayName": "User doesn't exist",
            "userPassword": null,
            "classId": -1
        });
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should not login the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/login?userName=testUser&userPassword=testPass")
            .then(function(loginResponse){
                assert(loginResponse.userId === -1);
            });
        return chakram.wait();
    });
    it("should add the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/add?userName=testUser&displayName=TestUser&userPassword=testPass");
        expect(response).to.have.status(200);
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should contain the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/get/userName?userName=testUser");
        expect(response).to.have.status(200);
        expect(response).not.to.comprise.of.json( {
            "userId": -1,
            "userName": null,
            "displayName": "User doesn't exist",
            "userPassword": null,
            "classId": -1
        });
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should login the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/login?userName=testUser&userPassword=testPass")
            .then(function(loginResponse){
                assert(loginResponse.userId !== -1);
            });
        return chakram.wait();
    });
    it("should delete the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/delete/userName?userName=testUser");
        expect(response).to.have.status(200);
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
    it("should not contain the user", function() {
        var response = chakram.post("http://localhost:8080/demo/user/get/userName?userName=testUser");
        expect(response).to.have.status(200);
        expect(response).to.comprise.of.json( {
            "userId": -1,
            "userName": null,
            "displayName": "User doesn't exist",
            "userPassword": null,
            "classId": -1
        });
        expect(response).not.to.be.encoded.with.gzip;
        return chakram.wait();
    });
});