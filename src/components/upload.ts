import { h } from '../dom'
import { Component } from './component'

type Props = {
    onUpload: (e: string) => void
}

class UploadComponent extends Component {
    constructor(props: Props, children: Component[]) {
        super(props, children)
    }

    override html(): HTMLElement {
        const handleFile = async (e: Event) => {
            e.preventDefault()
            const target = e.target as HTMLInputElement
            if (target.files === null) {
                return
            }
            const file = target.files[0]

            if (file) {
                const pdfData = await file.arrayBuffer()

                // callback
                this.props.onUpload(pdfData)
            }
        }

        const acceptedExtensions = '.pdf,.PDF'

        return h(
            'form',
            {
                id: 'uploadForm',
                method: 'post',
                action: '/not-used',
                enctype: 'multipart/form-data',
            },
            [
                h('label', { for: 'file' }, ['Select a .pdf file to upload']),
                h(
                    'input',
                    {
                        type: 'file',
                        id: 'file',
                        name: 'file',
                        accept: acceptedExtensions,
                        onchange: handleFile,
                    },
                    []
                ),
            ]
        )
    }

    override styles(): string {
        return `
            #${this.id} {
                display: flex;
                height: 100%;
                width: 100%;
                flex-direction: column;
                gap: 20px;
                align-items: center;
                justify-content: center;
            }
            #${this.id} {
            }
        `
    }
}

export { UploadComponent }
