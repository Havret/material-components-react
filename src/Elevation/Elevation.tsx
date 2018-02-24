import * as cx from 'classnames';
import * as React from 'react';
import { ReactNode } from 'react';
import { ELEVATION, ELEVATION_TRANSITION } from './constants';

interface ElevationProps {
    /**
     * Addition CSS classes that will be added to the root element.
     */
    className?: string;
    /**
     * The content of the Elevation.
     */
    children?: ReactNode;
    /**
     *    Sets the elevation to the (N)dp, where 0 <= N <= 24.
     */
    z: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
    /**
     *    Applies the correct css rules to transition an element between elevations.
     */
    transition?: boolean;
}

class Elevation extends React.Component<ElevationProps, {}> {
    render() {
        const {className, children, transition, z, ...rest} = this.props;
        const classNames = cx(`${ELEVATION}${z}`, {[ELEVATION_TRANSITION]: transition}, className);

        return (<div {...rest} className={classNames}>{children}</div>);
    }
}

export { Elevation as default, Elevation, ElevationProps };