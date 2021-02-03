import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useIntl } from 'umi';
import Loading from '@/components/loading';
import AnimalCard from '@/components/animal-card';
import useUser from '@/hooks/user';
import { LevelListData } from '@/data';
import { getIsSale } from '@/service/nft'

import styles from './styles.less';

export default () => {
  const { address } = useUser();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('buy' as 'buy' | 'sell');
  const [level, setLevel] = useState(2);
  const [marketData, setMarketData] = useState([]);

  const intl = useIntl();

  useEffect(() => {
    init();
  }, [address]);

  const init = async () => {
    if (address) {
      getLevelData(level);
    }
  }

  const getLevelData = async (_level: number) => {
    setLoading(true);
    const buyData = await getIsSale(_level).catch(() => {
      setLoading(false);
    });
    if (buyData) {
      setMarketData(buyData);
    }
    setLoading(false);
  }

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
  const levelData = LevelListData.filter((item) => item.id != 1);

  return (
    <div>
      <div className={styles['type-container']}>
        <span className={`${styles['type-buy']}  ${styles['type-active']}`}>{
          intl.formatMessage(
            {
              id: 'market.type',
              defaultMessage: '购买',
            },
          )
        }</span>
      </div>
      <div className={styles['level-container']}>
        <span className={styles.level} >{
          intl.formatMessage(
            {
              id: 'profile.level.label',
              defaultMessage: '所属级别',
            },
          )
        }</span>
        <div className={styles['level-list']}>
          {
            levelData.map(item => <span key={item.id} className={level === item.id ? `${styles['level-list-item']} ${styles['level-list-item-active']}` : styles['level-list-item']} onClick={() => onLevelItemClick(item.id)}>{item.title}</span>)
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
