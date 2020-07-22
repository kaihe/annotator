export interface MarkData {
    content: string
    labels: Label[]
    labelCategories: LabelCategory[]
    connections: Connection[]
    connectionCategories: ConnectionCategory[]
}

export interface ExportMarkData {
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

export type StoragedMarkData = Omit<ExportMarkData, 'content'>

export interface Label {
    id: number
    categoryId: number
    startIndex: number
    endIndex: number
}

export interface LabelCategory {
    id: number
    text: string
    color: string
    borderColor: string
}

export interface Connection {
    id: 0,
    categoryId: 0,
    fromId: 0,
    toId: 1
}

export interface ConnectionCategory {
    id: number
    text: string
}

export type ExportSPO = Array<{
    spo: SPO[]
    ds: DS[]
    content: string
}>

export interface SPO {
    sub: Slice
    pre: Slice
    obj: Slice
}

export interface DS {
    desc: Slice
    sub: Slice
}

export type Slice = [string, [number, number]]
