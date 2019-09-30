import React from 'react'

class DocManagerButtons extends React.Component {

    constructor(props) {
        super(props);
        this.handleClearCache = this.handleClearCache.bind(this);
        this.handleFetchOlder = this.handleFetchOlder.bind(this);
    }

    handleFetchOlder(e) {
        if (this.props.onFetchOlder) {
            this.props.onFetchOlder();
        }
    }

    handleClearCache(e) {
        if (this.props.onClearCache) {
            this.props.onClearCache();
        }
    }

    render() {
        return [
            <button key={1} className={"btn btn-outline-secondary"} type="button" id="btnFetchOlder"
                    onClick={this.handleFetchOlder}>Fetch older</button>,
            <button key={2} className={"btn btn-outline-secondary"} type="button"
                    onClick={this.handleClearCache}>Clear cache</button>
        ]
    }
}

export default DocManagerButtons;