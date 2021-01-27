import { zoo, zooType } from '@/data'
import { getSignerContract } from '@/service/nft'

const contract = getSignerContract()

// 监听砸蛋成功事件
contract.on('Creat', (address, animal: zooType, tokenID, event) => {
  alert('恭喜您，获得了萌宠：' + zoo[animal])
})

// 监听购买事件
contract.on('Buy', (address1, address2, token1, token2) => {

})

//
