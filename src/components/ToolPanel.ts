import { h } from '../dom'
import { Button } from './button'
import { Component } from './component'
import { getState, triggerAnEvent } from '../events'
import { CommentsList } from './commentsList'
import { downloadObjectAsJsonFile } from '../utils'

type Props = object

class ToolPanel extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const { comments, selectedCommentId } = getState()
        const selectAdd = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('select-tool-add-comment', {})
        }
        const removeComment = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('remove-comment', {
                commentId: selectedCommentId,
            })
        }
        const exportComments = (e: Event) => {
            e.preventDefault()
            downloadObjectAsJsonFile(
                getState().comments,
                'mypdfviewer_comments'
            )
        }
        const hideSelectedComment = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('hide-selected-comment', {
                commentId: selectedCommentId,
            })
        }
        const hideAllComments = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('hide-all-comments', null)
        }
        const showSelectedComment = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('show-selected-comment', {
                commentId: selectedCommentId,
            })
        }
        const showAllComments = (e: Event) => {
            e.preventDefault()
            triggerAnEvent('show-all-comments', null)
        }

        // only non removed
        const nonRemovedComments = comments.filter((c) => !c.removed)

        return h('div', { class: 'tool-panel' }, [
            new Button({ text: 'Add', onClick: selectAdd }, []),
            new Button({ text: 'Remove', onClick: removeComment }, []),
            new Button(
                { text: 'Hide selected', onClick: hideSelectedComment },
                []
            ),
            new Button({ text: 'Hide all', onClick: hideAllComments }, []),
            new Button(
                { text: 'Show selected', onClick: showSelectedComment },
                []
            ),
            new Button({ text: 'Show all', onClick: showAllComments }, []),
            new CommentsList(
                {
                    comments: nonRemovedComments,
                    selectedId: selectedCommentId,
                },
                []
            ),
            new Button(
                { text: 'Export comments', onClick: exportComments },
                []
            ),
            new Button({ text: 'Import comments', onClick: () => {} }, []),
        ])
    }
    override styles(): string {
        return `
            #${this.id} {
                display: flex;
                flex-direction: column;
                padding: 10px;
                background-color: #ddd;
                gap: 10px;
            }
            #${this.id} .current-page {
            }
            #${this.id} .total-page {
            }
        `
    }
}

export { ToolPanel }
