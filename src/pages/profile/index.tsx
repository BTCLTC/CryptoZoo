import React from 'react';
import AnimalCard from '@/components/animal-card';

import styles from './styles.less';

const LevelListData = [
  {
    title: '全部',
    id: 'all',
  },
  {
    title: '一级',
    id: '1',
  },
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
]

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
            return <AnimalCard className={styles.item} from="profile" id={item.id} key={item.id} data={item.data}></AnimalCard>
          })
        }
          
      </div>
    </div>
  );
}
