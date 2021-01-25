import React, { useEffect } from 'react';
import AnimalCard from '@/components/animal-card';
import { LevelListData } from '@/data'
import useUser from '@/hooks/user';
import { getBalanceOf, getTokenOfOwnerByIndex, getAnimalInfo } from '@/service/nft'

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

export default () => {

  const { address } = useUser();

  const [level, setLevel] = React.useState('all');

  const onLevelItemClick = React.useCallback((id: string) => {
    setLevel(id);
  }, [level]);

  useEffect(() => {
    init()
  }, [address]);

  const init = async () => {
    // 根据用户的钱包地址，获取其所有生肖
    if (address) {
      // 获取生肖索引
      const index = await getBalanceOf(address)
      console.log(index)
      // 根据索引，循环获取生肖的tokenID
      for (let i = 0; i < index; i++) {
        const tokenID = await getTokenOfOwnerByIndex(address, i)
        // 根据生肖的tokenID，获取生肖信息
        const data = await getAnimalInfo(tokenID)
        console.log(data)
      }
    }
  }

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

      <div className={styles['list-container']}>
        {
          mockData.map(item => {
            return <AnimalCard className={styles.item} from="profile" id={item.id} key={item.id} data={item.data}></AnimalCard>
          })
        }

      </div>
    </div>
  );
}
