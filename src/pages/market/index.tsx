import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Loading from '@/components/loading';
import AnimalCard from '@/components/animal-card';
import useUser from '@/hooks/user';
import { getIsSale, getIsOnPurchased } from '@/service/nft'

import styles from './styles.less';

export const LevelListData = [
  {
    title: '二级',
    id: 2,
  },
  {
    title: '三级',
    id: 3,
  },
  {
    title: '四级',
    id: 4,
  },
  {
    title: '五级',
    id: 5,
  },
];

export default () => {
  const { address } = useUser();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('buy' as 'buy' | 'sell');
  const [level, setLevel] = useState(2);
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    init();
  }, [address]);

  const init = async () => {
    if (address) {
      getLevelData(level);
    }
  }

  const getLevelData = async (level: number) => {
    setLoading(true);
    const buyData = await getIsSale(level).catch(() => {
      setLoading(false);
    });
    if (buyData) {
      setMarketData(buyData);
    }
    setLoading(false);
  }

  // 点击购买/出售
  const onTypeClick = useCallback((_type: 'buy' | 'sell') => {
    setType(_type);
  }, [type]);

  // 点击等级
  const onLevelItemClick = useCallback((id: number) => {
    setLevel(id);
    getLevelData(id);
  }, [type, level]);

  const handleData = () => {
    const zooData = marketData.map((status: boolean, index: number) => {
      return {
        id: index + 1,
        from: 'market',
        data: {
          type: 'buy',
          isTrade: status,
          level
        }
      }
    });

    return zooData;
  }

  const dataSource = useMemo(handleData, [type, level, marketData]);

  return (
    <div>
      <div className={styles['type-container']}>
        <span className={`${styles['type-buy']}  ${styles['type-active']}`}>购买</span>
      </div>
      <div className={styles['level-container']}>
        <span className={styles.level} >所属级别</span>
        <div className={styles['level-list']}>
          {
            LevelListData.map(item => <span key={item.id} className={level === item.id ? `${styles['level-list-item']} ${styles['level-list-item-active']}` : styles['level-list-item']} onClick={() => onLevelItemClick(item.id)}>{item.title}</span>)
          }
        </div>
      </div>

        {loading && <Loading content="加载中..." />}
        <div className={styles['list-container']}>
          {
            dataSource.map(item => {
              return <AnimalCard className={styles.item} from="market" id={item.id} key={item.id} data={item.data}></AnimalCard>
            })
          }
        </div>
    </div>
  );
}
