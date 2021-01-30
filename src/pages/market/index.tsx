import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
    init();
  }, [address]);

  const init = async () => {
    setLoading(true);
    const sellData = await Promise.all([2, 3, 4, 5].map((l) => getIsSale(l)));
    const buyData = await Promise.all([2, 3, 4, 5].map((l) => getIsOnPurchased(l)));

    const obj = {
      sell: {
        2: sellData[0],
        3: sellData[1],
        4: sellData[2],
        5: sellData[3]
      },
      buy: {
        2: buyData[0],
        3: buyData[1],
        4: buyData[2],
        5: buyData[3]
      }
    }
    setMarketData(obj);
    setLoading(false);
  }

  // 点击购买/出售
  const onTypeClick = useCallback((_type: 'buy' | 'sell') => {
    setType(_type);
  }, [type]);

  // 点击等级
  const onLevelItemClick = useCallback((id: '2' | '3' | '4' | '5') => {
    setLevel(id);
  }, [type, level]);

  const handleData = () => {
    const data = marketData[type][level];
    const zooData = data.map((status: boolean, index: number) => {
      return {
        id: index + 1,
        from: 'market',
        data: {
          type,
          isTrade: status
        }
      }
    });

    return zooData;
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

  const dataSource = useMemo(handleData, [type, level, marketData]);

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
            dataSource.map(item => {
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
