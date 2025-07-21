import { Component } from './components/component'

/**
 * Utility function to create html elements
 * Similar to JSX
 * We can use also components mixed with html elements
 * so we can easily compose new components
 *
 * @param tag Name of the html tag
 * @param attrs any attributes `class`, `id`, `style`, `onclick`, etc
 * @param children Other elements under this element
 * @returns `HTMLElement`
 *
 * @remarks
 * Exported as `h` to clutter less in the components
 */
const createHtmlElement = (
    tag: string,
    attrs: object,
    children: HTMLElement[] | string[] | Component[]
): HTMLElement => {
    // element
    const el = document.createElement(tag)

    // attributes and events
    for (const key in attrs) {
        if (key.startsWith('on')) {
            const withoutOn = key.substring(2).toLowerCase()
            el.addEventListener(withoutOn, attrs[key as keyof typeof attrs])
        } else {
            el.setAttribute(key, attrs[key as keyof typeof attrs])
        }
    }

    // children
    for (const child of children) {
        if (typeof child === 'string') {
            el.innerHTML = child
        } else if (child instanceof Component) {
            // render any children
            // if we call render we need parent
            const [styleEl, htmlEl] = child.render(el)
            el.appendChild(styleEl)
            el.appendChild(htmlEl)
        } else {
            el.appendChild(child)
        }
    }
    return el
}

export { createHtmlElement as h }
