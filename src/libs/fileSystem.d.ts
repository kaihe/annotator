export function download (filename: string, content:string, type?: string): void
export function downloadFile (filename: string, content: Blob): void
export function readFile (file: File, method?: string): Promise<any>
export function selectFile (type?: 'string'): Promise<any>
