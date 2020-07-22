import { ExportMarkDataV010 } from './v010'

const version = 'v0.3.0'

const connectionTypeAdded = {
  id: 4,
  text: 'Link'
}

export function upgradeFromV020 (data: ExportMarkDataV010): ExportMarkDataV010 {
  data.markData.forEach(item => {
    item.connectionCategories.push(connectionTypeAdded)
  })
  data.version = version
  return data
}
