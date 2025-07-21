import { h } from '../dom'
import { Component } from './component'

type Props = {
    currentPage: number
    totalPages: number
}

class PageCounter extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        return h('div', {}, [
            h('span', {}, ['Page ']),
            h('span', { class: 'current-page' }, [
                this.props.currentPage.toString(),
            ]),
            h('span', {}, [' / ']),
            h('span', { class: 'total-pages' }, [
                this.props.totalPages.toString(),
            ]),
        ])
    }
    override styles(): string {
        return `
            #${this.id} {
                display: flex;
                flex-direction: row;
                padding: 20px;
            }
            #${this.id} .current-page {
            }
            #${this.id} .total-page {
            }
        `
    }
}

export { PageCounter }
