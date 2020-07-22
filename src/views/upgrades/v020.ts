import { ExportMarkDataV010 } from './V010'

const version = 'v0.2.0'

const labelTypeAdded = {
  id: 3,
  text: '描述',
  color: '#ff9d61',
  borderColor: '#b26d43'
}

const connectionTypeAdded = {
  id: 3,
  text: 'DS'
}

export function upgradeFromV010 (data: ExportMarkDataV010): ExportMarkDataV010 {
  data.markData.forEach(item => {
    item.labelCategories.push(labelTypeAdded)
    item.connectionCategories.push(connectionTypeAdded)
  })
  data.version = version
  return data
}
