import React from 'react';

import Nav from '@/components/navlink';

import styles from './styles.less';

export default () => {
  return (
    <div>
      <Nav />
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
