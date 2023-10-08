// client-side

export function fileToBase64(file: any): null | any {
  // pdf to base64 and store for the manipulation
  const reader = new FileReader()

  reader.readAsDataURL(file)
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      return reader.result
    } else {
      console.error('Cant save file data uri to the session storage')
      return null
    }
  }

  reader.onerror = (err) => {
    console.error('Something went wrong parsing pdf to base64', err)
    return null
  }
}

export function getFileDataUri() {
  return sessionStorage.getItem('fileBase64')
}