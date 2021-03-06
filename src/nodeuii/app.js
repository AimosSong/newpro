import Koa from 'koa';
import config from './config'
import controllerInit from './controllers/controllerInit'
import router from 'koa-simple-router'
import render from 'koa-swig'
import serve from 'koa-static'
import co from 'co'
import log4js from 'log4js'
import errorHandler from './middlewares/errorHandler'
const app = new Koa();
app.context.render = co.wrap(render({
    // ...your setting 
    root: config.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false 
    ext: 'html',
    varControls:["[[","]]"],
    writeBody: false
}));
log4js.configure({
    appenders: { cheese: { type: 'file', filename: './logs/error.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');
errorHandler.error(app,logger);
//初始化所有的路由
controllerInit.getAllrouters(app,router);
app.use(serve(config.staticDir));
app.listen(config.port,()=>{
    console.log(`listening on ${config.port}`);
});

module.exports = app;