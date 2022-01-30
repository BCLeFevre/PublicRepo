const { expect } = require("chai");
const { ethers } = require("hardhat");


// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    PATrophyWrapper = await ethers.getContractFactory("PineappleArcadeTrophyWrapper");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await PATrophyWrapper.deploy();

    const paTrophy = await ethers.getContractFactory("PineappleArcadeTrophy");
    paTrophyContract = await paTrophy.attach("0xf7dDC72B2b2cC275C1b40E289FA158b24a282D90")

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

describe("Attempt Wrap ", function () {

    let ethAddress = "0x3665e13eC88D60a490eb8B34aCab4A52D46EC8c2";

    it("Should wrap Trophy", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);
        expect(await paTrophyContract.ownerOf(54)).to.equal(ethAddress);
        // Set Approval
        await paTrophyContract.connect(signer).approve(hardhatToken.address, 54);
        await hardhatToken.connect(signer).wrap(54);

        await expect(await paTrophyContract.ownerOf(54)).to.equal(hardhatToken.address);
        await expect(await hardhatToken.ownerOf(54)).to.equal(ethAddress);
        await hardhatToken.connect(signer).unwrap(54);

        expect(await paTrophyContract.ownerOf(54)).to.equal(ethAddress);
        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(0);
        expect(await hardhatToken.totalSupply()).to.equal(0);
        // Repeat

        // Set Approval
        await paTrophyContract.connect(signer).approve(hardhatToken.address, 67);
        await paTrophyContract.connect(signer).approve(hardhatToken.address, 71);
        await hardhatToken.connect(signer).wrap(67);
        expect(await hardhatToken.totalSupply()).to.equal(1);
        await hardhatToken.connect(signer).wrap(71);
        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(2);
        expect(await hardhatToken.totalSupply()).to.equal(2);

        await expect(await paTrophyContract.ownerOf(67)).to.equal(hardhatToken.address);
        await expect(await hardhatToken.ownerOf(67)).to.equal(ethAddress);
        await expect(await paTrophyContract.ownerOf(71)).to.equal(hardhatToken.address);
        await expect(await hardhatToken.ownerOf(71)).to.equal(ethAddress);
        await expect(await hardhatToken.balanceOf(ethAddress)).to.equal(2);
        await hardhatToken.connect(signer).unwrap(67);
        await hardhatToken.connect(signer).unwrap(71)

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });

    it("Should wrap Trophy and Transfer", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);
        expect(await paTrophyContract.ownerOf(71)).to.equal(ethAddress);
        // Set Approval
        await paTrophyContract.connect(signer).approve(hardhatToken.address, 71);
        await hardhatToken.connect(signer).wrap(71);

        await paTrophyContract.connect(signer).approve(hardhatToken.address, 54);
        await hardhatToken.connect(signer).wrap(54);

        // Transfer
        await hardhatToken.connect(signer)["safeTransferFrom(address,address,uint256)"](ethAddress, addr1.address, 71)
        await hardhatToken.connect(signer)["safeTransferFrom(address,address,uint256)"](ethAddress, addr2.address, 54)
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(1);
        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(0);
        await expect(await hardhatToken.ownerOf(71)).to.equal(addr1.address);
        await expect(await hardhatToken.ownerOf(54)).to.equal(addr2.address);

        await hardhatToken.connect(addr1).unwrap(71);

        await hardhatToken.connect(addr2)["safeTransferFrom(address,address,uint256)"](addr2.address, addr1.address, 54)

        await hardhatToken.connect(addr1).unwrap(54);

        expect(await paTrophyContract.ownerOf(71)).to.equal(addr1.address);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
        expect(await paTrophyContract.ownerOf(54)).to.equal(addr1.address);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(0);

        await paTrophyContract.connect(addr1).approve(hardhatToken.address, 71);
        await hardhatToken.connect(addr1).wrap(71);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
        await hardhatToken.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, ethAddress, 71)
        await hardhatToken.connect(signer).unwrap(71)

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });

    it("Should not allow wrap + unwrap", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);
        expect(await paTrophyContract.ownerOf(71)).to.equal(ethAddress);
        // Set Approval
        await paTrophyContract.connect(signer).approve(hardhatToken.address, 71);

        await expect(hardhatToken.connect(addr1).wrap(71)).to.be.revertedWith("Not owner of Token");

        await hardhatToken.connect(signer).wrap(71);

        // Transfer
        await hardhatToken.connect(signer)["safeTransferFrom(address,address,uint256)"](ethAddress, addr1.address, 71)
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(0);
        await expect(await hardhatToken.ownerOf(71)).to.equal(addr1.address);
        await expect(hardhatToken.connect(addr2).unwrap(71)).to.be.revertedWith("Not owner of Wrapped Token");

        expect(await paTrophyContract.ownerOf(71)).to.equal(hardhatToken.address);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });
});




