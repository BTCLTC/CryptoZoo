import React, { useEffect, useState } from 'react';
import { isConnected, getAccount } from '@/service/metamask'


export default function useUser() {

  const [address, setAddress] = useState('');

  useEffect(() => {
    init()
  }, [null]);

  const init = async () => {
    // 首先判断是否连接过metamask
    // 如果有连接授权，自动获取账户信息
    if (await isConnected()) {
      const addr = await getAccount()
      if (addr) {
        setAddress(addr)
      }
    }
  }

  return {
    address,
    setAddress
  }
}

