import React, { useState, useCallback } from 'react';
import useUser from '@/hooks/user';
import Nav from '@/components/navlink';
import UnlockButton from '@/components/unlock-button';

import logo from '../../assets/images/logo.png';
import homeBtn from '../../assets/images/home-btn.png';
import marketBtn from '../../assets/images/market-btn.png';
import profileBtn from '../../assets/images/profile-btn.png';

import styles from './styles.less';

import { getAccount } from '@/service/metamask'
import { create } from '../../service/nft'

export default () => {
  const [isShow, setShow] = useState(false);

  const { address, setAddress } = useUser();

  const onClick = React.useCallback(async () => {
    if (address) {
      const zoo = await create()
      console.log(zoo)
      // 显示砸蛋动效
      setShow(true)
    } else {
      const addr = await getAccount()
      if (addr) {
        setAddress(addr)
      }
    }
  }, [address]);

  return (
    <div className={styles.container}>
      <div className={styles.bg}/>
      <nav className={styles.nav}>
        <img src={logo} />
        <UnlockButton />
      </nav>

      <div className={styles['route-btn']}>
        <img src={homeBtn} />
        <img src={marketBtn} />
        <img src={profileBtn} />
      </div>

      <div className={ isShow ? styles['egg-smash'] : styles['egg-container']}>
        { isShow ? '' : <div onClick={onClick} className={styles.egg}></div> }
      </div>
    </div>
  );
}
