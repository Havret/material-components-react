import * as cx from 'classnames';
import * as React from 'react';
import { MouseEventHandler, ReactNode } from 'react';

import {
    BUTTON,
    BUTTON_COMPACT,
    BUTTON_DENSE,
    BUTTON_ICON,
    BUTTON_RAISED,
    BUTTON_STROKED,
    BUTTON_UNELEVATED,
} from './constants';

interface ButtonProps {
    /**
     * The content of the button.
     */
    children?: ReactNode;
    /**
     * Addition CSS classes that will be added to the root element.
     */
    className?: string;
    /**
     * The name of the icon font ligature.
     */
    icon?: string;
    /**
     * If `true` the button is elevated upon the surface.
     */
    raised?: boolean;
    /**
     * If `true` the button is flushed with the surface.
     */
    unelevated?: boolean;
    /**
     * If `true` the button is flushed with the surface and has a visible border.
     */
    stroked?: boolean;
    /**
     * If `true`, compresses the button text to make it slightly smaller.
     */
    dense?: boolean;
    /**
     * If `true`, reduces the amount of horizontal padding in the button.
     */
    compact?: boolean;
    /**
     * If `true`, the button will be disabled.
     */
    disabled?: boolean;
    /**
     * Click event handler.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

class Button extends React.Component<ButtonProps, {}> {
    static defaultProps = {
        raised: false,
        unelevated: false,
        stroked: false,
        dense: false,
        compact: false,
        disabled: false,
    };

    render() {
        const {
            children,
            className,
            icon,
            raised,
            unelevated,
            stroked,
            dense,
            compact,
            disabled,
            onClick,
        } = this.props;

        const classNames = cx(BUTTON, className, {
            [BUTTON_RAISED]: raised,
            [BUTTON_UNELEVATED]: unelevated,
            [BUTTON_STROKED]: stroked,
            [BUTTON_DENSE]: dense,
            [BUTTON_COMPACT]: compact
        });

        return (
            <button
                className={classNames}
                disabled={disabled}
                onClick={onClick}
            >
                {icon && <i className={cx('material-icons', BUTTON_ICON)}>{icon}</i>}
                {children}
            </button>
        );
    }
}

export { Button as default, Button, ButtonProps };