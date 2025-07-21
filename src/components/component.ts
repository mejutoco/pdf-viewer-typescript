/**
 * Auto-incrementing counter for component ids
 */
let idCounter = 0

/**
 * The props of a component
 * Any object with a string as key can be passed
 */
type Props = {
    // TODO: improve type definition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

/**
 * Base class for all components
 *
 * Overriding html() method is mandatory
 * Overriding styles() method is optional
 */
class Component {
    readonly id: string

    constructor(
        protected props: Props,
        protected children: Component[]
    ) {
        // every component has a unique id
        this.id = `mypdfviewer_${idCounter++}`
    }
    /**
     * The html representation of the component
     * We can return the result of a h() function call
     */
    html(): HTMLElement {
        throw new Error('html() method must be overriden')
    }
    /***
     * The css styles of the component
     * We can return a string with the styles
     * We can use `${this.id}` to refer to the component id
     * and have scoped styles
     *
     * @remarks
     * we tried to use scoped {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:scope} but some browsers do not support it
     *
     * When they support it, we can use it to have scoped styles without the need of the id (the id would go in the render method instead of the styles method, only for this base component class)
     */
    styles(): string {
        return ''
    }
    render(container: HTMLElement): [HTMLElement, HTMLElement] {
        const el = this.html()
        el.setAttribute('id', this.id)

        const styleEl = document.createElement('style')
        styleEl.innerHTML = this.styles()

        container.appendChild(styleEl)
        container.appendChild(el)
        return [styleEl, el]
    }
}

export { Component }
