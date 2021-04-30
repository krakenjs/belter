/* @flow */
import { isShadowElement } from '../../../src';


describe('isShadowElement cases', () => {
    it('should return true if parent node is shadow root', () => {
        const shadowHost = document.createElement('div');
        shadowHost.attachShadow({ mode: 'open' });

        const innerDiv = document.createElement('div');
        shadowHost.appendChild(innerDiv);

        const result = isShadowElement(innerDiv);

        if (!result) {
            throw new Error(`Expected result to be true, got ${ String(result) }`);
        }
    });

    it('should return false if parent node is not shadow root');
});

describe('getShadowRoot cases', () => {
    it('should return shadow root host');
});

describe('getShadowHost cases', () => {
    it('should return shadow host');
});

describe('insert shadow slots cases', () => {
    it('should throw exception if element is no in shadow DOM');
    it('should throw exception if HOST ELEMENT is in shadow DOM');
    it('should return slotProvider ');
});
