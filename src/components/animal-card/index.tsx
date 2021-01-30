import React, { useState, useCallback } from 'react';
import { Modal } from 'antd';

import NumericInput from '@/components/numerical-input';
import { buyBids, sellBids, upgrade } from '@/service/nft';
import styles from './styles.less';


const getAnimalBg = (id: number) => {
  const cls = `${styles.animal} ${styles[`animal-${id}`]}`;

  return cls;
}

interface Props {
  id: number;
  from: 'market' | 'profile';
  className?: string;
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

  const [price, setPrice] = useState('');

  const { id, from, data, className } = props;
  const cls = getAnimalBg(id);

  // 市场的购买/出售
  const onMarketHandler = useCallback((isTrade: boolean, level: number) => {
    // if (isTrade) {

    // }
    Modal.confirm({
      title: '盲拍 - 购买',
      // icon: <ExclamationCircleOutlined />,
      content: <NumericInput onChange={priceChange} />,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        console.log(price)
        const status = await buyBids(level, id, price)
        console.log(status);
        console.log(e)
      }
    });
  }, [price]);

  const priceChange = (value: string) => {
    setPrice(value)
  }

  const onRebuyHandler = () => {

  }

  const onSellHandler = (token: string) => {
    Modal.confirm({
      title: '出售',
      // icon: <ExclamationCircleOutlined />,
      content: <NumericInput onChange={priceChange} />,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        const status = await sellBids(token, price)
        console.log(status);
      }
    });
  }

  const onUpgradeHandler = () => {

  }

  const renderFooter = React.useCallback(() => {
    if (from === 'market') {
      const { isTrade, level } = data;
      return <div className={isTrade ? `${styles['btn-trade']} ${styles['trade']}` : styles['btn-trade']} onClick={() => onMarketHandler(isTrade, level)}>
        <span>购买</span>
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
