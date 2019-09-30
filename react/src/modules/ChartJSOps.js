import moment from 'moment';
import pattern from 'patternomaly';
// const debug = false;

const convertBucketsToChartDatasets = (buckets, stats) => {
    const data = [];
    const labels = [];
    const metadata = [];
    const format_string_date = 'Do MMMM YYYY';
    const format_string_time = 'HH:mm:ss';
    let last_date = '';
    buckets.forEach((bucket, index) => {
        const md = {};
        // don't compute the stats just for this bucket, because can't cope with empty buckets
        // const stats = utils.computeDocArrayStats(bucket);
        // push data points (bucket) and label
        data.push(bucket.length);
        // work out upper boundaries using bucket_width and zero-based index
        md.timestamp_oldest = stats.timestamp_oldest + index * stats.bucket_width;
        md.timestamp_median = md.timestamp_oldest + stats.bucket_width / 2;
        md.timestamp_youngest = md.timestamp_oldest + stats.bucket_width;
        md.date_oldest = moment(md.timestamp_oldest).format(format_string_date);
        md.date_median = moment(md.timestamp_median).format(format_string_date);
        md.date_youngest = moment(md.timestamp_youngest).format(format_string_date);
        md.time_oldest = moment(md.timestamp_oldest).format(format_string_time);
        md.time_median = moment(md.timestamp_median).format(format_string_time);
        md.time_youngest = moment(md.timestamp_youngest).format(format_string_time);
        // create a label
        let label = md.time_median;
        // show the date if it's different from the last bucket's date
        const date = md.date_median;
        // ...but never show for the first bucket
        if (index === 0) {
            last_date = date;
        }
        if (date !== last_date) {
            last_date = date;
            label = date + ', ' + label;
        }
        labels.push(label);
        metadata.push(md);
    });
    // return single dataset for now
    return {
        datasets: [
            {
                label: "Total",
                data: data
            }
        ],
        labels: labels,
        metadata: metadata
    };
};

const emptyChartDataset = () => {
    return {
        datasets: [
            {
                label: "Empty chart",
                data: [0.01],
                backgroundColor: ['#CCCCCC']
            }
        ],
        labels: ['No data'],
        metadata: {
            "costrate": 0
        }
    };
};

const convertNodeTreeToChartDatasets = (tree, by) => {
    const source = Object.keys(tree[by]).sort();
    const data = [];
    const labels = [];
    // loop through object keys in sorted [alphabetical] order
    for (const elem_ref in source) {
        const elem_id = source[elem_ref];
        const cr = parseFloat(tree[by][elem_id].costrate).toPrecision(3);
        data.push(cr);
        labels.push(elem_id);
    }
    // catch empty dataset and return a renderable chart
    if (tree.costrate === 0) {
        return emptyChartDataset();
    }
    // create fade for first (main) chart colour
    let ctx = document.createElement('canvas').getContext('2d');
    // var ctx = document.getElementById('canvas').getContext('2d');
    const radius = Math.min(ctx.canvas.width, ctx.canvas.height);
    let fillGradient = ctx.createLinearGradient(radius * 0.4, radius * 0.4, radius * 1.8, radius * 1.8);
    fillGradient.addColorStop(0, "#a1c4fd");
    fillGradient.addColorStop(1, "#c2e9fb");
    return {
        datasets: [
            {
                label: "Unused label",
                data: data,
                backgroundColor: [
                    fillGradient,
                    pattern.draw('circle', '#005b96'),
                    pattern.draw('zigzag-horizontal', '#b3cde0'),
                    pattern.draw('zigzag-vertical', '#011f4b'),
                    pattern.draw('line', '#03396c'),
                    pattern.draw('diamond', '#6497b1'),
                ]
            }
        ],
        labels: labels,
        metadata: {
            "costrate": tree.costrate
        }
    };
};

export default {
    convertBucketsToChartDatasets,
    convertNodeTreeToChartDatasets
};
