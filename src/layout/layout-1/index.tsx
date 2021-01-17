import React from 'react';

import Nav from '@/components/navlink';

import styles from './styles.less';

interface Props {
  children: React.ReactNode;
}

export default ({ children, }: Props) => {
  return <div className={styles.container}>
    <header>
      <Nav />
    </header>
    <main>{children}</main>
  </div>
}