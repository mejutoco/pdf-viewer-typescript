import { h } from '../dom'
import { Component } from './component'

type Props = {
    never?: never
}

class Container extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        return h('div', {}, this.children)
    }

    override styles(): string {
        return `
            #${this.id} {
            }
        `
    }
}

export { Container }
