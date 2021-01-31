import React, { useState, useCallback } from 'react';
import { Modal, notification, Input } from 'antd';
import { isAddress } from 'web3-utils';
import { UserOutlined } from '@ant-design/icons';
import NumericInput from '@/components/numerical-input';
import Loading from '@/components/loading';
import useUser from '@/hooks/user';
import { buyBids, sellBids, redeem, transfer } from '@/service/nft';
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
  const [content, setContent,] = useState('正在处理中...');
  const { address, } = useUser();

  const { id, from, data, className } = props;
  const cls = getAnimalBg(id);

  let price = '';
  let toAddress = '';

  const priceChange = (value: string) => {
    price = value;
  };

  const addressChange = (e: any) => {
    const value = e.target.value;
    toAddress = value;
  }

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
            const tx = await buyBids(level, id, price).catch(() => {});
            if (tx && tx.wait) {
              await tx.wait();
              notification.success({
                message: '温馨提示',
                description: '交易成功'
              });
              setTimeout(() => window.location.reload(), 1000);
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
      setContent('正在提交...');

      const tx = await redeem(tokenId);
      setContent('正在进行交易...');

      if (tx.wait) {
        await tx.wait();
        notification.success({
          message: '温馨提示',
          description: '交易成功'
        });

        setTimeout(() => window.location.reload(), 1000);
      } else {
        notification.error({
          message: '温馨提示',
          description: '交易失败'
        });
      }
    } catch (err) {
      notification.error({
        message: '温馨提示',
        description: '交易失败'
      });
    }
    setLoading(false);
  }

  const onSellHandler = (token: string) => {
    Modal.confirm({
      title: '请输入价格',
      content: <NumericInput onChange={priceChange} />,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        if (price) {
          const tx = await sellBids({ token, price });

          if (tx.wait) {
            notification.success({
              message: '温馨提示',
              description: '提交成功，正在执行挂单，请等待'
            });

            await tx.wait();

            notification.success({
              message: '温馨提示',
              description: '挂单成功'
            });

            setTimeout(() => window.location.reload(), 1000);
          } else {
            notification.error({
              message: '温馨提示',
              description: '提交失败'
            });
          }
        }
      }
    });
  }

  const onUpgradeHandler = (animalType: number, level: number, tokenId: string) => {
    if (props.onUpgrade) {
      props.onUpgrade(animalType, level, tokenId);
    }
  }

  const giveHandler = (tokenId: string) => {
    Modal.confirm({
      title: '赠送',
      content: <Input placeholder="请输入接收地址" onChange={addressChange} prefix={<UserOutlined />} />,
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        if (toAddress) {
          if (isAddress(toAddress)) {
            const tx = await transfer(address, toAddress, tokenId).catch(() => {});
            if (tx && tx.wait) {
              await tx.wait();

              notification.success({
                message: '温馨提示',
                description: '赠送成功'
              });

              setTimeout(() => window.location.reload(), 1000);
            } else {
              notification.error({
                message: '温馨提示',
                description: '赠送失败'
              });
            }
          } else {
            notification.error({
              message: '温馨提示',
              description: '地址格式不正确'
            });
            return Promise.reject();
          }
        }
      }
    });
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
      {level > 1 && price === '0' && <><span className={styles.split} /><span className={styles.btn} onClick={() => onSellHandler(tokenId)}>出售</span></>}
      {price !== '0' && <><span className={styles.split} /><span className={styles.btn}>出售中</span></>}
    </div>
  }, [id, from, data, price]);

  return <div className={`${cls} ${className}`}>
    {loading && <Loading content={content} />}
    {from === 'profile' && <span className={styles.tags} onClick={() => giveHandler(data.tokenId)}>赠送</span>}
    {renderFooter()}
  </div>
}
