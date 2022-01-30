const { expect } = require("chai");
const { ethers } = require("hardhat");

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DiceNFT = await ethers.getContractFactory("Dice");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await DiceNFT.deploy();
});

// You can nest describe calls to create subsections.
describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
        // Expect receives a value, and wraps it in an Assertion object. These
        // objects have a lot of utility methods to assert values.

        // This test expects the owner variable stored in the contract to be equal
        // to our Signer's owner.
        expect(await hardhatToken.owner()).to.equal(owner.address);
    });
});

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
});

describe("Mint Die", function () {

    it("Should mint 1 Die", async function () {
        
        await hardhatToken.connect(addr1).claim(1);
        await hardhatToken.connect(addr1).claim(2);
        await hardhatToken.connect(addr1).claim(3);
        await hardhatToken.connect(addr1).claim(4);
        await hardhatToken.connect(addr1).claim(5);
        console.log(await hardhatToken.tokenURI(1));
        console.log(await hardhatToken.tokenURI(2));
        console.log(await hardhatToken.tokenURI(3));
        console.log(await hardhatToken.tokenURI(4));
        console.log(await hardhatToken.tokenURI(5));
        // Owner balance shouldn't have changed.
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(5);

    });
});