// MyTokenClaimModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenClaimModule = buildModule("TokenWithdrawerModule", (m) => {

  // 这里指定合约的 owner 地址
  const ownerAddress = "0xa50045E95cdF7656be4E3b01f51EEeb07a6250E2"; // 替换为你自己的地址

  // 部署 TokenWithdrawer 合约，无构造参数时传空数组
  const tokenWithdrawer = m.contract("TokenWithdrawer", [ownerAddress]);

  return { tokenWithdrawer };
});

export default TokenClaimModule;
