import React from 'react';
import { Modal } from 'antd';

import NumericInput from '@/components/numerical-input';
import { buyBids, upgrade } from '@/service/nft';
import styles from './styles.less';


const getAnimalBg = (id: number) => {
  const cls = `${styles.animal} ${styles[`animal-${id}`]}`;

  return cls;
}

interface Props {
  id: number;
  from: 'market' | 'profile';
  className?: string;
  clickCallback?: Function;
  data: {
    type: 'buy' | 'sell';
    isTrade: boolean;
    level: number;
    // 状态，售卖中，已卖，未卖
    status: string;
    count: number;
  }
}

export default function AnimalCard(props: Props) {
  const { id, from, data, className, clickCallback } = props;
  const cls = getAnimalBg(id);

  const onPurchaseHandler = (isTrade: boolean, type: 'buy' | 'sell') => {
    // if (clickCallback && isTrade) {
    if (clickCallback) {
      clickCallback(type)
    }
  }
  const onRebuyHandler = () => {

  }

  const onSellHandler = (token: string) => {
    Modal.confirm({
      title: '请输入价格',
      // icon: <ExclamationCircleOutlined />,
      content: <NumericInput />,
      okText: '确认',
      cancelText: '取消',
    });
    // sellBids(token, )
  }

  const onUpgradeHandler = () => {

  }

  const renderFooter = React.useCallback(() => {
    if (from === 'market') {
      const { type, isTrade } = data;
      return <div className={isTrade ? `${styles['btn-trade']} ${styles['trade']}` : styles['btn-trade']} onClick={() => onPurchaseHandler(isTrade, type)}>
        <span>{type == 'buy' ? '购买' : '出售'}</span>
      </div>
    }

    const { status } = data;
    return <div className={styles['profile-btn-group']}>
      <span className={styles.btn} onClick={onUpgradeHandler}>升级</span>
      <><span className={styles.split} /><span className={styles.btn} onClick={onSellHandler}>出售</span></>

      {status === '卖出' && <><span className={styles.split} /><span className={styles.btn} onClick={onRebuyHandler}>回购</span></>}
      {status === '买入' && <><span className={styles.split} /><span className={styles.btn} onClick={onSellHandler}>出售</span></>}
      {status === '售卖中' && <><span className={styles.split} /><span className={styles.btn}>出售中</span></>}
    </div>
  }, [id, from, data]);

  return <div className={`${cls} ${className}`}>
    {from === 'profile' && <span className={styles.tags}>赠送</span>}
    {from === 'profile' && <span className={styles.count}>{data.count}</span>}
    {renderFooter()}
  </div>
}
