import React from 'react';
import useUser from '@/hooks/user';

import styles from './styles.less';

const simpleAdress = (address: string) => {
  if (!address) return '';

  const length = address.length;

  const start = address.substring(0, 4);
  const end = address.substr(length - 4, 4);

  return `${start}...${end}`;
}


export default function UnlockButton() {
  const { isLock, address, unLockWallet } = useUser();

  const onClick = React.useCallback(() => {
    if (isLock) {
      unLockWallet();
    }
  }, []);

  return <div onClick={onClick} className={styles['login-btn']}>{isLock ? 'Unlock Wallet' : simpleAdress(address)}</div>
}