import React from 'react';
import { NavLink } from 'umi';

import styles from './styles.less';

export default () => {
  return <>
    <NavLink exact activeClassName={styles.active} to="/">
      <span className={styles.nav}>首页</span>
    </NavLink>
    <NavLink activeClassName={styles.active} to="/market">
      <span className={styles.nav}>市场</span>
    </NavLink>
    <NavLink activeClassName={styles.active} to="/profile">
      <span className={styles.nav}>个人中心</span>
    </NavLink>
  </>
}
