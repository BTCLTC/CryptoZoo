import React, { useEffect, useState, useCallback } from 'react';
import { Spin, Modal, Input } from 'antd';
import AnimalCard from '@/components/animal-card';
import useUser from '@/hooks/user';
import { getIsSale, getIsOnPurchased, buy, sell } from '@/service/nft'
import { zoo } from '@/data'

import styles from './styles.less';

export const LevelListData = [
  {
    title: '二级',
    id: '2',
  },
  {
    title: '三级',
    id: '3',
  },
  {
    title: '四级',
    id: '4',
  },
  {
    title: '五级',
    id: '5',
  },
];

export default () => {
  // 初始化生肖数据
  const _zoo = Object.keys(zoo).map((key) => {
    return {
      id: key as unknown as number,
      from: 'market',
      data: {
        type: 'buy' as 'buy' | 'sell',
        isTrade: false
      }
    }
  })

  // 市场数据
  const _marketData = {
    sell: {
      2: [],
      3: [],
      4: [],
      5: []
    },
    buy: {
      2: [],
      3: [],
      4: [],
      5: []
    }
  }

  const { address } = useUser();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('buy' as 'buy' | 'sell');
  const [level, setLevel] = useState('2' as '2' | '3' | '4' | '5');
  const [data, setData] = useState(_zoo);
  const [marketData, setMarketData] = useState(_marketData);
  const [isModalVisible, setIsModalVisible] = useState(false);



  useEffect(() => {
    init()
  }, [address]);

  const init = async () => {
    const level2SellData = await getIsSale(2)
    const level3SellData = await getIsSale(3)
    const level4SellData = await getIsSale(4)
    const level5SellData = await getIsSale(5)

    const level2BuyData = await getIsOnPurchased(2)
    const level3BuyData = await getIsOnPurchased(3)
    const level4BuyData = await getIsOnPurchased(4)
    const level5BuyData = await getIsOnPurchased(5)

    const obj = {
      sell: {
        2: level2SellData,
        3: level3SellData,
        4: level4SellData,
        5: level5SellData
      },
      buy: {
        2: level2BuyData,
        3: level3BuyData,
        4: level4BuyData,
        5: level5BuyData
      }
    }
    setMarketData(obj);
    handleData(level2SellData);
  }

  // 点击购买/出售
  const onTypeClick = useCallback((_type: 'buy' | 'sell') => {
    setType(_type);
    handleData(marketData[_type][level]);
  }, [loading, type, data, marketData]);

  // 点击等级
  const onLevelItemClick = useCallback((id: '2' | '3' | '4' | '5') => {
    setLevel(id);
    handleData(marketData[type][id]);
  }, [loading, type, level, data, marketData]);

  const handleData = (Data: any) => {
    setLoading(true);
    const zooData = Data.map((status: boolean, index: number) => {
      return {
        id: index + 1,
        from: 'market',
        data: {
          type,
          isTrade: status
        }
      }
    });
    setData(zooData);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  const handleOk = useCallback(() => {

  }, [isModalVisible])

  const handleCancel = useCallback(() => {
    setIsModalVisible(false)
  }, [isModalVisible])

  // 点击购买或者出售
  const handlecClickCallback = (_type: 'buy' | 'sell') => {
    console.warn(_type);
    setIsModalVisible(true);
  }

  return (
    <div>
      <div className={styles['type-container']}>
        <span className={type == 'buy' ? `${styles['type-buy']}  ${styles['type-active']}` : styles['type-buy']} onClick={() => onTypeClick('buy')}>购买</span>
        <span className={type == 'sell' ? `${styles['type-sell']} ${styles['type-active']}` : styles['type-sell']} onClick={() => onTypeClick('sell')}>出售</span>
      </div>
      <div className={styles['level-container']}>
        <span className={styles.level} >所属级别</span>
        <div className={styles['level-list']}>
          {
            LevelListData.map(item => <span key={item.id} className={level === item.id ? `${styles['level-list-item']} ${styles['level-list-item-active']}` : styles['level-list-item']} onClick={() => onLevelItemClick(item.id)}>{item.title}</span>)
          }
        </div>
      </div>

      <Spin spinning={loading}>
        <div className={styles['list-container']}>
        {
          data.map(item => {
            return <AnimalCard clickCallback={(_type: 'buy' | 'sell') => handlecClickCallback(_type)} className={styles.item} from="market" id={item.id} key={item.id} data={item.data}></AnimalCard>
          })
        }
      </div>
      </Spin>

      <Modal
        title={type == "buy" ? "盲拍 - 购买" : "盲拍 - 出售"}
        visible={isModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input placeholder="请输入盲拍价格" suffix="ETH" />
      </Modal>
    </div>
  );
}
