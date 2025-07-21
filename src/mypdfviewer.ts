import * as pdfjs from 'pdfjs-dist'
import { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import { getState, triggerAnEvent } from './events'
import { Container } from './components/container'
import { TopNav } from './components/topNav'
import { ToolPanel } from './components/ToolPanel'
import { StatusBar } from './components/statusBar'
import { Comment } from './components/comment'
import { CommentsContainer } from './components/commentsContainer'
import { UploadComponent } from './components/upload'

/**
 * The entry point of the application
 *
 * @param {HTMLCanvasElement} canvasEl - The canvas element to render the pdf
 * @param {HTMLElement} viewerEl - The viewer element to render the UI
 * @param {number} pageNum - The page number to render: default 1
 * @param {boolean} isUploaded - The flag to check if the file is uploaded: default false
 * if the file is uploaded, the UI will be shown
 * Otherwise we see the upload file interface
 */
class MyPdfViewer {
    /**
     * The scale of the pdf. It can go over 1.0
     */
    private scale: number = 2.0
    private pdfDoc: PDFDocumentLoadingTask | PDFDocumentProxy | null
    private pageRendering: boolean = false
    private pageNumPending: number | null = null

    constructor(
        private canvasEl: HTMLCanvasElement | null,
        private viewerEl: HTMLElement | null,
        private pageNum: number = 1,
        private isUploaded: boolean = false
    ) {
        // TODO: replace to get smaller bundle?
        // https://github.com/mozilla/pdf.js/issues/10478
        // const pdfjs = await import('pdfjs-dist/build/pdf');
        // const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
        // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

        this.pdfDoc = null

        if (canvasEl === null) {
            throw new Error('Canvas element not found')
        }
        if (this.viewerEl === null) {
            throw new Error('Viewer element not found')
        }
        const onUpload = (pdfData: string) => {
            // we keep this context
            this.load(pdfData)
        }
        // ask to upload file
        new Container({}, [
            new UploadComponent({ onUpload: onUpload }, []),
        ]).render(this.viewerEl)
    }

    /**
     * Low level details to render the pdf page with the pdfjs library
     * @param num - The page number to render
     *
     * @remarks
     * Unlike some recommended examples of pdfjs
     * {@link https://mozilla.github.io/pdf.js/examples/}
     * we do not cache waited page numbers to render
     */
    public async renderPage(num: number) {
        /* eslint-disable @typescript-eslint/no-this-alias */
        const that = this
        if (that.canvasEl === null) {
            throw new Error('Canvas element not found')
        }
        // https://mozilla.github.io/pdf.js/examples/
        // Check if other page is rendering
        if (this.pageRendering) {
            // Cache waited page number until previous page rendering completed
            // uncomment to redner waited page
            // this.pageNumPending = num;
        } else {
            this.pageRendering = true
            // @ts-expect-error page typing
            const page: PDFPageProxy = await this.pdfDoc.getPage(num)
            const viewport = page.getViewport({ scale: that.scale })
            that.canvasEl.height = viewport.height
            that.canvasEl.width = viewport.width

            const ctx = that.canvasEl.getContext('2d')
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            }
            const renderTask = page.render(renderContext)

            // Wait for rendering to finish
            renderTask.promise.then(function () {
                that.pageRendering = false
                if (that.pageNumPending !== null) {
                    // Waited page must be rendered
                    that.renderPage(that.pageNumPending)
                    // prevent infinite loop
                    that.pageNumPending = null
                }
            })
        }
    }

    /**
     * Loading of the pdf file happens here. If successful, the UI will be shown
     * @param pdfData - The pdf data to load
     * 
     * @remarks
     * 
     * Alternative url example:
     * 
     *  ```ts
     *  const url =
     *       'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
     *  this.pdfDoc = await pdfjs.getDocument(url).promise
     * ```
     * 
     * Data example:

     * ```ts
     *  const pdfDataTest = atob(
     *      'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
     *      'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
     *      'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
     *      'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
     *      'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
     *      'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
     *      'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
     *      'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
     *      'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
     *      'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
     *      'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
     *      'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
     *      'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
     * ```
     */
    public async load(pdfData: string) {
        this.pdfDoc = await pdfjs.getDocument({ data: pdfData }).promise

        // will show interface
        this.isUploaded = true
        await triggerAnEvent('initial-state', {
            currentPage: this.pageNum,
            numPages: this.pdfDoc.numPages,
            viewer: this,
        })
    }
    /**
     * Re-render the UI after every state change
     *
     * @remarks
     * We overwrite the viewer element to remove the previous UI
     */
    public async reRender() {
        if (this.viewerEl !== null) {
            this.viewerEl.innerHTML = ''
        }
        this.render()
    }
    /**
     * First render of the full UI
     * @remarks
     * It is meant to be called once only
     */
    public async render() {
        if (this.viewerEl === null) {
            throw new Error('Viewer element not found')
        }
        await this.renderPage(getState().currentPage)

        const { selectedTool, currentPage, numPages } = getState()

        const nextPage = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('render-next-page', { currentPage, numPages })
        }
        const prevPage = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('render-prev-page', { currentPage })
        }

        // create comments in UI
        const comments: Comment[] = []
        const nonRemovedComments = getState().comments.filter(
            (c) => !c.removed && c.page === currentPage
        )
        for (const c of nonRemovedComments) {
            comments.push(new Comment({ data: c }, []))
        }

        new Container({}, [
            new TopNav({ onClickNext: nextPage, onClickPrev: prevPage }, []),
            new ToolPanel({}, []),
            new StatusBar({ text: getState().statusText }, []),
            new CommentsContainer({ selectedTool, currentPage }, comments),
        ]).render(this.viewerEl)
    }
}

export { MyPdfViewer }
