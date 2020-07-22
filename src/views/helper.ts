import { MarkData, Label, SPO, DS, Slice, ExportMarkData, ConnectionCategory } from './DataModel'
import upgrade, { currentVersion } from './upgrades'

const SID = 0
const PID = 1
const OID = 2
const DID = 3

export function makeMarkData (content: string): MarkData {
  return {
    content,
    labelCategories: [
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
    ],
    labels: [],
    connectionCategories: [
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
    ],
    connections: []
  }
}

export function findSPO (data: MarkData): SPO[] {
  const spoData: SPO[] = []
  const { content, labels, connections } = data
  const pres = labels.filter(item => item.categoryId === PID)

  pres.forEach(pre => {
    const subs = connections
      .filter(link => link.toId === pre.id)
      .map(link => labels.find(label => label.id === link.fromId && label.categoryId === SID))
      .filter(Boolean) as Label[]
    const objs = connections
      .filter(link => link.fromId === pre.id)
      .map(link => labels.find(label => label.id === link.toId && label.categoryId === OID))
      .filter(Boolean) as Label[]

    if (!subs.length || !objs.length) {
      return
    }

    if (subs.length > 1 && objs.length > 1) {
      subs.forEach(sub => {
        const targetObjs = connections
          .filter(link => link.fromId === sub.id)
          .map(link => labels.find(label => label.id === link.toId && label.categoryId === OID))
          .filter(Boolean) as Label[]

        targetObjs.forEach(obj => {
          spoData.push(makeSPO(content, sub, pre, obj))
        })
      })
    } else {
      subs.forEach(sub => {
        objs.forEach(obj => {
          spoData.push(makeSPO(content, sub, pre, obj))
        })
      })
    }
  })

  return spoData
}

export function findDS (data: MarkData): DS[] {
  const dsData: DS[] = []
  const { content, labels, connections } = data
  const descs = labels.filter(item => item.categoryId === DID)
  descs.forEach(desc => {
    const subs = connections
      .filter(link => link.fromId === desc.id)
      .map(link => labels.find(label => label.id === link.toId && label.categoryId === SID))
      .filter(Boolean) as Label[]
    subs.forEach(sub => {
      dsData.push({
        desc: makeSlice(content, desc),
        sub: makeSlice(content, sub)
      })
    })
  })
  return dsData
}

function makeSPO (content: string, sub: Label, pre:Label, obj:Label): SPO {
  return {
    sub: makeSlice(content, sub),
    pre: makeSlice(content, pre),
    obj: makeSlice(content, obj)
  }
}

function makeSlice (content: string, label:Label):Slice {
  return [content.slice(label.startIndex, label.endIndex), [label.startIndex, label.endIndex]]
}

export function loadMarkData (data:any): ExportMarkData | null {
  const upgradeData = upgrade(data)
  return upgradeData
}

export function transformMarkData (data: ExportMarkData): MarkData[] {
  const contents = data.content.split('\n')
  const { labelCategories, connectionCategories } = data
  const markDataList: MarkData[] = contents.map((content, index) => {
    return {
      content,
      labels: [],
      connections: [],
      labelCategories: [...labelCategories],
      connectionCategories: [...connectionCategories]
    }
  })
  data.markData.forEach(markData => {
    const { contentIndex, labels, connections } = markData
    markDataList[contentIndex].labels = labels
    markDataList[contentIndex].connections = connections
  })
  return markDataList
}

export function retransformMarkData (data: MarkData[], content: string, connectionCategories: ConnectionCategory[]): ExportMarkData {
  content = content || data.map(item => item.content).join('\n')
  const { labelCategories } = makeMarkData('')
  const version = currentVersion
  const markData = data.map((item, index) => {
    const contentIndex = index
    const { labels, connections } = item
    return labels.length ? { contentIndex, labels, connections } : null
  }).filter(Boolean) as ExportMarkData['markData']
  return { content, markData, labelCategories, connectionCategories, version }
}
