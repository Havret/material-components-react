import { configure, shallow, mount } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import toJson from 'enzyme-to-json';

import { cssClasses as rippleCssClasses } from '../Ripple/constants';
import { Fab } from './Fab';
import { FAB, FAB_EXITED, FAB_MINI } from './constants';

describe('Fab', () => {
    configure({adapter: new Adapter()});

    test('It should have mdc classes - Ripple Disabled', () => {
        const wrapper = shallow(<Fab ripple={false}/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('It should have mdc classes - Ripple Enabled', () => {
        const wrapper = mount(<Fab/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('It should add extra class to the root element', () => {
        const extraClass = 'extra-class';
        const wrapper = shallow(<Fab className={extraClass} ripple={false}/>);
        expect(wrapper.hasClass(extraClass)).toBeTruthy();
    });

    test('It should not be mini', () => {
        const wrapper = shallow(<Fab ripple={false}/>);
        expect(wrapper.hasClass(FAB_MINI)).toBeFalsy();
    });

    test('It should be mini', () => {
        const wrapper = shallow(<Fab ripple={false} mini={true}/>);
        expect(wrapper.hasClass(FAB_MINI)).toBeTruthy();
    });

    test('It should not be exited', () => {
        const wrapper = shallow(<Fab ripple={false} />);
        expect(wrapper.hasClass(FAB_EXITED)).toBeFalsy();
    });

    test('It should be exited', () => {
        const wrapper = shallow(<Fab ripple={false} exited={true} />);
        expect(wrapper.hasClass(FAB_EXITED)).toBeTruthy();
    });

    test('It should be ripple upgraded when when ripple enabled', () => {
        const wrapper = mount(<Fab ripple={true}/>);
        expect(wrapper.find(`.${FAB}`).hasClass(rippleCssClasses.ROOT)).toBeTruthy();
    });
});