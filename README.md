
# Ethereum Argentina Workshop


## Requirements

[node](https://nodejs.org/)

[yarn](https://yarnpkg.com/)

[git](https://git-scm.com/)



### 1- Fork the repos

#### Script
```sh
git clone https://github.com/erenjaegar77/beefy-workshop-eth-arg.git
```
#### APP
NODE Version 16.12.0
```sh
git clone https://github.com/beefyfinance/beefy-v2.git
```

#### API

NODE Version 20.5.0
```sh
git clone https://github.com/beefyfinance/beefy-api.git
```

### 2- Instal dependencies in all repos 

```sh
yarn install
```


### STEPS


**Deploy Script**
1. Import from addressbook the platform and tokens

2. Update Vault Params

3. Update Strategy Params


**Automated testing**

1. run ```yarn installForge```
2. open new terminal to fork optimism(or choosed chain) with ```yarn fork https://rpc.ankr.com/optimism/```
3. deploy the vault/strat on the local host with ```yarn deploy``` localhost
4. copy the vault address and paste on the line 19 on `ProdVaultTest.t.sol` 
5. test the strart with ```yarn forgeTest:vault``` 
6. deploy to mainnet


**Manual Testing Is Required for All Live Vaults**

1. Give vault approval to spend your want tokens. 
2. Deposit a small amount to test deposit functionality.
3. Withdraw, to test withdraw functionality.
4. Deposit a larger amount wait 30 seconds to a minute and harvest. Check harvest transaction to make sure things are going to the right places.
5. Panic the vault. Funds should be in the strategy.
6. Withdraw 50%.
7. Try to deposit, once you recieve the error message pop up in metamask you can stop. No need to send the transaction through.
8. Unpause.
9. Deposit the withdrawn amount.
10. Harvest again.
11. Switch harvest-on-deposit to `true` for low-cost chains. (L2's, Zk's, Polygon, BNB Chain, Fantom, etc..)
12. Check that `callReward` is not 0, if needed set `pendingRewardsFunctionName` to the relevant function name from the masterchef.
13. Transfer ownership of the vault and strategy contracts to the owner addresses for the respective chains found in the [address book](https://github.com/beefyfinance/beefy-api/tree/master/packages/address-book).
14. Leave some funds in the vault until users have deposited after going live, empty vaults will fail validation checks.
15. Run `yarn validate` to ensure that the validation checks will succeed when opening a pull request.

This is required so that maintainers can review everything before the vault is actually live on the app and manage it after its live.