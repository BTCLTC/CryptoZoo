import React, { useState, useCallback } from 'react';
import { Modal, notification } from 'antd';

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
    tokenID: string;
    // 状态，售卖中，已卖，未卖
    status: string;
    count: number;
  }
}

export default function AnimalCard(props: Props) {

  const { id, from, data, className } = props;
  const cls = getAnimalBg(id);

  let price = '';

  const priceChange = (value: string) => {
    price = value;
  };

  // 购买
  const onBuyHandler = useCallback((isTrade: boolean, level: number) => {
    if (isTrade) {
      Modal.confirm({
        title: '盲拍 - 购买',
        content: <NumericInput onChange={(value: string) => priceChange(value)} />,
        okText: '确认',
        cancelText: '取消',
        onOk: async (e) => {
          if (price) {
            const tx = await buyBids(level, id, price);
            if (tx.wait) {
              await tx.wait();
              notification.success({
                message: '温馨提示',
                description: '交易成功'
              });
            } else {
              notification.error({
                message: '温馨提示',
                description: '交易失败'
              });
            }
          }
        }
      });
    }
  }, [price]);

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
      return <div className={isTrade ? `${styles['btn-trade']} ${styles['trade']}` : styles['btn-trade']} onClick={() => onBuyHandler(isTrade, level)}>
        <span>购买</span>
      </div>
    }

    const { status, tokenID } = data;
    return <div className={styles['profile-btn-group']}>
      <span className={styles.btn} onClick={onUpgradeHandler}>升级</span>
      <span className={styles.split} /><span className={styles.btn} onClick={() => onSellHandler(tokenID)}>出售</span>

      {status === '卖出' && <><span className={styles.split} /><span className={styles.btn} onClick={onRebuyHandler}>回购</span></>}
      {status === '买入' && <><span className={styles.split} /><span className={styles.btn} onClick={onSellHandler}>出售</span></>}
      {status === '售卖中' && <><span className={styles.split} /><span className={styles.btn}>出售中</span></>}
    </div>
  }, [id, from, data, price]);

  return <div className={`${cls} ${className}`}>
    {from === 'profile' && <span className={styles.tags}>赠送</span>}
    {from === 'profile' && <span className={styles.count}>{data.count}</span>}
    {renderFooter()}
  </div>
}
