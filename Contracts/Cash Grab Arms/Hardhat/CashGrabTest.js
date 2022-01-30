const { expect } = require("chai");
const { ethers } = require("hardhat");

  const signer = await ethers.provider.getSigner(ethAddress);
  expect(await hardhatToken.connect(signer).isSpecialOwner()).to.equal(
    true
  );

  await expect(hardhatToken.connect(signer).claimFreeCashGrab()).to.be.revertedWith("Free Claim is not active");

  // Turn on Sale, and Claim
  await hardhatToken.changeSaleState();
  await hardhatToken.changeCommunityClaimSate();

  await hardhatToken.connect(signer).claimFreeCashGrab();
  expect(await hardhatToken.balanceOf(ethAddress)).to.equal(1);


  // Impersonate Account with Special Tokens
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [ethAddress],
  });
}


// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.
beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  CGNFT = await ethers.getContractFactory("CashGrabNFT");
  [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

  // To deploy our contract, we just have to call Token.deploy() and await
  // for it to be deployed(), which happens onces its transaction has been
  // mined.
  const maxSupply = 230;
  const RevealTime = Date.now();
  hardhatToken = await CGNFT.deploy(maxSupply, RevealTime);

  // Reserve 30 NFTs
  hardhatToken.reserveNFTs();
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

describe("Transactions", function () {

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
});

describe("Purchase", function () {

  it("Should mint 200 NFTs to 200 Addresses", async function () {

    //addressList = ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c","0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c"];
    addressList = ["0xd7f82d004e49961f7e990ed28bf88c90e5884d97", "0x21e2fb232e9fc401201e34176cb5eea01f28c854", "0x40e0a9f4028089fb22a9b55e376db3ca5897fdb8", "0xc3f9eef6028101cfb6884a0c7d6dfdab0556a53c", "0xdec0ded0606b7d0560adebd6c3a919a671db4d66", "0xc9f740170cc9d051d3ac7b6eaf101bf94ac10d99", "0xfea8aa833b27299be08a5506f9341205078b15be", "0x6e82554d7c496baccc8d0bcb104a50b772d22a1f", "0xf0d17cac77c85832e7bbbf4cc909f322b4bdb725", "0xf27078bf9bdc462fe72bc06e3273dde7c5a41bb5", "0xb143e19f2fe9c615840c4812ff6462d831edae34", "0xfed453e6f4aaf5e737d2d9875d4bda2633cecc3b", "0xd1eddfcc4596cc8bd0bd7495beab9b979fc50336", "0x92c2a617e2b73469a2a07a449541bf2f2bd3649b", "0x0eb8745407a211a718d6921691ceb99fb5ac9f48", "0x599aed04e8bceb618ee7bba2a748fc1f1aed2d57", "0x887b86b6b6957f7bbea88b8cefd392f39236a88c", "0x82b6643ce8cd0ab6664c44215039a3fe4c1660e5", "0x03f1ec9e7df623c4bb2cd90765aa0b73b1bc503e", "0x9ee5e3ff06425cf972e77c195f70ecb18ac23d7f", "0x63bc9fdc6b27e0c67a1d0478f9c4d36bc08a8c39", "0x70c0a71d34d7c2fea1b6f795e923b02003711fcc", "0xf2ff0e3d2673f924e98d6598f4f1dbe914e7ceba", "0xd911c34256255ea1df33e4ce2cd207a30f012465", "0x3bd77b00f02c8bcff586c565e2c5e6b6c5878ec3", "0x55f5d5c0652702e8ff15db5face5fb0fb336b1d0", "0xb35d79b2e0352847e8b86b29dc901d57f29a3a60", "0xff9e40c57cb5f49b728d3258261e72213fe6db9d", "0xd5b492b48824d578ac008eb094c2ec036c2aa2f0", "0x6c9879a16f4fa085a1ab09c5fe1f6defb7f3c17c", "0x2ccc5e98e7ce96321752beb10eb3f8b8af5efcf7", "0xc214cbe4d440be5ea514a56c02f85296bd3ce57c", "0x4cf93693586fe5e2f2c7097140f2efa23e3e3fba", "0xb34fd18e01a5a42216e461582fbd1e31b671eaf2", "0x9dfd400201b905dc343cf0eaae5f68f4da342b60", "0x1013604e012a917e33104bb0c63cc98e1b8d2bdc", "0x47afc628f4c40a778316128ca3026c5e2f79cb3d", "0x84bf627c6c0d04fb8b2bca0e644352fb9e51bfb2", "0x073c332ced8b9c6e73b3d3ef4ee6f0862fff3549", "0x4dc0e2040bca9faccf5333e2cc765301f11f2a7b", "0x15f7320adb990020956d29edb6ba17f3d468001e", "0xcdaf85530e5e15b7dbe8febdf3402efb47d0170d", "0x2aa3499cb8de173af7fd5ea3c65c30580caf1ac4", "0x148e2ed011a9eaaa200795f62889d68153eeacde", "0x14de2c6b28e0c4a06e140e7c91604faeeea350af", "0xdecd4b961b1984c44afbadbe2844777a627572aa", "0x5a3fc01752c6f620ec7bc47803ebe53a5abc3473", "0x7edb5638d33035469e6a2127ba75d2669f71cdb4", "0xdf8eef2a68775db7fb3179e243231e06d7d75113", "0x6513b753670786367922fd32efbb6ce18abd3041", "0xe4347d34d8c0c941926e84b56cb9dfcbcf4154fa", "0xdfdc274d86351ecae8964a66625e7d930fb80a98", "0xeaab59269bd1ba8522e8e5e0fe510f7aa4d47a09", "0x60c1dba3ece3da9fd3a400f1272c0e2cab5fb933", "0x0bc2dab96f47dac7c58db9469402cf3c7775a537", "0x7a785a2bb327a78e294583ffec3729901864cbec", "0xabe6b38e823e62d5dc727ea02fdc90ea54e34c99", "0x414531e74c58b4a5c5c998b18fbe819a70d78f30", "0xdca46a0d1bf487aaca3013253dafd6e41806522c", "0x4906e4f95ad546ce865916f65c825e00630bffa8", "0xa252e0fb97e4a105dacf51e1fc300ee257a294ae", "0xfdc2b224cc1fd65d6cdccdd896510a7d89af81c3", "0xcc3e42c55a9874cec685fb88c107dc77a50eed9b", "0x2fcebbf54251691cc8730392fdac752c019d659c", "0x80b389d7f56915f496a1b88e38f19a65516cf49d", "0x8024f47d8b554d267d1a70a056cd45f930f4d0a7", "0x98f76ae47f75018f20d6e0e827df071086647a21", "0x187248d111ed43f85572209e862bf2da69b8c8bb", "0x3b38a52998a4b786638e774007f3f8ab34db792e", "0xc2a12b62451110e44848dc3314711abd737d71f5", "0xcfea8e38ad74ab181c20988166b8d74f8da22ef9", "0x32130144209b9e08aa81f23a0a5abaa7e43ee6e8", "0x83ad673b6a84ae7df6cf720c8b538d28af43154d", "0xba5edc0d2ae493c9574328d77dc36eef19f699e2", "0x69c9c7e5ae720b124cec7277b83008fe0b71301b", "0xa88235065d97a56719ea7d4fe72f8f953c984c0b", "0xac9d7336ec3df01596bd3bf20ff53acc66bb4761", "0xa7c85ce7d129d8bac5b325b54312d6196254f7e8", "0x1d16c8c463637cea12678065362d074109dfc18b", "0x6383d8cdd0840d316b0d232da065998f0b36671b", "0x2bca65cb1173623c5759b2e4204a45bc7e66f8cc", "0x7de5b830dd5f688e2ade8cd002a0394087e0655c", "0xb9bf56f0a8f2cbf308812e4c588c1155a6bf3372", "0xb284f19ffa703daadf6745d3c655f309d17370a5", "0xb434b6a4403ee92b0728c0d1cb19855db406af30", "0x48f1b764b8cd851025b88fa28f92cb855b9079c0", "0xe6c11554a5de57d577cadf7d3e19891ababe1130", "0xdbc50b04023fd956f13d3f2625df7fbb022b996e", "0x4811ad9c9b205cb7e3e74f25d8ea7fd69a39e912", "0xf19f1c9b5985a3e1b999e95ba3cc4f591a2dc019", "0x4613739e5bcea4730f2a4983ce2100432415b01b", "0x81abc9b17fbaa501eeb7fc4d8879b78f0e4b0055", "0x6005cdca3e6aef6aa9ff5a6301b09c770aa55783", "0xd1d1848ae3ab5cb22e89672273a4ccd7a0376bfa", "0xcec1e0c660b0184a4c5cb66d3c786e310ddc80ab", "0xaa1cc5543c558524c3db21d219fcee58af054f2c", "0xd595ece8768d8ae4133419169030fa8c8c070734", "0x8e6df33545b05e1e79dc159c1c2133a3b7cea769", "0xb9f6cd55b55916d144d811423b669652c2fcb51e", "0x83c9440dc34da00c47a0d4dc2b598d7bdb1b53f7", "0xddaac482530e2d5c31c19727c6721e192d539666", "0x20ee31efb8e96d346ceb065b993494d136368e96", "0x85c0c09570c955f6e07522e9ad6041716cbbb7fe", "0x59ec0edb51ab373c94e1f93fa3cdaaa94aae582b", "0xfab9a3d37999e12252b47468d2ffd4be15936012", "0x805b2aa0a12bae969b42cb520b3788ef0c48236a", "0x5a84ff45a6400dd3c203317bb1a2ac6ce78c4d9f", "0x240b7dbde134e5f3a24bb048ab3435384c40d946", "0x1f9f705f0cfbd357fd6b7a64ee1b8da55ea863b8", "0x3344c1728aecb088987eba46cbf62ea4b2c86497", "0x89621b037cdaf3629ab9aa6079fc0bd77dab46fe", "0xf9710226a0f47d5413016a6275347221ab6fa5f3", "0x3608c988379efc4571d6f63336f14b5560f12db8", "0x30965b30bbbd150d634ca46d5c9b38b2fb9c2f53", "0x1def9bebe8cef5f1c0f5fc71f1f0c1312a273e15", "0x44ef0055d052145c3c1e36ec1a9ef6dc81a5d56f", "0xb5722fbe442d2289d101c440effb9361a71e5d45", "0xbe3bf9bb42bf423695b792250be206c9a58e2de1"];
    await hardhatToken.bulkMint(addressList);
    expect(await hardhatToken.balanceOf("0xd7f82d004e49961f7e990ed28bf88c90e5884d97")).to.equal(1);
    expect(await hardhatToken.balanceOf("0xff9e40c57cb5f49b728d3258261e72213fe6db9d")).to.equal(1);
    expect(await hardhatToken.balanceOf("0x40e0a9f4028089fb22a9b55e376db3ca5897fdb8")).to.equal(1);
    expect(await hardhatToken.balanceOf("0xbe3bf9bb42bf423695b792250be206c9a58e2de1")).to.equal(1);
    //expect(await hardhatToken.balanceOf("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2")).to.equal(100);
    //expect(await hardhatToken.balanceOf("0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c")).to.equal(100);
  });

  it("Should fail if sender doesn’t send enough eth", async function () {
    // Turn on Sale, and Claim
    await hardhatToken.changeSaleState();

    await expect(hardhatToken.connect(addr1).purchase(1, { value: ethers.utils.parseUnits("0.0495", "ether") })).to.be.revertedWith("Ether value sent is not correct");
  });

  it("Should fail if sender tries to purchase too many", async function () {

    // Turn on Sale, and Claim
    await hardhatToken.changeSaleState();

    await expect(hardhatToken.connect(addr1).purchase(21, { value: ethers.utils.parseUnits("1.05", "ether") })).to.be.revertedWith("Can only mint 20 tokens at a time");
  });

  it("Should allow sender to purchase tokens", async function () {

    // Turn on Sale, and Claim
    await hardhatToken.changeSaleState();

    await hardhatToken.connect(addr1).purchase(20, { value: ethers.utils.parseUnits("1", "ether") });

    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(20);
  });

  it("Should not allow over max supply purchase", async function () {

    // Turn on Sale, and Claim
    await hardhatToken.changeSaleState();

    CGExploit = await ethers.getContractFactory("CashGrabExploit");
    exploitContract = await CGExploit.deploy();
    await owner.sendTransaction({
      to: exploitContract.address,
      value: ethers.utils.parseEther("3.0"), // Sends exactly 3.0 ether
    });
    await exploitContract.GetContract(hardhatToken.address);
    await expect(exploitContract.Exploit()).to.be.revertedWith("ReentrancyGuard: reentrant call");
    expect(await hardhatToken.balanceOf(exploitContract.address)).to.equal(0);
  });

  it("Should set startingIndex", async function () {

    // Turn on Sale, and Claim
    await hardhatToken.changeSaleState();
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
  });
});
