import { MyPdfViewer } from './mypdfviewer'
import { Comment, Position } from './comments'

/**
 * The state of the application
 * Only some basic fields are mandatory
 */
type State = {
    currentPage: number
    numPages: number
    viewer: MyPdfViewer
    comments: Comment[]
    statusText?: string
    selectedTool?: 'add-comment'
    selectedCommentId?: string
}

let state: State

/**
 * The state router of the application
 * @remarks
 * Similar to using a state machine to handle the state of the application
 *
 * @example
 * ```ts
 * await triggerAnEvent('initial-state', {
 *     currentPage: 1,
 *     numPages: 2,
 *     viewer: this,
 * })
 * ```
 */
type EventsAndPayloads = {
    'initial-state': {
        currentPage: number
        numPages: number
        viewer: MyPdfViewer
    }
    'render-next-page': {
        currentPage: number
        numPages: number
    }
    'render-prev-page': {
        currentPage: number
    }
    'select-tool-add-comment': {
        never?: never
    }
    'select-comment': {
        commentId: string
        commentPage?: number
    }
    'add-comment': {
        currentPage: number
        position: Position
    }
    'edit-comment': {
        commentId: string
        text: string
    }
    'move-comment': {
        commentId: string
        position: Position
    }
    'resize-comment': {
        commentId: string
        width: number
        height: number
    }
    'remove-comment': {
        commentId?: string
    }
    'hide-selected-comment': {
        commentId?: string
    }
    'hide-all-comments': {
        never?: never
    }
    'show-selected-comment': {
        commentId?: string
    }
    'show-all-comments': {
        never?: never
    }
}

/**
 *
 * @returns the current state of the application
 */
const getState = (): State => {
    return state
}

/**
 * Function to trigger an event from anywhere in the application
 * @param name key of events allowed
 * @param payload parameters needed to trigger the event
 * @todo improve type definition
 */
// const triggerAnEvent = async <K extends keyof EventsAndPayloads>(name: K, payload: EventsAndPayloads[K] ): Promise<void> => {
const triggerAnEvent = async <K extends keyof EventsAndPayloads>(
    name: K,
    payload: any // eslint-disable-line
): Promise<void> => {
    switch (name) {
        case 'initial-state':
            state = {
                currentPage: payload.currentPage,
                numPages: payload.numPages,
                viewer: payload.viewer,
                comments: [],
            }
            break
        case 'render-next-page':
            if (payload.currentPage < payload.numPages) {
                state.currentPage = payload.currentPage + 1
                await state.viewer.renderPage(state.currentPage)
            }
            break
        case 'render-prev-page':
            if (payload.currentPage > 1) {
                state.currentPage = payload.currentPage - 1
                await state.viewer.renderPage(state.currentPage)
            }
            break
        case 'select-tool-add-comment':
            state.selectedTool = 'add-comment'
            state.statusText = 'Click on the document to add a comment'
            break
        case 'select-comment':
            state.selectedCommentId = payload.commentId
            // change page to where comment is
            state.currentPage = payload.commentPage ?? state.currentPage
            break
        case 'add-comment':
            state.comments.push({
                id: state.comments.length.toString(),
                page: payload.currentPage,
                position: payload.position,
                width: 100,
                height: 30,
                text: 'Enter your comment',
                visible: true,
                removed: false,
                version: '1.0',
            })
            state.statusText = undefined
            state.selectedTool = undefined
            state.selectedCommentId = (state.comments.length - 1).toString()
            break
        case 'edit-comment':
            state.comments[payload.commentId].text = payload.text
            state.selectedCommentId = payload.commentId
            break
        case 'move-comment':
            state.comments[payload.commentId].position = payload.position
            state.selectedCommentId = payload.commentId
            break
        case 'resize-comment':
            state.comments[payload.commentId].width = payload.width
            state.comments[payload.commentId].height = payload.height
            state.selectedCommentId = payload.commentId
            break
        case 'remove-comment':
            if (!state.selectedCommentId) {
                state.statusText =
                    'No comment selected. Select one by clicking on it on the document or toolbar list'
            } else if (payload.commentId === state.selectedCommentId) {
                // we mark as removed but we don't remove from the array
                state.comments[payload.commentId].removed = true
                // deselect
                state.selectedCommentId = undefined
            }
            break
        case 'hide-selected-comment':
            if (!state.selectedCommentId) {
                state.statusText =
                    'No comment selected to hide. Select one by clicking on it on the document or toolbar list'
            } else if (payload.commentId === state.selectedCommentId) {
                // we mark as hidden
                state.comments[payload.commentId].visible = false
                // deselect
                state.selectedCommentId = undefined
            }
            break
        case 'hide-all-comments':
            for (const c of state.comments) {
                c.visible = false
            }
            break
        case 'show-selected-comment':
            if (!state.selectedCommentId) {
                state.statusText =
                    'No comment selected to show. Select one by clicking on it on the toolbar list'
            } else if (payload.commentId === state.selectedCommentId) {
                // we mark as visible
                state.comments[payload.commentId].visible = true
                // deselect
                state.selectedCommentId = undefined
            }
            break
        case 'show-all-comments':
            for (const c of state.comments) {
                c.visible = true
            }
            break
        default:
            throw new Error(`Not implemented event:${name}`)
    }

    await state.viewer?.reRender()
}

export { getState, triggerAnEvent }
