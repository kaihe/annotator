import { upgradeFromV010 } from './v020'
import { upgradeFromV020 } from './v030'
import { upgradeFromV030 } from './v040'
import { ExportMarkData } from '@/views/DataModel'

export const currentVersion = 'v0.4.0'

export default function upgrade (data:any): ExportMarkData | null {
  if (data.version === 'v0.1.0') {
    data = upgradeFromV010(data)
  }
  if (data.version === 'v0.2.0') {
    data = upgradeFromV020(data)
  }
  if (data.version === 'v0.3.0') {
    data = upgradeFromV030(data)
  }

  if (data.version === currentVersion) {
    return data as ExportMarkData
  } else {
    return null
  }
}
