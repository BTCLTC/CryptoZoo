import { ethers } from 'ethers';
import { toWei } from 'web3-utils';
import abi from '../abi/abi.json';

const contractAddress = '0x7010D85A7E84Af63bcCb10D1f0067f6255C03936'

const getProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const getContract = () => {
  return new ethers.Contract(contractAddress, abi, getProvider())
}

/**
 * 需要签名的contract
 */
export const getSignerContract = () => {
  return new ethers.Contract(contractAddress, abi, getProvider().getSigner())
}

/**
 * 创建动物，开蛋
 */
export const create = async () => {

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
export const upgrade = async (token1: string, token2: string) => {
  const contract = getSignerContract()

  // Return: bool （升级是否成功）
  const status = await contract.upgrade(token1, token2)
}

/**
 * 系统赎回
 */
export const redeem = async (token: string) => {
  const contract = getSignerContract()

  const status = await contract.redeem(token)
}

/**
 * 竞拍出售
 */
export const sellBids = async (token: string, price: string) => {
  const contract = getSignerContract();

  return await contract.sellBids(token, toWei(price), { value: toWei(price) });
}

/**
 * 竞拍购买
 * @param level: 等级
 * @param type: 生肖
 * @param price: 价格
 */
export const buyBids = async (level: number, type: number, price: string) => {
  const contract = getSignerContract();
  return await contract.buyBids(level, type, toWei(price), { value: toWei(price) }).catch((err: any) => err);
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
export const transfer = async (fromAddress: string, toAddress: string, tokenId: string) => {
  const contract = getSignerContract()

  const data = await contract.transferFrom(fromAddress, toAddress, tokenId)
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
