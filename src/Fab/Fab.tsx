import * as cx from 'classnames';
import * as React from 'react';
import { ObjectOmit } from '../utils';
import { HTMLProps, MouseEventHandler } from 'react';
import { FAB, FAB_EXITED, FAB_ICON, FAB_MINI } from './constants';
import { MATERIAL_ICONS } from '../constants';
import { Ripple, RippleComponentProps } from '../Ripple';

interface FabProps extends ObjectOmit<HTMLProps<HTMLButtonElement>, 'disabled'> {
    /**
     * Addition CSS classes that will be added to the root element.
     */
    className?: string;
    /**
     * The name of the icon font ligature.
     */
    icon?: string;
    /**
     * If `true`, modifies the FAB to a smaller size.
     */
    mini?: boolean;
    /**
     * Animates the FAB out of view. When this class is removed, the FAB will return to view.
     */
    exited?: boolean;
    /**
     * If `true` adds a ripple effect to the component
     */
    ripple?: boolean;
    /**
     * Click event handler.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

class Fab extends React.Component<FabProps, {}> {
    static defaultProps = {
        mini: false,
        exited: false,
        ripple: true
    };

    render() {
        return this.props.ripple
            ? <Ripple surface={false} render={this.renderFab}/>
            : this.renderFab();
    }

    private renderFab = (rippleProps: Partial<RippleComponentProps> = {}) => {
        const {className: rippleClass, ...rippleRest} = rippleProps;

        const {icon, mini, exited, className, ripple, ...rest} = this.props;

        const classNames = cx(FAB, MATERIAL_ICONS, rippleClass, {
            [FAB_MINI]: mini,
            [FAB_EXITED]: exited
        }, className);

        return (
            <button {...rest} {...rippleRest} className={classNames}>
                {icon && <span className={FAB_ICON}>{icon}</span>}
            </button>
        );
    };
}

export { Fab as default, Fab, FabProps };