import React from 'react';

import styles from './styles.less';

export default function Modal({ children }) {

  return (<div className={styles.modal}>
    <div className={styles.mask} />
    <div className={styles.container}>
      {children}
    </div>
  </div>)
}
