import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from '../modal';

import styles from './styles.less';

export default function Loading({ content = '正在处理中' }) {

  return (<Modal>
    <div className={styles.container}>
      <LoadingOutlined spin style={{ fontSize: 48, color: '#1890ff'}} />
      <span className={styles.content}>{content}</span>
    </div>
  </Modal>)
}
