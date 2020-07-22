/* eslint-disable prefer-promise-reject-errors */
export function download (filename, content, type = 'text/plain') {
  const element = document.createElement('a')
  const BOM = '\uFEFF'

  const blob = new Blob([BOM + content], { type })
  const url = URL.createObjectURL(blob)

  element.setAttribute('href', url)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)
}

export function downloadFile (filename, content) {
  const element = document.createElement('a')
  const url = URL.createObjectURL(content)

  element.setAttribute('href', url)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function readFile (file, method = 'Text') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject

    if (method === 'Text') {
      reader.readAsText(file)
    } else if (method === 'BinaryString') {
      reader.readAsBinaryString(file)
    }
  })
}

export function selectFile (types = '.*') {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', function (e) {
      const file = input.files[0]
      const reg = new RegExp(types)

      if (reg.test(file.type)) {
        resolve(file)
      } else {
        reject('不支持的文件类型')
      }
      input.remove()
    })
    input.click()
  })
}
