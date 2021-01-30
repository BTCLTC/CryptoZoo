import React, { useState, useCallback } from 'react';
import { Modal, notification } from 'antd';

import NumericInput from '@/components/numerical-input';
import Loading from '@/components/loading';
import { buyBids, sellBids, redeem } from '@/service/nft';
import styles from './styles.less';


export const getAnimalBg = (id: number) => {
  const cls = `${styles.animal} ${styles[`animal-${id}`]}`;

  return cls;
}

interface Props {
  id: number;
  from: 'market' | 'profile';
  className?: string;
  clickCallback?: Function;
  onUpgrade?: Function;
  data: {
    type: 'buy' | 'sell';
    isTrade: boolean;
    level: number;
    tokenID: string;
    // 状态，售卖中，已卖，未卖
    status: string;
    count: number;
    [key: string]: any;
  }
}

export default function AnimalCard(props: Props) {
  const [loading, setLoading] = useState(false);

  const { id, from, data, className } = props;
  const cls = getAnimalBg(id);

  let price = '';

  const priceChange = (value: string) => {
    price = value;
  };

  // 购买
  const onBuyHandler = (isTrade: boolean, level: number) => {
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
  };

  const onRebuyHandler = async (tokenId: string) => {
    try {
      setLoading(true);
      const status = await redeem(tokenId);
      setLoading(false);

      if (status) {
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
    } catch (err) {
      setLoading(false);
      notification.error({
        message: '温馨提示',
        description: '交易失败'
      });
    }
  }

  const onSellHandler = (token: string) => {
    Modal.confirm({
      title: '请输入价格',
      content: <NumericInput onChange={priceChange} />,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        if (price) {
          const tx = await sellBids(token, price);
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

  const onUpgradeHandler = (level, tokenId) => {
    if (props.onUpgrade) {
      props.onUpgrade(level, tokenId);
    }
  }

  const renderFooter = React.useCallback(() => {
    if (from === 'market') {
      const { isTrade, level } = data;
      return <div className={isTrade ? `${styles['btn-trade']} ${styles['trade']}` : styles['btn-trade']} onClick={() => onBuyHandler(isTrade, level)}>
        <span>购买</span>
      </div>
    }

    const { level, price, tokenId } = data;

    return <div className={styles['profile-btn-group']}>
      <span className={level < 5 ? styles.btn : `${styles.btn} ${styles['btn-disabled']}`} onClick={level < 5 ? () => onUpgradeHandler(id, level, tokenId) : () => { }}>升级</span>
      {level >= 3 && <><span className={styles.split} /><span className={styles.btn} onClick={() => onRebuyHandler(tokenId)}>回购</span></>}
      {level > 1 && <><span className={styles.split} /><span className={styles.btn} onClick={onSellHandler}>出售</span></>}
      {price !== '0' && <><span className={styles.split} /><span className={styles.btn}>出售中</span></>}
    </div>
  }, [id, from, data, price]);

  return <div className={`${cls} ${className}`}>
    {loading && <Loading />}
    {from === 'profile' && <span className={styles.tags}>赠送</span>}
    {from === 'profile' && <span className={styles.count}>{data.count}</span>}
    {renderFooter()}
  </div>
}
