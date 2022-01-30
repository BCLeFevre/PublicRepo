const { expect } = require("chai");
const { ethers } = require("hardhat");

/*async function ClaimLeg(ethAddress) {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [ethAddress],
    });

    const signer = await ethers.provider.getSigner(ethAddress);

    it("Should allow sender to purchase tokens", async function () {

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();

        await hardhatToken.connect(signer).claimLeg(1);

        expect(await hardhatToken.ownerOf(signer.address)).to.equal(1);
    });


    it("Should not allow over max supply purchase", async function () {

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();

        await hardhatToken.connect(signer).claimLeg(1);

        expect(await hardhatToken.ownerOf(signer.address)).to.equal(1);

        await expect(hardhatToken.connect(signer).claimLeg(1)).to.be.revertedWith("ERC721: token already minted");
    });

    // Impersonate Account with Special Tokens
    await hre.network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [ethAddress],
    });
}*/


// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    CGNFT = await ethers.getContractFactory("CashGrabLegsNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const maxSupply = 5608;
    const RevealTime = Date.now();
    hardhatToken = await CGNFT.deploy("0xa5409ec958c83c3f309868babaca7c86dcb077c1");

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

/*describe("Transactions", function () {

    it("Should transfer tokens between accounts", async function () {

        // Transfer 1 tokens from owner to addr1
        await hardhatToken["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);

        // Transfer 1 tokens from addr1 to addr2
        await hardhatToken.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, addr2.address, 1);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
        const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

        // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
        // `require` will evaluate false and revert the transaction.
        await expect(
            hardhatToken.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, owner.address, 1)
        ).to.be.revertedWith("transfer caller is not owner nor approved");

        // Owner balance shouldn't have changed.
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
        );
    });
});*/

describe("Claim Leg", function () {

    let ethAddress = "0x79137D62F126836f96FED0fE044C7c0023F6cD15";

    it("Should allow sender to claim token", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();

        await hardhatToken.connect(signer).claimLeg(2647);

        expect(await hardhatToken.ownerOf(2647)).to.equal(ethAddress);

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });


    it("Should not allow multiple claim of same tokenId", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();
        
        await hardhatToken.connect(signer).claimLeg(2647);

        expect(await hardhatToken.ownerOf(2647)).to.equal(ethAddress);

        await expect(hardhatToken.connect(signer).claimLeg(2647)).to.be.revertedWith("ERC721: token already minted");

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });


    /*it("Should set startingIndex", async function () {

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();
        expect(await hardhatToken.startingIndexBlock()).to.equal(0);
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
        await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });
    
        expect( hardhatToken.startingIndexBlock()).to.not.equal(0);
    });*/
});

describe("Claim Multiple Legs", function () {

    let ethAddress = "0x79137D62F126836f96FED0fE044C7c0023F6cD15";

    it("Should allow sender to claim tokens", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();

        await hardhatToken.connect(signer).claimXLegs([2647, 2648, 2649, 2650, 2651, 2652, 2653, 2654, 2655, 2656, 2657, 2658, 2659, 2660, 2661, 2662, 2663, 2664, 2665, 2666, 2667, 2668, 2669, 2670,
            2671, 2672, 2673, 2674, 2675, 2676, 2677, 2678, 2679, 2680, 2681, 2682, 2683, 2684, 2685, 2686, 2865, 2866, 2867, 2868, 2869, 2870, 2871, 2872, 2873, 2874]);
         
        expect(await hardhatToken.ownerOf(2647)).to.equal(ethAddress);
        expect(await hardhatToken.ownerOf(2648)).to.equal(ethAddress);
        expect(await hardhatToken.ownerOf(2679)).to.equal(ethAddress);
        expect(await hardhatToken.ownerOf(2874)).to.equal(ethAddress);
        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(50);

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });

    it("Should not allow sender to claim Leg token", async function () {

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethAddress],
        });

        let signer = await ethers.provider.getSigner(ethAddress);

        // Turn on Sale, and Claim
        await hardhatToken.changeClaimState();

        await expect(hardhatToken.connect(signer).claimXLegs([1])).to.be.revertedWith("You must own the Arm tokenId to mint the leg");

        expect(await hardhatToken.balanceOf(ethAddress)).to.equal(0);

        // Impersonate Account with Special Tokens
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [ethAddress],
        });
    });

});

describe("Merge Grabatar Gas Test", function () {


});
