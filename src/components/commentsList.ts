import { h } from '../dom'
import { Component } from './component'
import { Comment } from '../comments'
import { triggerAnEvent } from '../events'

type Props = {
    comments: Comment[]
    selectedId?: string
}

class CommentsList extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const props = this.props

        const comments = []
        if (props.comments.length === 0) {
            comments.push(h('li', {}, ['No comments yet']))
        } else {
            for (const c of props.comments) {
                const classNameSelected =
                    c.id === props.selectedId?.toString() ? 'selected' : ''
                const classNameVisible = c.visible ? '' : 'hidden'
                const className = `${classNameSelected} ${classNameVisible}`
                const commentDisplay = `p${c.page}:${c.text.substring(0, 20)}...`
                comments.push(
                    h(
                        'li',
                        {
                            class: className,
                            onclick: () => {
                                triggerAnEvent('select-comment', {
                                    commentId: c.id,
                                    commentPage: c.page,
                                })
                            },
                        },
                        [commentDisplay]
                    )
                )
            }
        }
        return h('div', {}, [h('h3', {}, ['Comments']), h('ul', {}, comments)])
    }
    override styles(): string {
        return `
            #${this.id} {
                border: none;
            }
            #${this.id} h3 {
            }
            #${this.id} ul {
                padding: 0;
                margin: 0;
                list-style: none;
                white-space: nowrap;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            #${this.id} li {
                padding-top: 2px;
                padding-bottom: 2px;
                cursor: pointer;
            }
            #${this.id} li.selected {
                background-color: #666;
                color: #fff;
            }
            #${this.id} li.hidden {
                opacity: 0.5;
            }
        `
    }
}

export { CommentsList }
