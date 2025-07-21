import { describe, expect } from '@jest/globals'
import { getState, triggerAnEvent } from '../events'
import { MyPdfViewer } from '../mypdfviewer'
jest.mock('../mypdfviewer')

// jest.mock('../mypdfviewer', () => {
//     MyPdfViewer: jest.fn().mockImplementation(() => {
//         return {}
//     })
// })

const mock_viewer = new MyPdfViewer(
    document.createElement('canvas'),
    document.createElement('div')
)
const initialState = {
    currentPage: 1,
    numPages: 2,
    viewer: mock_viewer,
}

beforeEach(async () => {
    return await triggerAnEvent('initial-state', { ...initialState })
})

//test suite
describe('events module', () => {
    it('initial-state', async () => {
        const { currentPage, numPages, viewer } = getState()
        expect(currentPage).toBe(1)
        expect(numPages).toBe(2)
        expect(viewer).toBe(mock_viewer)
    })
    it('render-next-page', async () => {
        await triggerAnEvent('render-next-page', {
            currentPage: 1,
            numPages: 10,
        })
        const { currentPage } = getState()
        expect(currentPage).toBe(2)
    })
    it('render-next-page last page does not go next', async () => {
        await triggerAnEvent('initial-state', {
            ...initialState,
            currentPage: 10,
            numPages: 10,
        })
        await triggerAnEvent('render-next-page', {
            currentPage: 10,
            numPages: 10,
        })
        const { currentPage } = getState()
        expect(currentPage).toBe(10)
    })
    it('render-prev-page', async () => {
        await triggerAnEvent('render-prev-page', {
            currentPage: 10,
            numPages: 10,
        })
        const { currentPage } = getState()
        expect(currentPage).toBe(9)
    })
    it('render-prev-page first page does not go prev', async () => {
        await triggerAnEvent('render-prev-page', { currentPage: 1 })
        const { currentPage } = getState()
        expect(currentPage).toBe(1)
    })
    it('select-tool-add-comment', async () => {
        await triggerAnEvent('select-tool-add-comment', {})
        const { selectedTool, statusText } = getState()
        expect(selectedTool).toBe('add-comment')
        expect(statusText).toContain('add a comment')
    })
    it('select-comment', async () => {
        await triggerAnEvent('initial-state', {
            ...initialState,
            selectedCommentId: '123',
        })
        await triggerAnEvent('select-comment', {
            commentId: '123',
            commentPage: 2,
        })
        const { selectedCommentId, currentPage } = getState()
        expect(selectedCommentId).toBe('123')
        expect(currentPage).toBe(2)
    })
    it('add-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        const { comments, statusText, selectedTool, selectedCommentId } =
            getState()
        expect(comments.length).toBe(1)
        expect(comments[0]).toEqual({
            id: '0',
            page: 1,
            position: { x: 100, y: 100 },
            width: 100,
            height: 30,
            text: 'Enter your comment',
            visible: true,
            removed: false,
            version: '1.0',
        })
        expect(statusText).toBe(undefined)
        expect(selectedTool).toBe(undefined)
        expect(selectedCommentId).toBe('0')
    })

    it('edit-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('edit-comment', {
            commentId: '0',
            text: 'A new edited text',
        })
        const { comments, selectedCommentId } = getState()
        expect(comments[0].text).toBe('A new edited text')
        expect(selectedCommentId).toBe('0')
    })
    it('move-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('move-comment', {
            commentId: '0',
            position: { x: 200, y: 200 },
        })
        const { comments, selectedCommentId } = getState()
        expect(comments[0].position).toEqual({ x: 200, y: 200 })
        expect(selectedCommentId).toBe('0')
    })
    it('resize-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('resize-comment', {
            commentId: '0',
            width: 200,
            height: 50,
        })
        const { comments, selectedCommentId } = getState()
        expect(comments[0].width).toBe(200)
        expect(comments[0].height).toBe(50)
        expect(selectedCommentId).toBe('0')
    })
    it('remove-comment and no comment exists', async () => {
        expect(getState().comments.length).toBe(0)
        await triggerAnEvent('remove-comment', {
            commentId: '0',
        })
        const { comments, selectedCommentId, statusText } = getState()
        expect(comments.length).toBe(0)
        expect(statusText).toContain('No comment')
        expect(selectedCommentId).toBe(undefined)
    })
    it('remove-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('remove-comment', {
            commentId: '0',
        })
        const { comments, selectedCommentId } = getState()
        expect(comments.length).toBe(1)
        expect(comments[0].removed).toBe(true)
        expect(selectedCommentId).toBe(undefined)
    })
    it('hide-selected-comment and no comment selected', async () => {
        expect(getState().selectedCommentId).toBe(undefined)
        await triggerAnEvent('hide-selected-comment', {
            commentId: '0',
        })
        const { selectedCommentId, statusText } = getState()
        expect(selectedCommentId).toBe(undefined)
        expect(statusText).toContain('No comment selected')
    })
    it('hide-selected-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('add-comment', {
            currentPage: 2,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('select-comment', {
            commentId: '0',
            commentPage: 1,
        })
        expect(getState().selectedCommentId).toBe('0')

        await triggerAnEvent('hide-selected-comment', {
            commentId: '0',
        })
        const { selectedCommentId, comments } = getState()
        expect(selectedCommentId).toBe(undefined)
        expect(comments[0].visible).toBe(false)
    })
    it('hide-all-comments', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('add-comment', {
            currentPage: 2,
            position: { x: 100, y: 100 },
        })
        let { comments } = getState()
        expect(comments[0].visible).toBe(true)
        expect(comments[1].visible).toBe(true)

        await triggerAnEvent('hide-all-comments', {})
        comments = getState().comments
        expect(comments[0].visible).toBe(false)
        expect(comments[1].visible).toBe(false)
    })
    it('show-selected-comment', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('add-comment', {
            currentPage: 2,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('hide-all-comments', {})
        let comments = getState().comments
        expect(comments[0].visible).toBe(false)
        expect(comments[1].visible).toBe(false)
        await triggerAnEvent('select-comment', {
            commentId: '0',
            commentPage: 1,
        })
        const selectedCommentId = getState().selectedCommentId
        expect(selectedCommentId).toBe('0')
        await triggerAnEvent('show-selected-comment', {
            commentId: '0',
        })
        comments = getState().comments
        expect(comments[0].visible).toBe(true)
    })
    it('show-selected-comment and none selected', async () => {
        const selectedCommentIdVal = getState().selectedCommentId
        expect(selectedCommentIdVal).toBe(undefined)
        await triggerAnEvent('show-selected-comment', {
            commentId: '0',
        })
        const { selectedCommentId, statusText } = getState()
        expect(selectedCommentId).toBe(undefined)
        expect(statusText).toContain('No comment selected to show')
    })
    it('show-all-comments', async () => {
        await triggerAnEvent('add-comment', {
            currentPage: 1,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('add-comment', {
            currentPage: 2,
            position: { x: 100, y: 100 },
        })
        await triggerAnEvent('hide-all-comments', {})
        let comments = getState().comments
        expect(comments[0].visible).toBe(false)
        expect(comments[1].visible).toBe(false)

        await triggerAnEvent('show-all-comments', {})
        comments = getState().comments
        expect(comments[0].visible).toBe(true)
        expect(comments[1].visible).toBe(true)
    })
})
