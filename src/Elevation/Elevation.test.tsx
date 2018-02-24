import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import toJson from 'enzyme-to-json';
import { Elevation, ElevationProps } from './Elevation';
import { ELEVATION, ELEVATION_TRANSITION } from './constants';

describe('Elevation', () => {
    configure({adapter: new Adapter()});

    const setUp = (props: ElevationProps, content: React.ReactNode = 'Elevation Content') => {
        return shallow(<Elevation {...props}>{content}</Elevation>);
    };

    test('It should have mdc classes', () => {
        const wrapper = setUp({z: 2});
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('It should set elevation', () => {
        const wrapper = setUp({z: 10});
        expect(wrapper.hasClass(`${ELEVATION}${10}`)).toBeTruthy();
    });

    test('It should not add elevation transition class', () => {
        const wrapper = setUp({z: 10, transition: false});
        expect(wrapper.hasClass(ELEVATION_TRANSITION)).toBeFalsy();
    });

    test('It should add elevation transition class', () => {
        const wrapper = setUp({z: 10, transition: true});
        expect(wrapper.hasClass(ELEVATION_TRANSITION)).toBeTruthy();
    });

    test('It should add extra class to the root element', () => {
        const extraClass = 'Extra Class';
        const wrapper = setUp({z: 10, className: extraClass});
        expect(wrapper.hasClass(extraClass)).toBeTruthy();
    });
});
