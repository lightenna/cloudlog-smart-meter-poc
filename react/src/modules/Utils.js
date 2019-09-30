
export const parseDocBody = (doc) => {
    if (typeof doc.body === 'string' ) {
        doc.body = JSON.parse(doc.body);
    }
    // back-fill cloud, if not already set
    if (!doc.body.cloud) {
        doc.body.cloud = 'unknown';
        if (doc.body.source && doc.body.source.length > 0) {
            const dotpos = doc.body.source.indexOf('.');
            if (dotpos > 0) {
                doc.body.cloud = doc.body.source.substring(0, dotpos);
            } else {
                doc.body.cloud = doc.body.source;
            }
        }
    }
    return doc;
};

/**
 * horrible but lightweight way to generate a nearly unique ID
 * @returns {number}
 */
const getNuid = () => {
    const min = 0;
    const max = 999999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const getNowMillis = () => {
    return Date.now();
};

/**
 * Standardised way of getting a doc's timestamp (milliseconds since epoch)
 * @param doc
 * @returns {number}
 */
const getDocMillis = (doc) => {
    return doc.created / 1000;
};

/**
 * Standardised way of getting the date of a doc
 * @param doc
 * @returns {Date} JS date object for created ms-timestamp
 */
const getDocDate = (doc) => {
    return new Date(getDocMillis(doc));
};

/**
 * Standardised way of getting the difference between two times
 * @param s1
 * @param s2
 * @returns {number} Difference in milliseconds between s1 and s2
 */
const getDocDateDiff = (s1, s2) => {
    return getDocMillis(s2) - getDocMillis(s1);
};

/**
 * @param docs
 * @return {object} Stats on these documents
 */
const computeDocArrayStats = (docs) => {
    const output = {
        timestamp_youngest: 0,
        timestamp_oldest: 0,
        timestamp_diff: 0,
        timestamp_median: 0
    };
    if (docs.length >= 1) {
        output.timestamp_youngest = getDocMillis(docs[0]);
        output.timestamp_oldest = getDocMillis(docs[docs.length - 1]);
        output.timestamp_diff = output.timestamp_youngest - output.timestamp_oldest;
        output.timestamp_median = output.timestamp_youngest;
        if (output.timestamp_diff > 0) {
            output.timestamp_median = output.timestamp_youngest + Math.floor(output.timestamp_diff / 2);
        }
    }
    return output;
};

/**
 * @param timeframe in minutes
 * @param bucket_count round to the nearest future bucket
 * @return {object} Stats on these documents
 */
const computeNowStats = (timeframe, bucket_count) => {
    const output = {};
    output.timestamp_diff = parseFloat(timeframe) * 60 * 1000;
    const time_ms = getNowMillis();
    output.bucket_width = output.timestamp_diff / bucket_count;
    // align youngest to nearest bucket boundary in the future
    output.timestamp_youngest = Math.ceil(time_ms / output.bucket_width) * output.bucket_width;
    // finally compute oldest and youngest
    output.timestamp_oldest = output.timestamp_youngest - output.timestamp_diff;
    output.timestamp_median = output.timestamp_youngest + Math.floor(output.timestamp_diff / 2);
    return output;
};

const ucFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
    parseDocBody,
    getNuid,
    getNowMillis,
    getDocMillis,
    getDocDate,
    getDocDateDiff,
    computeDocArrayStats,
    computeNowStats,
    ucFirst
};
