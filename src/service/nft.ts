import { ethers } from 'ethers';
import { toWei } from 'web3-utils';
import abi from '../abi/abi.json';
import { getContractAddress } from '@/config';


const getProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const getContract = () => {
  return new ethers.Contract(getContractAddress(), abi, getProvider())
}

/**
 * 需要签名的contract
 */
export const getSignerContract = () => {
  return new ethers.Contract(getContractAddress(), abi, getProvider().getSigner())
}

/**
 * 获取砸蛋价格
 */
export const getEggPrice = async () => {
  const contract = getContract();

  return await contract.eggPrice();
}

/**
 * 创建动物，开蛋
 */
export const create = async () => {

  const price = await getEggPrice();
  console.log(price);

  const contract = getSignerContract()
  const tx = await contract.create({ value: toWei('0.01') });
  return {
    contract,
    tx
  };
}

/**
 * 升级
 */
export const upgrade = async ({ token1, token2 }: { token1: string, token2: string }, event?: string, callback?: (...args: any[]) => void) => {
  const contract = getSignerContract()

  if (event && callback) {
    contract.on(event, callback);
  }

  // Return: bool （升级是否成功）
  return contract.upgrade(token1, token2)
}

/**
 * 系统赎回
 */
export const redeem = async (token: string, event?: string, callback?: (args: any) => void) => {
  const contract = getSignerContract();

  if (event && callback) {
    contract.on(event, callback);
  }

  return contract.redeem(token)
}

/**
 * 竞拍出售
 */
export const sellBids = async ({ token, price }: { token: string, price: string }, event?: string, callback?: (...args: any[]) => void) => {
  const contract = getSignerContract();

  if (event && callback) {
    contract.on(event, callback);
  }

  return contract.sellBids(token, toWei(price));
}

/**
 * 主动购买
 * @param level: 等级
 * @param type: 生肖
 * @param price: 价格
 */
export const buy = async (level: number, type: number, price: string) => {
  const contract = getSignerContract();
  return contract.buy(level, type, toWei(price), { value: toWei(price) });
}

/**
 * 竞拍购买
 * @param level: 等级
 * @param type: 生肖
 * @param price: 价格
 */
export const buyBids = async (level: number, type: number, price: string) => {
  const contract = getSignerContract();
  return contract.buyBids(level, type, toWei(price), { value: toWei(price) });
}

/**
 * 取消出售订单
 */
export const cancleSell = async (token: string) => {
  const contract = getSignerContract()

  const status = await contract.cancleSell(token)
}

/**
 * 取消购买订单
 */
export const cancleBuy = async (level: number, type: number) => {
  const contract = getSignerContract()

  const status = await contract.cancleBuy(level, type)
}

/**
 * 转给其他人
 */
export const transfer = async (toAddress: string, tokenId: string) => {
  const contract = getSignerContract()

  return await contract.transferFrom(toAddress, tokenId)
}

/**
 * 获取用户生肖数量[序号]
 */
export const getBalanceOf = async (address: string) => {
  const contract = getContract()

  const data = await contract.balanceOf(address)
  return parseInt(data)
}

/**
 * 根据序号，获取生肖TokenID
 */
export const getTokenOfOwnerByIndex = async (address: string, index: number) => {
  const contract = getContract()

  return await contract.tokenOfOwnerByIndex(address, index)
}

/**
 * 根据tokenid获取其动物属性
 */
export const getAnimalInfo = async (tokenId: string) => {
  const contract = getContract()

  return await contract.getAnimalInfo(tokenId)
}

/**
 * 根据级别，查询是否有人出售
 */
export const getIsSale = async (level: number) => {
  const contract = getContract()

  return await contract.onSale(level)
}

/**
 * 根据级别，查询是否有人购买
 */
export const getIsOnPurchased = async (level: number) => {
  const contract = getContract()

  return await contract.onPurchase(level)
}

/**
 * 查询用户信息
 */
export const getUserInfo = async (address: string, level: number, index: number = 0) => {
  const contract = getContract();

  return contract.getUserInfo(address, level, index);
}
