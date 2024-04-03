getSelectionStatement = function (options) {
    return options.measures
        .map(m => {
                if(m.attrName.attrName==="lat_long"){
                    return `latitude, longitude`
                }
                return `${m.aggregationType}(${m.attrName.attrName}) as ${m.attrName.attrName}`;
            })
        .join(',');
  };
  
getFilterQuery = function (options) {
    return !!options.filters
    ? options.filters.reduce((q, filter, i) => {
        console.log(`q: ${q}`);
        if (q === '') {
            return `where ${getFilterComparisonStatement(filter)} and`;
        } 
        if (i === options.filters.length-1){
            return `${q} ${getFilterComparisonStatement(filter)}`;
        }
        else {
            return `${q} ${getFilterComparisonStatement(filter)} or `;
        }
    }, '')
    : '';
};
  
getFilterComparisonStatement = function (filter) {
    switch (filter.comparison) {
    case "=":
        return `${filter.targetAttribute}='${filter.targetValue}'`.toString();
    case "between":
        return `${filter.targetAttribute} between ${formatFilterValue(filter, 0)} and ${formatFilterValue(filter, 1)}`.toString();
    default:
        console.log(`Unrecognized filter comparison : ${filter.comparison}`);
        return '1=1';
    }
};
  
formatFilterValue = function (filter, index) {
switch (filter.type) {
    case "datetime":
        return `('${filter.targetValue[index]}')`.toString();
    case "number":
        return isNaN(index) ? filter.targetValue : filter.targetValue[index];
    default:
        console.log(`Trying to format unhandled filter type: ${filter.type}`);
        return filter.targetValue;
    }
}
  
module.exports = {
    getPurchaseDeedQuery: function (options){
        return `select * from purchase_deed`
    },

    getQuery: function (options) {
        const measureSelectionQuery = getSelectionStatement(options);
        const filterQuery = getFilterQuery(options);
        const dimension=options.dimension[0].attrName;
    
        console.log(`filterQuery : ${filterQuery}`);
        console.log(measureSelectionQuery);
        //TO-DO: update dimensions to select them by their datatype 'datetime'
        if(dimension==="EVENT_CREATED_AT"||dimension==="EVENT_UPDATED_AT"){
            return `Select
            TO_DATE(${dimension}) ${dimension},${measureSelectionQuery} from ${options.entity}_view group by  TO_DATE(${dimension})`;
        }
        if(measureSelectionQuery==='latitude, longitude'){
            return `Select
            ${options.dimension[0].attrName} text,${measureSelectionQuery} from ${options.entity}_view ${filterQuery} group by ${options.dimension[0].attrName}, ${measureSelectionQuery} `;
        }
    
        return `Select
            ${options.dimension[0].attrName},${measureSelectionQuery} from ${options.entity}_view group by ${options.dimension[0].attrName} `;
    },
  
    getDashboardWidgetMetadataQuery: function(options){
        const title=options.title;
        return `select title,chartId, savedcharts.metadata from 
        (SELECT title ,
        SUBSTRING_INDEX(SUBSTRING_INDEX(metadata, ',', n.digit+1), ',', -1) as chartId 
        FROM saveddashboards INNER JOIN
        (SELECT id as digit from dummytable) as n
        ON LENGTH(REPLACE(metadata, ',' , '')) <= LENGTH(metadata)-n.digit ORDER BY id, n.digit) as dashboard 
        inner join savedcharts on
        chartId=savedcharts.name where title='${title}' `;
    },
  
    saveChartQuery: function(options){
        const name=options.name;
        const selectedMetadata=options.selectedMetadata;
        return `insert into savedcharts (name, metadata) values ('${name}', '${selectedMetadata}')`;
    },
  
    saveDashboardQuery: function(options){
        const title=options.title;
        const metadata=options.metadata;
        return `insert into savedDashboards (title, metadata) values ('${title}','${metadata}')`;
    }

};
  