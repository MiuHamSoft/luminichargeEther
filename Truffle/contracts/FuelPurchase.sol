// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract FuelPurchase {
    uint256 public transactions = 0;

    mapping(address => uint256) public payments;

    address payable constant station =
        0x8Efe98513B3253ceFbd490D5685E45289dc11FD0;

    struct Fuel {
        uint256 id;
        string fuel;
    }

    mapping(uint256 => Fuel) public tasks;

    constructor() public {}

    function chargeFuelNow(string memory fuel)
        public
        payable
    {
        require(msg.sender.balance >= msg.value);
        transactions++;
        tasks[transactions] = Fuel(transactions, fuel);
        station.transfer(msg.value);
        // (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        // require(sent, "Failed to send Ether");
    }
}
