import { h } from '../dom'
import { Component } from './component'

type Props = {
    text: string
    disabled?: boolean
    onClick: (e: Event) => void
}

class Button extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const disabled = this.props.disabled ? { disabled: 'disabled' } : {}
        return h('button', { onclick: this.props.onClick, ...disabled }, [
            this.props.text,
        ])
    }
    override styles(): string {
        return `
            #${this.id} {
                background-color: #a3a3a3;
                color: #333
                border: none;
                padding: 10px;
                transition: all 200ms ease-in;
                cursor: pointer;
                border-radius: 4px;
            }
            #${this.id}:not([disabled]):hover {
                background-color: #666;
                color: #fff;
            }
            #${this.id}:disabled {
                cursor: auto;
            }
        `
    }
}

export { Button }
