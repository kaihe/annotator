import { Label, LabelCategory, Connection, ConnectionCategory } from '@/views/DataModel'
import { ExportMarkDataV010 } from './v010'

const version = 'v0.4.0'

const labelCategories = [
  {
    id: 0,
    text: '实体',
    color: '#eac0a2',
    borderColor: '#a38671'
  },
  {
    id: 1,
    text: '关系',
    color: '#619dff',
    borderColor: '#436db2'
  },
  {
    id: 2,
    text: '属性值',
    color: '#9d61ff',
    borderColor: '#6d43b2'
  },
  {
    id: 3,
    text: '描述',
    color: '#ff9d61',
    borderColor: '#b26d43'
  },
  {
    id: 4,
    text: '时间点',
    color: '#7df9dc',
    borderColor: '#59b39e'
  }
]

const connectionCategories = [
  {
    id: 0,
    text: 'SP'
  },
  {
    id: 1,
    text: 'PO'
  },
  {
    id: 2,
    text: 'SO'
  },
  {
    id: 3,
    text: 'DS'
  },
  {
    id: 4,
    text: 'Link'
  }
]

export function upgradeFromV030 (data: ExportMarkDataV010): ExportMarkDataV040 {
  const content = data.markData.map(item => item.content).join('\n')
  const markData = data.markData.map((item, index) => {
    const { labels, connections } = item
    const contentIndex = index
    return { contentIndex, labels, connections }
  })
  return { content, markData, labelCategories, connectionCategories, version }
}

export interface ExportMarkDataV040 {
    content: string
    markData: Array<{
        contentIndex: number
        labels: Label[]
        connections: Connection[]
    }>
    labelCategories: LabelCategory[]
    connectionCategories: ConnectionCategory[]
    version: string
}
