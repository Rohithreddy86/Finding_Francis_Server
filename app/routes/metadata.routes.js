const asyncmiddleware = require('../services/utils/asyncmiddleware');
const metaDataController = require('../controllers/metadata.controller');

module.exports = app => {
  app.get('/getPurchaseDeedData',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      let result = await metaDataController.getPurchaseDeedData();
      console.log(result);
      res.json(result);
    })
  );

  app.get(
    '/metadata',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      let result = await metaDataController.getMetaData();
      res.json(result);
    })
  );

  app.post(
    '/getData',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      const entity = req.body.entity;
      const measures = req.body.measures;
      const dimension = req.body.dimension;
      const filters = req.body.filters;

      const options = {
        entity,
        measures,
        dimension,
        filters
      };
      const query = await metaDataController.getData(options);
      res.json(query);
    })
  );

  app.get(
    '/getBuyerNames',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      const query = await metaDataController.getBuyerNames();
      res.json(query);
    })
  );

  app.get(
    '/getSellerNames',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      const query = await metaDataController.getSellerNames();
      res.json(query);
    })
  );

  app.post(
    '/getDashboardWidgetMetadata',
    asyncmiddleware.handleAsync(async (req,res,next)=>{
      const title=req.body.title;
      const options={ title};
      const query= await metaDataController.getDashboardWidgetMetadata(options);
      res.json(query);
    })
  );

  app.post(
    '/saveDashboard',
    asyncmiddleware.handleAsync(async(req,res,next)=>{
      const title=req.body.title;
      const metadata=req.body.metadata;
      const options={
        title,
        metadata
      }
      const query= await metaDataController.saveDashboard(options);
      res.json(query);
    })
  );

  app.post(
    '/saveChartMetadata',
    asyncmiddleware.handleAsync(async(req,res,next)=>{
      const name=req.body.userName;
      const selectedMetadata=req.body.selectedMetadata;
      console.log(name,selectedMetadata);

      const options ={
        name,
        selectedMetadata
      };
      const query= await metaDataController.saveChartData(options);
      res.json(query);
    })

  );

  app.get(
    '/getFilterData',
    asyncmiddleware.handleAsync(async (req, res, next) => {
      const entityName = req.query.entityName;
      const filterName = req.query.filterName;
      const result = await metaDataController.getFilterData(entityName, filterName);
      const ret = !!result ? result : [];
      res.json(ret);
    })
  );
};
