import React, { useEffect, useState, useCallback } from 'react';

/**
 * 判断钱包是否解锁
 */
export const isUnlocked = async (): Promise<boolean> => {
  return window.ethereum._metamask.isUnlocked()
}


export default function useUser() {

  const [isLock, setLock] = useState(false);
  const [address, setAddress] = useState(window.sessionStorage.getItem('address'));

  const handleLock = async () => {
    const result = await window.ethereum._metamask.isUnlocked();

    setLock(!result);
  }

  const unLockWallet = useCallback(async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const addr = accounts[0];
    setAddress(addr);

    window.sessionStorage.setItem('address', addr);
  }, []);

  useEffect(() => {
    handleLock()
  }, [isLock]);

  return {
    isLock,
    unLockWallet,
    address,
  }
}

