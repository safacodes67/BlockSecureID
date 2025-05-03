
// This is a placeholder for blockchain integration
// In a real implementation, this would connect to Polygon Mumbai testnet
// and interact with deployed smart contracts

export interface BlockchainConfig {
  networkName: string;
  chainId: number;
  rpcUrl: string;
}

// Polygon Mumbai Testnet configuration
export const MUMBAI_CONFIG: BlockchainConfig = {
  networkName: "Polygon Mumbai",
  chainId: 80001,
  rpcUrl: "https://rpc-mumbai.maticvigil.com",
};

// Function to check if the user has MetaMask installed
export const checkIfWalletIsInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

// Function to connect to MetaMask
export const connectWallet = async (): Promise<string[]> => {
  try {
    if (!checkIfWalletIsInstalled()) {
      throw new Error("MetaMask is not installed");
    }
    
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });
    
    return accounts;
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

// Function to switch to Polygon Mumbai network
export const switchToMumbaiNetwork = async (): Promise<void> => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${MUMBAI_CONFIG.chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the Mumbai network is not added to MetaMask, add it
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${MUMBAI_CONFIG.chainId.toString(16)}`,
              chainName: MUMBAI_CONFIG.networkName,
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: [MUMBAI_CONFIG.rpcUrl],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ],
        });
      } catch (addError) {
        console.error("Error adding Mumbai network:", addError);
        throw addError;
      }
    } else {
      console.error("Error switching to Mumbai network:", error);
      throw error;
    }
  }
};

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
