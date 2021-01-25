import React from 'react';
import AnimalCard from '@/components/animal-card';
import { LevelListData } from '@/data'

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
  const [level, setLevel] = React.useState('all');

  const onLevelItemClick = React.useCallback((id: string) => {
    setLevel(id);
  }, [level]);

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
            return <AnimalCard className={styles.item} from="market" id={item.id} key={item.id} data={item.data}></AnimalCard>
          })
        }

      </div>
    </div>
  );
}
