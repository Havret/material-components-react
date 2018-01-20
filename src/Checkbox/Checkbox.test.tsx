import { configure, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import toJson from 'enzyme-to-json';

import { Checkbox } from './Checkbox';
import {
    ANIM_CHECKED_INDETERMINATE,
    ANIM_CHECKED_UNCHECKED,
    ANIM_INDETERMINATE_CHECKED,
    ANIM_INDETERMINATE_UNCHECKED,
    ANIM_UNCHECKED_CHECKED,
    ANIM_UNCHECKED_INDETERMINATE,
    DISABLED
} from './constants';

describe('Checkbox', () => {
    configure({adapter: new Adapter()});

    test('It should have mdc classes', () => {
        const wrapper = shallow(<Checkbox/>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    test('It should have disabled class', () => {
        const wrapper = shallow(<Checkbox disabled={true}/>);
        expect(wrapper.hasClass(DISABLED)).toBeTruthy();
    });

    test('It should add extra class to the root element', () => {
        const extraClass = 'extra-class';
        const wrapper = shallow(<Checkbox className={extraClass} />);
        expect(wrapper.hasClass(extraClass)).toBeTruthy();
    });

    test('It should be initialized without transition animation classes', () => {
        const wrapper = shallow(<Checkbox/>);

        expect(wrapper.hasClass(ANIM_CHECKED_INDETERMINATE)).toBeFalsy();
        expect(wrapper.hasClass(ANIM_CHECKED_UNCHECKED)).toBeFalsy();
        expect(wrapper.hasClass(ANIM_INDETERMINATE_CHECKED)).toBeFalsy();
        expect(wrapper.hasClass(ANIM_INDETERMINATE_UNCHECKED)).toBeFalsy();
        expect(wrapper.hasClass(ANIM_UNCHECKED_CHECKED)).toBeFalsy();
        expect(wrapper.hasClass(ANIM_UNCHECKED_INDETERMINATE)).toBeFalsy();
    });

    test('It should set transition animation class after state changed', () => {
        const wrapper = shallow(<Checkbox/>);
        wrapper.setProps({checked: true});
        expect(wrapper.hasClass(ANIM_UNCHECKED_CHECKED)).toBeTruthy();
    });

    test('It should reset transition animation class after transition ends', () => {
        // arrange
        jest.useFakeTimers();
        const wrapper = shallow(<Checkbox/>);
        wrapper.setProps({checked: true});

        // act
        wrapper.simulate('animationEnd');
        jest.runAllTimers();
        wrapper.update();

        // assert
        expect(wrapper.hasClass(ANIM_UNCHECKED_CHECKED)).toBeFalsy();
    });
});