import network from './network.json';

/**
 * 根据chainID，查找对应网络
 */
export const getNetworkById = (chainID: string) => {
  const data = network.find((item) => item.chainID === parseInt(chainID, 16));
  return data || {
    chainID: chainID as unknown as number,
    chainName: 'unknown',
    contractAddress: ''
  };
}

/**
 * 判断当前网络是否可用
 */
export const isNetworkAvailable = (chainID: string) => {
  return network.some((item) => item.chainID === parseInt(chainID, 16));
}

/**
 * 根据小狐狸的chainID，返回其对应的合约地址
 */
export const getContractAddress = () => {
  const chainID = window.ethereum.chainId;
  const data = getNetworkById(chainID);
  return data.contractAddress;
}
