import { MouseEvent, TouchEvent } from 'react';

let _supportsCssVariables: boolean;

function supportsCssVariables(forceRefresh: boolean = false) {
    if (typeof _supportsCssVariables === 'boolean' && !forceRefresh) {
        return _supportsCssVariables;
    }

    const supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
    if (!supportsFunctionPresent) {
        return;
    }

    const explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
    // See: https://bugs.webkit.org/show_bug.cgi?id=154669
    // See: README section on Safari
    const weAreFeatureDetectingSafari10plus = (
        CSS.supports('(--css-vars: yes)') &&
        CSS.supports('color', '#00000000')
    );

    if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {
        _supportsCssVariables = !detectEdgePseudoVarBug();
    } else {
        _supportsCssVariables = false;
    }
    return _supportsCssVariables;
}

function detectEdgePseudoVarBug() {
    // Detect versions of Edge with buggy var() support
    // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
    const document = window.document;
    const node = document.createElement('div');
    node.className = 'mdc-ripple-surface--test-edge-var-bug';
    document.body.appendChild(node);

    // The bug exists if ::before style ends up propagating to the parent element.
    // Additionally, getComputedStyle returns null in iframes with display: "none" in Firefox,
    // but Firefox is known to support CSS custom properties correctly.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    const computedStyle = window.getComputedStyle(node);
    const hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';
    node.remove();
    return hasPseudoVarBug;
}

type Event = TouchEvent<{}> | MouseEvent<{}>;
function getNormalizedEventCoords(event: Event, pageOffset: { x: number, y: number }, clientRect: ClientRect) {
    const {x, y} = pageOffset;
    const documentX = x + clientRect.left;
    const documentY = y + clientRect.top;

    let normalizedX;
    let normalizedY;

    // Determine touch point relative to the ripple container.
    if (isTouchEvent(event)) {
        normalizedX = event.changedTouches[0].pageX - documentX;
        normalizedY = event.changedTouches[0].pageY - documentY;
    } else {
        normalizedX = event.pageX - documentX;
        normalizedY = event.pageY - documentY;
    }

    return {x: normalizedX, y: normalizedY};
}

function isTouchEvent(event: TouchEvent<{}> | MouseEvent<{}>): event is TouchEvent<{}> {
    return event.type === 'touchstart';
}

export { supportsCssVariables, getNormalizedEventCoords };