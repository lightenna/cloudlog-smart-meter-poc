import React from 'react'
import utils from '../modules/Utils';
import {getCloud, getRegion, getService, getInstance, getStatus} from '../modules/DocFormat';
import moment from 'moment';
import './ListViewDoc.scss';

const debug = true;

class ListViewDoc extends React.Component {

    render() {
        if (debug && false) console.log('doc', this.props.doc, 'view', this.props.view);
        const doc = this.props.doc;
        const timestamp = utils.getDocDate(doc);
        const date = moment(timestamp).format('YYYY-MM-DD');
        const time = moment(timestamp).format('HH:mm:ss.SSS');
        if (!doc.body) return <p>Unparsed doc body</p>;
        return (
            <li className="document listviewdoc">
                {this.props.view.show_date && <span className="docelem date">{date}</span>}
                {this.props.view.show_time && <span className="docelem time">{time}</span>}
                {this.props.view.show_cloud && <span className="docelem cloud">{getCloud(doc)}</span>}
                {this.props.view.show_region && <span className="docelem region">{getRegion(doc)}</span>}
                {this.props.view.show_service && <span className="docelem service">{getService(doc)}</span>}
                {this.props.view.show_instance && <span className="docelem instance">{getInstance(doc)}</span>}
                {this.props.view.show_status && <span className="docelem status">{getStatus(doc)}</span>}
            </li>
        );
    }

}

export default ListViewDoc;