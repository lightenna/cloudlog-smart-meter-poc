import {MockedProvider} from 'react-apollo/test-utils';
import React from 'react';
import {mount, shallow} from '../enzyme_wrapper';
import wait from "waait";
import jquery from 'jquery';
import 'popper.js';
import ViewManager from './ViewManager';
import subscribeDocsMock from "../subscriptions/NewDocSubscription.mock";
import getViewsMock from "../queries/GetViews.mock";
import update from "immutability-helper";

const debug = true;
// fix vendor module references to jQuery
window.$ = window.jQuery = jquery;

describe('ViewManager component', () => {

    it('should render an empty context manager without error', () => {
        // shallow doesn't need a full wrapped component
        const wrapper = shallow(<ViewManager appconfig={{client: {}, service: {}}} creatorCloudId={"aws-661367319685"}/>);
        if (debug && false) console.log(wrapper.debug());
        wrapper.unmount();
    });

    it('should fetch empty list when creator not in DB', async () => {
        const wrapper = mount(
            <MockedProvider mocks={[getViewsMock, subscribeDocsMock]} addTypename={false} removeTypename>
                <ViewManager appconfig={{client: {}, service: {}}} creatorCloudId={"aws-661367319685"}
                             creatorUserId={"ZZZZ"}/>
            </MockedProvider>
        );
        // wait for async load
        await wait(0);
        wrapper.update();
        // test mounted wrapper
        if (debug && false) console.log(wrapper.debug());
        expect(wrapper.find('.context')).toHaveLength(0);
        wrapper.unmount();
    });

    it('should fetch a list of views from DB', async () => {
        let views_count = 0;
        const views_changed = jest.fn((views) => {
            if (debug && false) console.log('views_changed() called', views.length, views);
            views_count = (views[0] && views[0].subViews ? views[0].subViews.length : 0);
        });
        // deep mount required to fetch views and trigger change, but test flag set to Enzyme conflicts arising from loading views
        const wrapper = mount(
            <MockedProvider mocks={[getViewsMock, subscribeDocsMock]} addTypename={false} removeTypename>
                <ViewManager appconfig={{client: {}, service: {}}} creatorCloudId={"aws-661367319685"} creatorUserId={"1111"}
                             onViewsChanged={views_changed} testOnlyManager={true}/>
            </MockedProvider>
        );
        // wait for async load
        await wait(10);
        wrapper.update();
        // could test wrapper output, but fairly meaningless because pre-render even after update()
        if (debug && false) console.log(wrapper.debug());
        // check views_changed called twice
        expect(views_changed.mock.calls.length).toBeGreaterThan(1);
        // check that eventually we saw nested subViews
        expect(views_count).toBe(2);
        wrapper.unmount();
    });

    it('should properly handle a view change', async () => {
        const new_type = 'list';
        const initial_state = getViewsMock.result.data.getViews;
        const view = initial_state[0].subViews[0].subViews[0];
        expect(initial_state[0].subViews[0].subViews[0].type).not.toBe(new_type);
        const chain = ViewManager.calculateViewChangeChain(view, { 'type': new_type });
        const changed_state = update(initial_state, chain);
        expect(changed_state[0].subViews[0].subViews[0].type).toBe(new_type);
    });

});
