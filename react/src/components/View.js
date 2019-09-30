import React from 'react';
import ReactGA from 'react-ga';
import ViewTypeSelector from './ViewTypeSelector';
import GenericLazyLoad from './GenericLazyLoad';
import ListView from './ListView';
// import InstanceView from './InstanceView';
// lazy load complex views
const InstanceView = React.lazy(() => import('./InstanceView'));
// import InstanceCostView from './InstanceCostView';
// lazy load complex views
const InstanceCostView = React.lazy(() => import('./InstanceCostView'));
// import TimelineView from './TimelineView';
// lazy load complex views
const TimelineView = React.lazy(() => import('./TimelineView'));

class View extends React.Component {

    constructor(props) {
        super(props);
        this.handleTypeChange = this.handleTypeChange.bind(this);
    }

    specialise(type, docs, buttons) {
        let output = '';
        switch (this.props.type) {
            case 'container' :
                break;
            case 'instance' :
            case 'map' :
                // eventually we'll build a map view
                //   output = <MapViewDocs docs={docs}/>;
                // but start with instance view
                const inst = <InstanceView seq={this.props.seq} docs={docs} sharedButtons={buttons}/>;
                output = <GenericLazyLoad target={inst} detectIfLazy={InstanceView}/>;
                break;
            case 'instancecost' :
                const instcost = <InstanceCostView seq={this.props.seq} docs={docs} sharedButtons={buttons}/>;
                output = <GenericLazyLoad target={instcost} detectIfLazy={InstanceCostView}/>;
                break;
            case 'timeline' :
                const timlin = <TimelineView seq={this.props.seq} docs={docs} sharedButtons={buttons}/>;
                output = <GenericLazyLoad target={timlin} detectIfLazy={TimelineView}/>;
                break;
            default :
            case 'list' :
                output = <ListView seq={this.props.seq} docs={docs} sharedButtons={buttons}/>;
                break;
        }
        return output;
    }

    handleTypeChange(type) {
        // escalate change to state-holder
        this.props.onViewChange(this.props, 'type', type);
        ReactGA.event({
            category: 'view',
            action: 'type change',
            label: type
        });
    }

    render_subviews() {
        const docs = this.props.docs || [];
        const sub_views = this.props.subViews || [];
        const inheritted_class = (typeof this.props.inherittedClass !== 'undefined' ? this.props.inherittedClass : '');
        const subviewflow = " subviews-" + (this.props.svSplit ? this.props.svSplit : 'horizontal');
        if (sub_views.length === 0) {
            return null;
        }
        return <div className={"subviews row" + inheritted_class}> {/* sub views */}
            {
                [].concat(sub_views).map((c, index, clist) =>
                    <View key={index} {...c}
                          onViewChange={this.props.onViewChange}
                          inherittedClass={subviewflow}
                          docs={docs}/>)
            }
        </div>
    }

    render_buttons() {
        return [
            <ViewTypeSelector key={this.props.seq || 0} seq={this.props.seq || 'notset'} type={this.props.type} onChange={this.handleTypeChange}/>
        ];
    }

    render() {
        const docs = this.props.docs || [];
        const type = " view-" + this.props.type;
        const width = (typeof this.props.viewport !== 'undefined' ? this.props.viewport.width : '100%');
        const height = (typeof this.props.viewport !== 'undefined' ? this.props.viewport.height : '100%');
        const buttons = this.render_buttons();
        // show ID only if set
        const id = this.props.id || (this.props.seq && ('seq-'+this.props.seq));
        // specialise docs by view type
        const content = this.specialise(this.props.type, docs, buttons);
        return (
            <div className={"view container-fluid" + type} id={id} style={{"width": width, "height": height}}
                 data-userid={this.props.creatorUserId}>
                {content}
                {this.render_subviews()}
            </div>
        );
    }
}

export default View;