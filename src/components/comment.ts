import { h } from '../dom'
import { Component } from './component'
import { Comment as CommentType } from '../comments'
import { getState, triggerAnEvent } from '../events'

type Props = {
    data: CommentType
}

class Comment extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const data = this.props.data
        const selectComment = () => {
            // First time it selects it
            if (data.id !== getState().selectedCommentId) {
                triggerAnEvent('select-comment', {
                    commentId: data.id,
                })
            }
        }
        const onBlur = (e: Event) => {
            const target = e.target as HTMLTextAreaElement
            triggerAnEvent('edit-comment', {
                commentId: data.id,
                text: target.value,
            })
        }
        const onDragEnd = (e: MouseEvent) => {
            triggerAnEvent('move-comment', {
                commentId: data.id,
                position: { x: e.clientX, y: e.clientY },
            })
        }
        const onMouseUp = (e: MouseEvent) => {
            e.preventDefault()
            const target = e.target as HTMLElement
            if (target.tagName === 'TEXTAREA') {
                // Do not interfere with text editing
                return
            }

            triggerAnEvent('resize-comment', {
                commentId: data.id,
                width: target.offsetWidth,
                height: target.offsetHeight,
            })
        }

        const selectedClass =
            getState().selectedCommentId === data.id.toString()
                ? 'selected'
                : ''
        const className = data.visible ? '' : 'hidden'

        return h('div', { class: className, onmouseup: onMouseUp }, [
            h(
                'div',
                {
                    class: `move-handle ${selectedClass}`,
                    draggable: 'true',
                    ondragend: onDragEnd,
                },
                []
            ),
            h('textarea', { onmouseup: selectComment, onblur: onBlur }, [
                data.text,
            ]),
        ])
    }
    override styles(): string {
        const data = this.props.data
        return `
            #${this.id} {
                user-select: none;
                display: block;
                position: absolute;
                background-color: #ddd;
                padding: 0px;
                width: ${data.width}px;
                height: ${data.height}px;
                top: ${data.position.y}px;
                left: ${data.position.x}px;

                min-width: 100px;
                min-height: 30px;

                overflow: hidden;
                resize: both;
            }
            #${this.id}.hidden {
                display: none;
            }
            #${this.id} textarea{
                width: 100%;
                height: 100%;
                background-color: yellow;
                border: 0px none;
                outline: none;
            }
            #${this.id} .move-handle {
                height: 10px;
                cursor: move;
            }
            #${this.id} .move-handle.selected {
                background-color: #333;
            }
        `
    }
}

export { Comment }
