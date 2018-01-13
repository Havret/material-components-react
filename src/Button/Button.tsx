import * as cx from 'classnames';
import * as React from 'react';

import { BUTTON, BUTTON_COMPACT, BUTTON_DENSE, BUTTON_ICON, BUTTON_RAISED, BUTTON_STROKED, BUTTON_UNELEVATED } from './constants';

interface ButtonProps {
    className?: string;
    icon?: string;
    raised?: boolean;
    unelevated?: boolean;
    stroked?: boolean;
    dense?: boolean;
    compact?: boolean;
}

export class Button extends React.Component<ButtonProps, {}> {
    render() {
        const {
            children,
            className,
            icon,
            raised,
            unelevated,
            stroked,
            dense,
            compact
        } = this.props;

        const classNames = cx(BUTTON, {
            [BUTTON_RAISED]: raised,
            [BUTTON_UNELEVATED]: unelevated,
            [BUTTON_STROKED]: stroked,
            [BUTTON_DENSE]: dense,
            [BUTTON_COMPACT]: compact
        }, className);

        return (
            <button
                className={classNames}
            >
                {icon && <i className={cx('material-icons', BUTTON_ICON)}>{icon}</i> }
                {children}
            </button>
        );
    }
}
