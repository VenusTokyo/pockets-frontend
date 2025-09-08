import {
  uintCV,
  stringAsciiCV,
  principalCV,
  PostConditionMode,
  FungibleConditionCode,
} from "@stacks/transactions";
import {
  openContractCall,
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import { createNetwork, STACKS_TESTNET } from "@stacks/network";
// Update these with your deployed contract details
export const CONTRACT_ADDRESS = "STESRSM1N7QSVDCC01P9V4SN7WKJ9DDAW4EPHKJ3"; // Example address
export const CONTRACT_NAME = "subwallet"; // Example contract name
// Choose network: Testnet or Mainnet
export const network = createNetwork(STACKS_TESTNET); // Change to STACKS_MAINNET for mainnet

// Example: Function to call a contract
export function callContract({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  appDetails,
}: {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  appDetails: { name: string; icon: string };
}) {
  return openContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    appDetails,
    onFinish: (data: any) => {
      console.log("Transaction finished:", data);
    },
    onCancel: () => {
      console.log("Transaction canceled");
    },
  });
}

// Example usage:
// callContract({
//   contractAddress: 'ST123...',
//   contractName: 'my-contract',
//   functionName: 'my-function',
//   functionArgs: [bufferCVFromString('example')],
//   appDetails: { name: 'Pockets', icon: window.location.origin + '/placeholder-logo.png' }
// });

// App configuration
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const connectWallet = () => {
  showConnect({
    appDetails: {
      name: "Pockets", // replace with your app name
      icon: window.location.origin + "/placeholder-logo.png", // replace with your app icon
    },
    redirectTo: "/", // where to go after connection
    onFinish: () => {
      console.log("Wallet connected!");
      window.location.reload(); // reload to update UI with user data
    },
    onCancel: () => {
      console.log("Wallet connection canceled");
    },
    userSession,
  });
};

// Disconnect wallet function
export const disconnectWallet = () => {
  userSession.signUserOut("/");
};

// Deposit STX to a category
export const depositSTX = async (category: string, amount: number) => {
  const amountMicroSTX = Math.floor(amount * 1000000); // Convert STX to microSTX

  const functionArgs = [stringAsciiCV(category), uintCV(amountMicroSTX)];

  // TODO: Add valid post conditions for your contract if needed
  const postConditions: any[] = [];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "deposit",
    functionArgs,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    network,
    onFinish: (data: any) => {
      console.log("Transaction submitted:", data.txId);
    },
  };

  await openContractCall(options);
};

// Move funds between categories
export const moveFunds = async (
  fromCategory: string,
  toCategory: string,
  amount: number
) => {
  const amountMicroSTX = Math.floor(amount * 1000000);

  const functionArgs = [
    stringAsciiCV(fromCategory),
    stringAsciiCV(toCategory),
    uintCV(amountMicroSTX),
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "move",
    functionArgs,
    network,
    onFinish: (data: any) => {
      console.log("Move transaction submitted:", data.txId);
    },
  };

  await openContractCall(options);
};

// Spend from a category
export const spendFromCategory = async (
  category: string,
  recipient: string,
  amount: number
) => {
  const amountMicroSTX = Math.floor(amount * 1000000);

  const functionArgs = [
    stringAsciiCV(category),
    principalCV(recipient),
    uintCV(amountMicroSTX),
  ];

  const options = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "spend",
    functionArgs,
    network,
    onFinish: (data: any) => {
      console.log("Spend transaction submitted:", data.txId);
    },
  };

  await openContractCall(options);
};

// Helper function to convert microSTX to STX
export const microSTXToSTX = (microSTX: number): number => {
  return microSTX / 1000000;
};

// Helper function to format STX amounts
export const formatSTX = (amount: number): string => {
  return `${amount.toFixed(6)} STX`;
};

// Utility functions to clear browser storage
export const clearLocalStorage = (): void => {
  localStorage.clear();
};

export const clearSessionStorage = (): void => {
  sessionStorage.clear();
};
