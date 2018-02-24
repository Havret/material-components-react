import * as React from 'react';
import { HTMLProps, ReactNode } from 'react';

interface ElevationProps extends HTMLProps<HTMLInputElement> {
    /**
     * The content of the Elevation.
     */
    children?: ReactNode;
    /**
     * Addition CSS classes that will be added to the root element.
     */
    z: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
    /**
     * Allows for smooth transitions between elevations when the z value changes.
     */
    transition?: boolean;
}

class Elevation extends React.Component<ElevationProps, {}> {
    render() {
        const {className} = this.props;

        return (
            <div></div>
        );
    }
}

export { Elevation as default, Elevation };