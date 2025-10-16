import { ethers } from 'ethers';

// Contract addresses (example addresses - replace with your actual contracts)
export const CONTRACT_ADDRESSES = {
  ETHEREUM: {
    USDC: '0xA0b86a33E6441b8C4C8C0C4C0C4C0C4C0C4C0C4C',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  POLYGON: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
  }
};

// ABI for ERC20 tokens (simplified)
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

// ABI for trading contract (example)
export const TRADING_ABI = [
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function getBalance() view returns (uint256)",
  "function trade(address tokenIn, address tokenOut, uint256 amountIn) returns (uint256 amountOut)"
];

export class Web3Service {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
  }

  // Get ETH balance
  async getETHBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return '0';
    }
  }

  // Get ERC20 token balance
  async getTokenBalance(tokenAddress, userAddress) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  }

  // Transfer ETH
  async transferETH(to, amount) {
    try {
      const tx = await this.signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount.toString())
      });
      return await tx.wait();
    } catch (error) {
      console.error('Error transferring ETH:', error);
      throw error;
    }
  }

  // Transfer ERC20 token
  async transferToken(tokenAddress, to, amount) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      const decimals = await contract.decimals();
      const tx = await contract.transfer(to, ethers.parseUnits(amount.toString(), decimals));
      return await tx.wait();
    } catch (error) {
      console.error('Error transferring token:', error);
      throw error;
    }
  }

  // Approve token spending
  async approveToken(tokenAddress, spenderAddress, amount) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      const decimals = await contract.decimals();
      const tx = await contract.approve(spenderAddress, ethers.parseUnits(amount.toString(), decimals));
      return await tx.wait();
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  // Get token info
  async getTokenInfo(tokenAddress) {
    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals()
      ]);
      return { name, symbol, decimals };
    } catch (error) {
      console.error('Error fetching token info:', error);
      return null;
    }
  }

  // Estimate gas for transaction
  async estimateGas(tx) {
    try {
      return await this.provider.estimateGas(tx);
    } catch (error) {
      console.error('Error estimating gas:', error);
      return null;
    }
  }

  // Get current gas price
  async getGasPrice() {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      console.error('Error fetching gas price:', error);
      return '0';
    }
  }

  // Check if address is valid
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  // Format address for display
  formatAddress(address) {
    if (!this.isValidAddress(address)) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Get network info
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: network.chainId,
        name: network.name
      };
    } catch (error) {
      console.error('Error fetching network info:', error);
      return null;
    }
  }

  // Switch network
  async switchNetwork(chainId) {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  // Add network to wallet
  async addNetwork(networkConfig) {
    if (!window.ethereum) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
      return true;
    } catch (error) {
      console.error('Failed to add network:', error);
      return false;
    }
  }
}

// Network configurations
export const NETWORK_CONFIGS = {
  1: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/YOUR_PROJECT_ID'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  137: {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  56: {
    chainId: '0x38',
    chainName: 'BSC Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  42161: {
    chainId: '0xa4b1',
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
  }
};

export default Web3Service;
