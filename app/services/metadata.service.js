module.exports = {
  formatMetadata: function(metadata) {
    const entities = metadata.reduce((entity, rec) => {
      if (!!entity[rec.tableName]) {
        entity[rec.tableName].attributes.push({
          attrName: rec.columnName,
          attrType: rec.columnType
        });
        return entity;
      } else {
        entity[rec.tableName] = {
          entityName: rec.tableName,
          attributes: [
            {
              attrName: rec.columnName,
              attrType: rec.columnType
            }
          ]
        };
        return entity;
      }
    }, {});

    return Object.entries(entities).map(([entityName, entityDetails]) => ({
      entityName: entityName,
      attributes: entityDetails.attributes
    }));
  }
};
