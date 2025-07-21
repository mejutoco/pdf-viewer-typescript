import { h } from '../dom'
import { Component } from './component'

type Props = {
    text?: string
}

class StatusBar extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        if (this.props.text === undefined) {
            return h('div', { class: 'status-bar' }, [])
        } else {
            return h('div', { class: 'status-bar' }, [
                h('p', {}, [this.props.text]),
            ])
        }
    }
    override styles(): string {
        return `
            #${this.id} {
            }
            #${this.id} p {
                background-color: yellow;
                text-align: center;
                height: 30px;
                margin: 0;
                padding: 10px;
            }
        `
    }
}

export { StatusBar }
