
import { ethers } from 'ethers';

// Function to connect to MetaMask wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw new Error("Failed to connect to wallet. Please try again.");
  }
};

// Function to check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

// Function to generate a mnemonic
export const generateMnemonic = (): string => {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic?.phrase || '';
};

// Function to get wallet from mnemonic
export const getWalletFromMnemonic = (mnemonic: string): string => {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return wallet.address;
  } catch (error) {
    console.error("Invalid mnemonic:", error);
    throw new Error("Invalid mnemonic provided");
  }
};

// Function to switch to Mumbai testnet
export const switchToMumbaiNetwork = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    // Mumbai testnet parameters
    const mumbaiChainId = '0x13881'; // 80001 in decimal
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: mumbaiChainId }],
    }).catch(async (switchError: any) => {
      // If the network is not added to MetaMask, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: mumbaiChainId,
              chainName: 'Polygon Mumbai Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error switching to Mumbai network:", error);
    throw new Error("Failed to switch to Mumbai network. Please try manually in MetaMask.");
  }
};

// Declare ethereum on window object
declare global {
  interface Window {
    ethereum: any;
  }
}
