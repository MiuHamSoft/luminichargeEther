const TodoList = artifacts.require("./FuelPurchase.sol");

module.exports = function (deployer) {
    deployer.deploy(TodoList);
};
