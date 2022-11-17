# A Fully Decentralized Voting System (Frontend).

Build with with:
 - Nextjs
 - Wagmi
 - Rainbow Kit
 - Web3.storage
 - Ethers.js

 
 Preview:
 
  - Main page
![Page1](https://user-images.githubusercontent.com/93488388/202191288-83623580-e4c5-4211-a52d-d9d6a70f94ef.png)
 
  - Start new voting round page
  ![Page2](https://user-images.githubusercontent.com/93488388/202191505-20789ca2-dc90-4e9c-98f1-423b60eb59dc.png)
  
  - Add candidate page
  ![Page3](https://user-images.githubusercontent.com/93488388/202191593-5befb1e8-8ef9-4bb9-9b98-0992bba76ad2.png)

 - Voter Registeration (To be removed in later version)
 ![Page4](https://user-images.githubusercontent.com/93488388/202191821-54eacc10-370f-4053-aeb8-4dd6ddc0fec6.png)


 - Manage voter page
![Page6](https://user-images.githubusercontent.com/93488388/202192007-1804f2b7-9107-4648-9638-e68a354a7de5.png)

 - Voting page
 ![Page5](https://user-images.githubusercontent.com/93488388/202192285-ab5574d0-7150-4d63-b58e-92c26ec4e9fd.png)
 
 - Winner decleration page
  ![Page7](https://user-images.githubusercontent.com/93488388/202192457-b0dbbdd9-9516-4330-b30d-6ee4ac019972.png)
  
 - Find winners of previous round page
   ![Page8](https://user-images.githubusercontent.com/93488388/202192637-c693c641-b195-4820-ac43-163666542d83.png)
   
   
   ## Try is out :
   
Step 1.
   ```shell
   mkdir decentralized voting
   git clone https://github.com/adityabhattad2021/Chainlink-hackathon-frontend.git
   git clone https://github.com/adityabhattad2021/Decentralized-Voting.git
   ```
   
Step 2.
  ```Rename  "Decentralized-Voting" to "smart-contracts" and "Chainlink-hackathon-frontend" to "nextjs-frontend"```
 
Step 4.
  ```In smart-contracts/deploy/01-deploy-voting-contract.js uncomment line 42-48```

Step 3.
  ```shell
  cd smart-contracts
  yarn
  hh node
  hh run scripts/mockVoting.js --network localhost
  cd ../nextjs-frontend
  yarn
  yarn dev
  ```
   
   [Link to smart contract with solidity](https://github.com/adityabhattad2021/Decentralized-Voting)

  
 
 

