
import { ethers } from 'ethers';

// Function to connect MetaMask wallet
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts;
    } catch (error) {
      throw new Error('User denied account access');
    }
  } else {
    throw new Error('MetaMask not detected. Please install MetaMask extension.');
  }
};

// Function to switch to Mumbai testnet
export const switchToMumbaiNetwork = async () => {
  if (window.ethereum) {
    try {
      // Try to switch to Mumbai network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Mumbai network chainId
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          throw new Error('Failed to add Mumbai network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Mumbai network');
      }
    }
  } else {
    throw new Error('MetaMask not detected');
  }
};

// Initialize ethereum type for window
declare global {
  interface Window {
    ethereum: any;
  }
}
