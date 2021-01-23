import Web3 from 'web3';

const web3 = new Web3('https://rinkeby.infura.io/v3/f2d32433c5114fa7ae142832b24345e2');
/**
 * ### 根据级别和动物查询是否有人出售

function: onSale(uint8 _level, uint8 _type) public view returns (bool)

输入值为级别和代表动物的序号

返回值为是否有动物正在出售
 */