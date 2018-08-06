/* @flow */
/* @jsx jsxToHTML */

import { regexMap, svgToBase64 } from './util';

// eslint-disable-next-line no-use-before-define
type ChildType = $ReadOnlyArray<ChildType> | JsxHTMLNode | string | void | null;
type ChildrenType = $ReadOnlyArray<ChildType>;

type PropsType = {
    class? : string,
    id? : string,
    innerHTML? : string,
    [string] : mixed
};

function htmlEncode(html : string = '') : string {
    return html.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
}

export class JsxHTMLNode {
    name : string
    props : ?PropsType
    children : ChildrenType

    constructor(name : string, props : ?PropsType, children : ChildrenType) {
        this.name = name;
        this.props = props;
        this.children = children;
    }

    toString() : string {
        return `<${ this.name }${ this.props ? ' ' : '' }${ this.props ? this.propsToString() : '' }>${ this.childrenToString() }</${ this.name }>`;
    }

    propsToString() : string {
        let props = this.props;

        if (!props) {
            return '';
        }

        return Object.keys(props).filter(key => {
            return key !== 'innerHTML' && props && props[key] !== false;
        }).map(key => {
            if (props) {
                let val = props[key];

                if (val === true) {
                    return `${ htmlEncode(key) }`;
                }

                if (typeof val === 'string') {
                    return `${ htmlEncode(key) }="${ htmlEncode(val) }"`;
                }
            }
            return '';
        }).filter(Boolean).join(' ');
    }

    childrenToString() : string {

        if (this.props && this.props.innerHTML) {
            return this.props.innerHTML;
        }

        if (!this.children) {
            return '';
        }

        let result = '';

        function iterate(children) {
            for (let child of children) {

                if (child === null || child === undefined) {
                    continue;
                }

                if (Array.isArray(child)) {
                    iterate(child);
                } else if (child instanceof JsxHTMLNode) {
                    result += child.toString();
                } else {
                    result += htmlEncode(child);
                }
            }
        }

        iterate(this.children);

        return result;
    }
}

export class JsxHTMLNodeContainer extends JsxHTMLNode {


    constructor(children : ChildrenType) {
        super('', {}, children);
    }

    toString() : string {
        return this.childrenToString();
    }
}

export function jsxToHTML(element : mixed, props : ?PropsType = {}, ...children : ChildrenType) : JsxHTMLNode {
    if (typeof element === 'string') {
        return new JsxHTMLNode(element, props, children);
    }

    if (typeof element === 'function') {
        return element(props, children);
    }
    
    throw new TypeError(`Expected jsx Element to be a string or a function`);
}

export function jsxRender(template : string, renderers : { [string] : (string) =>?(JsxHTMLNode | Array<JsxHTMLNode>) }) : JsxHTMLNode {

    // eslint-disable-next-line security/detect-unsafe-regex
    let nodes = regexMap(template, /\{\s*([a-z]+)(?::\s*([^} ]+))?\s*\}|([^${}]+)/g, (match, type, value, text) => {
        if (type) {
            if (!renderers[type]) {
                throw new Error(`Can not render type: ${ type }`);
            }

            return renderers[type](value);
        } else if (text && text.trim()) {

            if (!renderers.text) {
                return text;
            }

            if (/<br>/.test(text)) {
                return renderers.break(text);
            } else {
                return renderers.text(text);
            }
        } else {
            return text;
        }
    });

    return new JsxHTMLNodeContainer(nodes);
}

export function Fragment(props : PropsType, children : ChildrenType) : JsxHTMLNode {
    return new JsxHTMLNodeContainer(children);
}

export function SVG(props : PropsType) : JsxHTMLNode {
    let { svg, ...otherProps } = props;

    if (!svg || typeof svg !== 'string') {
        throw new TypeError(`Expected svg prop to be a string`);
    }

    return (
        <img src={ svgToBase64(svg) } { ...otherProps } />
    );
}
