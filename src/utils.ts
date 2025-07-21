/**
 * Triggers the browser to download a json file
 * with the serialized object
 *
 * @param exportObj variable / object to export
 * @param exportName name of the json file (without extension)
 */
const downloadObjectAsJsonFile = (exportObj: object, exportName: string) => {
    const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(exportObj))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', exportName + '.json')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

export { downloadObjectAsJsonFile }
