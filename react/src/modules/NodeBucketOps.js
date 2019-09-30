import utils from '../modules/Utils'

const debug = true;

const getAnalysisStats = (view, doc_stats) => {
    let analysis_stats = {};
    // use timeframe to decide analysis stats
    switch (view.timeframe) {
        case 'all' :
            // analyse all the data that's available
            analysis_stats = doc_stats;
            analysis_stats.bucket_width = analysis_stats.timestamp_diff / view.bucket_count;
            break;
        default: // timeframe in minutes, e.g. '0.5','3','12','60' etc.
            // analyse current time back to <timeframe> ago
            analysis_stats = utils.computeNowStats(view.timeframe, view.bucket_count);
            break;
    }
    return analysis_stats;
};

const in_range = (doc, stats) => {
    const t = utils.getDocMillis(doc);
    const tiny_t = 0.0001; // 1/10th of a microsecond
    // ignore docs that are younger (further from the epoch) than the youngest
    if (t > (stats.timestamp_youngest + tiny_t)) return false;
    // ignore docs that are older (closer to the epoch) than the oldest
    if (t < (stats.timestamp_oldest - tiny_t)) return false;
    // if within range, return true
    return true;
};

/**
 * Parse list of documents to build view
 * @param docs ordered list of documents
 * @param view
 * @returns {}
 */
const parseDocs = (docs, view) => {
    const output = {
        docs: docs,
        view: view,
        bucketted_docs: [],
        stats: {}
    };
    // create buckets
    for (let i = 0 ; i < view.bucket_count ; ++i) {
        output.bucketted_docs[i] = [];
    }
    // work out oldest and youngest doc
    const doc_stats = utils.computeDocArrayStats(docs);
    doc_stats.bucket_width = doc_stats.timestamp_diff / view.bucket_count;
    // work out which stats we should use for this analysis
    const analysis_stats = getAnalysisStats(view, doc_stats);
    // put docs into buckets
    for (let i = 0; i < docs.length; ++i) {
        const doc = docs[i];
        if (!doc) continue;
        // fallback in case we discover an unparsed doc body
        if (typeof doc.body !== 'object') {
            utils.parseDocBody(doc);
        }
        if (!doc.body) continue;
        // test to see if this document falls within the analysis range
        if (view.timeframe === 'all' || in_range(doc, analysis_stats)) {
            // calculate difference between this doc and the youngest
            const offset = utils.getDocMillis(doc) - analysis_stats.timestamp_oldest;
            // use integer division to calculate the appropriate bucket
            let bucket_number = Math.floor(offset / analysis_stats.bucket_width);
            // catch case where oldest doc wants to go in its own bucket; catch misordering near youngest
            if (bucket_number >= view.bucket_count) {
                bucket_number = view.bucket_count - 1;
            }
            // catch misordering near oldest
            if (bucket_number < 0) {
                bucket_number = 0;
            }
            // add this document to that bucket
            output.bucketted_docs[bucket_number].push(doc);
        }
    }
    output.stats = analysis_stats;
    if (debug && false) console.log('parseDocsToNodeTree returned', output);
    return output;
};

export default {
    parseDocs
};
