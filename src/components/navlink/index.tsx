import React from 'react';
import { NavLink } from 'umi';

import styles from './styles.less';

export default () => {
  return <>
    <NavLink exact activeClassName={styles.active} to="/">首页</NavLink>
    <NavLink activeClassName={styles.active} to="/market">市场</NavLink>
    <NavLink activeClassName={styles.active} to="/profile">个人中心</NavLink>
  </>
}