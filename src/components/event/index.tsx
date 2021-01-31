import React from 'react';
import { notification } from 'antd';
import { getSignerContract } from '@/service/nft';
import useUser from '@/hooks/user';

export default function Event() {
  const contract = getSignerContract();
  const { address } = useUser();

  // 售卖成功
  contract.on('Sell', (seller: string, buyer, tokenID, price) => {
    if (address.toUpperCase() === seller.toUpperCase()) {
      notification.success({
        message: '温馨提示',
        description: '售卖成功'
      });
    }
  })

  // 购买成功
  contract.on('Buy', (buyer: string, seller: string, tokenID, price) => {
    if (buyer.toUpperCase() === seller.toUpperCase()) {
      notification.success({
        message: '温馨提示',
        description: '购买成功'
      });
    }
  })

  // 升级成功
  contract.on('Upgrade', (user: string, token1, token2) => {
    if (address.toUpperCase() === user.toUpperCase()) {
      notification.success({
        message: '温馨提示',
        description: '升级成功'
      });
    }
  })

  return <></>
}