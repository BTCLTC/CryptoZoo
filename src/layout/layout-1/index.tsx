import React from 'react';

import Nav from '@/components/navlink';
import UnlockButton from '@/components/unlock-button';

import styles from './styles.less';

import logo from '@/assets/images/logo2.png';

interface Props {
  children: React.ReactNode;
}

export default ({ children, }: Props) => {
  return <div className={styles.container}>
    <header>
      <img src={logo} />
      <div>
        <Nav />
      </div>
      <UnlockButton />
    </header>
    <main>{children}</main>
  </div>
}
