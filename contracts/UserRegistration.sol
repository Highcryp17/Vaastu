// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistration {
    struct User {
        string name;
        string aadhar;
        string pan;
        address walletAddress;
    }

    mapping(address => User) public users;
    event UserRegistered(string name, string aadhar, string pan, address walletAddress);
    event RegistrationAttempt(string name, string aadhar, string pan, address walletAddress, address sender);

    function register(string memory _name, string memory _aadhar, string memory _pan, address _walletAddress) public {
        emit RegistrationAttempt(_name, _aadhar, _pan, _walletAddress, msg.sender);
        require(msg.sender == _walletAddress, "Transaction must be signed by the wallet address being registered");
        require(users[_walletAddress].walletAddress == address(0), "User already registered");

        users[_walletAddress] = User(_name, _aadhar, _pan, _walletAddress);
        emit UserRegistered(_name, _aadhar, _pan, _walletAddress);
    }

    function getUser(address _walletAddress) public view returns (User memory) {
        return users[_walletAddress];
    }
}
