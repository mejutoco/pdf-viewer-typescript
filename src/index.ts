import { MyPdfViewer } from './mypdfviewer'

window.addEventListener('load', async () => {
    new MyPdfViewer(
        document.getElementById('canvas') as HTMLCanvasElement,
        document.getElementById('viewer')
    )
})
