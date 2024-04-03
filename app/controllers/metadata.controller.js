const metadata = require('../sample-data/metadata_ca').metadata;
const fs = require('fs');
const path = require('path');
const postGresDbService = require('../services/postGresDBService');
const queryBuilder_ca = require('../services/utils/queryBuilder_ca');

module.exports = {
  getPurchaseDeedData: async function() {
    const query = queryBuilder_ca.getPurchaseDeedQuery();
    return postGresDbService.executeSQL(query.toString());
  },

  getMetaData: async function() {
    return metadata;
  },

  getData: async function(options) {
    const query = queryBuilder_ca.getQuery(options);
    console.log(query);
    return postGresDbService.executeSQL(query.toString());
  },

  getBuyerNames: async function() {
    const query = `select distinct buyer_name from purchase_deed_view;`;
    return postGresDbService.executeSQL(query.toString());
  },

  getSellerNames: async function() {
    const query = `select distinct seller_name from purchase_deed_view;`;
    return postGresDbService.executeSQL(query.toString());
  },

  getFilterData: async function(entityName, filterName) {
    let filterData = [];
    console.log(`getFilterData :: ${filterName} in ${entityName}`);
    const entity = metadata.find(e => e.entityName === entityName);
    const attribute = entity.attributes.find(
      a => a.attrName === filterName && !!a.filterDataSource
    );
    if (!!attribute) {
      const filterDataSource = attribute.filterDataSource;
      switch (filterDataSource.dsType) {
        case 'sql':
          const sql = filterDataSource.ds;
          console.log(`filter data sql : ${sql}`);
          filterData = snowflakeDbService.executeSQL(sql);
          break;
        case 'file':
          console.log(__dirname);
          const fileName = `../sample-data/${filterDataSource.ds}`;
          const filePath = path.resolve(__dirname, fileName);
          console.log(filePath);
          filterData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          break;
        default:
          console.log('Invalid dsType');
        // TODO: add case for api
      }
      return filterData;
    }
  }
};
