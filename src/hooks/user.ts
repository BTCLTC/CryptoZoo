import React, { useEffect, useState } from 'react';
import { isConnected, getAccount } from '@/service/metamask'


export default function useUser() {

  const [address, setAddress] = useState('');

  useEffect(() => {
    // 首先判断是否连接过metamask
    // 如果有连接授权，自动获取账户信息
    const connect = isConnected()
    console.log(connect)
    getAccount()
  }, [null]);

  return {
    address,
    setAddress
  }
}

