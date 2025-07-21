import { h } from '../dom'
import { Component } from './component'
import { triggerAnEvent } from '../events'

type Props = {
    selectedTool?: string
    currentPage?: number
}

class CommentsContainer extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const onClick = (e: MouseEvent) => {
            e.preventDefault()
            if (this.props.selectedTool === 'add-comment') {
                triggerAnEvent('add-comment', {
                    currentPage: this.props.currentPage,
                    position: {
                        x: e.clientX + window.scrollX,
                        y: e.clientY + window.scrollY,
                    },
                })
            }
        }
        return h(
            'div',
            { class: 'comment-area', onclick: onClick },
            this.children
        )
    }

    override styles(): string {
        return `
            #${this.id} {
            }
        `
    }
}

export { CommentsContainer }
