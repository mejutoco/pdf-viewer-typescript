import { h } from '../dom'
import { getState } from '../events'
import { Button } from './button'
import { Component } from './component'
import { PageCounter } from './pageCounter'

type Props = {
    onClickPrev: (e: Event) => void
    onClickNext: (e: Event) => void
}

class TopNav extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }
    override html(): HTMLElement {
        const { numPages, currentPage } = getState()

        const prevDisabled = currentPage == 1
        const nextDisabled = currentPage === numPages

        return h('div', { class: 'top-nav' }, [
            new Button(
                {
                    text: 'Prev',
                    onClick: this.props.onClickPrev,
                    disabled: prevDisabled,
                },
                []
            ),
            new PageCounter(
                {
                    currentPage: getState().currentPage,
                    totalPages: getState().numPages,
                },
                []
            ),
            new Button(
                {
                    text: 'Next',
                    onClick: this.props.onClickNext,
                    disabled: nextDisabled,
                },
                []
            ),
        ])
    }

    override styles(): string {
        return `
            #${this.id} {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                background-color: #ddd;
                padding: 10px;
                box-sizing: border-box;
            }
        `
    }
}

export { TopNav }
