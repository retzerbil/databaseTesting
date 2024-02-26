const express = require('express');
const {check} = require('express-validator');
const cors = require('cors');
const {Product} = require('./models');
const {Op} = require('sequelize')
const migrationhelper = require('./migrationhelper');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5500",
    credentials:true
}))

app.get('/products', check('q').escape(),async(req,res)=>{
    const sortCol = req.query.sortCol || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
    const q = req.query.q || '';

    const offset = Number(req.query.offset || 0);
    //const pageSize = req.query.pageSize || '20';
    const limit = Number(req.query.limit || 20);

    const allProducts = await Product.findAll({
        where:{
            name:{
                [Op.like]: '%' + q + '%'
            }
        },
        order:[
            [sortCol,sortOrder]
        ],
        offset:offset,
        limit:limit
    });
    const result = allProducts.map(p=>{
        return{
            id:p.id,
            name:p.name,
            unitPrice:p.unitPrice,
            stockLevel:p.stockLevel
        }
    })
    return res.json(result);
})

app.listen(port, async () =>{
    await migrationhelper.migrate();
    console.log(`Example app listening on port ${port}`);
})