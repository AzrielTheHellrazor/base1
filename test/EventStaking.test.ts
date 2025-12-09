import { expect } from "chai";
import { ethers } from "hardhat";

describe("EventStaking", function () {
  let mockUSDC: any;
  let eventStaking: any;
  let owner: any;
  let organizer: any;
  let participant1: any;
  let participant2: any;

  const depositAmount = ethers.parseUnits("5", 6); // 5 USDC (6 decimals)

  beforeEach(async function () {
    [owner, organizer, participant1, participant2] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();

    // Deploy EventStaking
    const EventStaking = await ethers.getContractFactory("EventStaking");
    eventStaking = await EventStaking.deploy(await mockUSDC.getAddress());

    // Give participants some USDC
    await mockUSDC.transfer(participant1.address, ethers.parseUnits("100", 6));
    await mockUSDC.transfer(participant2.address, ethers.parseUnits("100", 6));
  });

  describe("Event Creation", function () {
    it("Should create an event", async function () {
      const startTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const tx = await eventStaking
        .connect(organizer)
        .createEvent(depositAmount, startTime);
      const receipt = await tx.wait();

      const event = await eventStaking.getEvent(1);
      expect(event.id).to.equal(1);
      expect(event.organizer).to.equal(organizer.address);
      expect(event.depositAmount).to.equal(depositAmount);
    });
  });

  describe("Joining Events", function () {
    beforeEach(async function () {
      const startTime = Math.floor(Date.now() / 1000) + 86400;
      await eventStaking.connect(organizer).createEvent(depositAmount, startTime);
    });

    it("Should allow participants to join", async function () {
      await mockUSDC
        .connect(participant1)
        .approve(await eventStaking.getAddress(), depositAmount);
      
      await eventStaking.connect(participant1).joinEvent(1);

      const participantInfo = await eventStaking.getParticipantInfo(1, participant1.address);
      expect(participantInfo.joined).to.be.true;
    });

    it("Should transfer USDC to contract", async function () {
      await mockUSDC
        .connect(participant1)
        .approve(await eventStaking.getAddress(), depositAmount);
      
      const balanceBefore = await mockUSDC.balanceOf(participant1.address);
      await eventStaking.connect(participant1).joinEvent(1);
      const balanceAfter = await mockUSDC.balanceOf(participant1.address);

      expect(balanceBefore - balanceAfter).to.equal(depositAmount);
    });
  });
});


