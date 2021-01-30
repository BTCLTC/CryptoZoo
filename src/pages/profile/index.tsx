import React, { useEffect } from 'react';
import { Empty, Spin, Modal, message } from 'antd';
import { BigNumber } from 'ethers'
import AnimalCard from '@/components/animal-card';
import Loading from '@/components/loading';
import { LevelListData } from '@/data'
import useUser from '@/hooks/user';
import { getBalanceOf, getTokenOfOwnerByIndex, getAnimalInfo, getUserInfo, upgrade } from '@/service/nft'

import styles from './styles.less';


const mockData = [{
  id: 1,
  data: {
    status: '卖出',
    count: 1,
  }
},
{
  id: 2,
  data: {
    status: '卖出',
    count: 1,
  }
},
{
  id: 3,
  data: {
    status: '卖出',
    count: 1,
  }
},
{
  id: 4,
  data: {
    status: '卖出',
    count: 1,
  }
}]

interface Data {
  id: number;
  data: object;
}

export default () => {
  const [isFirst, setIsFirst] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [level, setLevel] = React.useState(1);
  const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState<Data[]>([]);
  const { address } = useUser();

  const onLevelItemClick = React.useCallback((id: number) => {
    setLevel(id);
    getLevelData(address, id, page);
  }, [address, level, page]);

  const getLevelData = async (address: string, level: number, page: number = 0, update: boolean = true) => {
    try {
      setLoading(true);
      const [data, noNext] = await getUserInfo(address, level, page);
      setLoading(false);
      setIsFirst(false);

      if (!noNext) {
        setPage(page + 1);
      }

      const formData = data.map((item: any[]) => {
        const [tokenId, animalLevel, animalType, price] = item;
        return {
          id: animalType,
          data: {
            level: animalLevel,
            tokenId: tokenId.toString(),
            price: price.toString(),
          }
        }
      });

      if (update) {
        setData(formData);
      }

      return formData;
    } catch (err) {
      message.error('人气大爆发');
      setLoading(false);
    }

    return [];
  }

  const init = () => {
    // 根据用户的钱包地址，获取其所有生肖
    if (address) {
      getLevelData(address, level, page);
    }

  }

  const onUpgrade = async (animalType, level, tokenId) => {
    const list = data.filter(item => item.id === animalType && item.data.level === level);

    if (list.length < 2) {
      return Modal.error({
        title: '错误',
        content: '升级最低需要2个同等级的动物'
      });
    }

    setLoading(true);
    await upgrade(...list.map(item => item.data.tokenId));
    setLoading(false);
  }

  useEffect(() => {
    init();
  }, [address]);

  return (
    <div>
      <div className={styles['level-container']}>
        <span className={styles.level} >所属级别</span>
        <div className={styles['level-list']}>
          {
            LevelListData.map(item => <span key={item.id} className={level === item.id ? `${styles['level-list-item']} ${styles['level-list-item-active']}` : styles['level-list-item']} onClick={() => onLevelItemClick(item.id)}>{item.title}</span>)
          }
        </div>
      </div>
      {loading && <Loading />}
      {!isFirst && <div className={styles['list-container']}>
        {
          data.length === 0 && <div className={styles['empty']}>
            <Empty description="没有动物，试着去商城购买吧" />
          </div>
        }
        {
          data.map((item, idx) => {
            return <AnimalCard className={styles.item} from="profile" id={item.id} key={item.data.tokenId || idx} data={item.data} onUpgrade={onUpgrade}></AnimalCard>
          })
        }
      </div>}

    </div>
  );
}
