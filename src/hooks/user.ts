import { useEffect } from 'react';
import { isConnected, getAccount } from '@/service/metamask'
import store from '@/common/store';

const setAddress = (address: string) => {
  store.setState({ address })
}

const init = async () => {
  // 首先判断是否连接过metamask
  // 如果有连接授权，自动获取账户信息
  if (await isConnected()) {
    const addr = await getAccount()
    if (addr) {
      setAddress(addr);
    }
  }
}

export default function useUser() {
  const { address } = store.useState("address");

  useEffect(() => {
    init();
  }, [null]);

  return {
    address,
    setAddress,
    unlockWallet: init,
  }
}

