import Vue, { Vnode } from 'vue'

declare global {
    namespace JSX {
        interface Element extends Vnode {}
        interface ElementClass extends Vue {}
        interface IntrinsicElements {
            [elem: string]: any
        }
    }
}
