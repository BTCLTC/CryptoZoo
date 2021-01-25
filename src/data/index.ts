export const zoo = {
  1: '鼠',
  2: '牛',
  3: '虎',
  4: '兔',
  5: '龙',
  6: '蛇',
  7: '马',
  8: '羊',
  9: '猴',
  10: '鸡',
  11: '狗',
  12: '猪'
}

export type zooType = keyof typeof zoo;

export const LevelListData = [
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
