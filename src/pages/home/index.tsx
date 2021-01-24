import React, { useState, useCallback } from 'react';
import useUser from '@/hooks/user';
import Nav from '@/components/navlink';
import UnlockButton from '@/components/unlock-button';

import logo from '../../asstes/images/logo.png';
import homeBtn from '../../asstes/images/home-btn.png';
import marketBtn from '../../asstes/images/market-btn.png';
import profileBtn from '../../asstes/images/profile-btn.png';

import styles from './styles.less';

import { create } from '../../service/nft'

export default () => {
  const [isShow, setShow] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { address } = useUser();

  const onClick = React.useCallback(() => {
    if (address) {
      // 开始砸蛋
      setShow(true)
      create()
    } else {
      alert('请先连接metamask钱包')
    }
  }, []);

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
