module.exports ={
    metadata:[
        {
            entityName: 'purchase_deed',
            displayName: 'Purchase Deed',
            attributes:[
                {
                    attrName: 'buyer_name',
                    displayName: 'Buyer Name',
                    attrDataType: 'string',
                    attrType: 'dimension',
                    filterDataSource: {
                        dsType: 'sql',
                        ds: `select distinct buyer_name from purchase_deed_view;`
                    }
                },
                {
                    attrName: 'seller_name',
                    displayName: 'Seller Name',
                    attrDataType: 'string',
                    attrType: 'dimension',
                    filterDataSource: {
                        dsType: 'sql',
                        ds: `select concat(pd1.first_name, ' ', pd1.last_name), pd1.person_id from purchase_deed pd 
                        left join person_details pd1
                            on pd.seller_id = pd1.person_id;
                        `
                    }
                },
                {
                    attrName: 'lat_long',
                    displayName: 'Latitude and longitude',
                    attrDataType: 'string',
                    attrType: 'measure',
                },
                /* {
                    attrName: 'county',
                    displayName: 'County',
                    attrDataType: 'string',
                    attrType: 'measure',
                },
                {
                    attrName: 'state',
                    displayName: 'State',
                    attrDataType: 'string',
                    attrType: 'measure',
                }, */
                {
                    attrName: 'date',
                    displayName: 'Purchased Date',
                    attrDataType: 'datetime',
                    attrType: 'dimension'
                }
            ]
        }
    ]
}