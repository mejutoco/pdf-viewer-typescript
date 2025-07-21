type Position = {
    x: number
    y: number
}

/**
 * Comments are the annotations that users can add to the pdf
 * They are linked to pages
 * They get marked as removed, but never deleted
 * They can be visible or not
 *
 * @remarks
 * We include a `version` field (json floats): "1.0"
 * for features like exporting and importing
 */
type Comment = {
    id: string
    page: number
    position: Position
    width: number
    height: number
    text: string
    visible: boolean
    removed: boolean
    version: string
}

export { Position, Comment }
