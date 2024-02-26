const express = require('express');
const {check} = require('express-validator');
const cors = require('cors');
const {Product} = require('./models');
const migrationhelper = require('./migrationhelper');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5500",
    credentials:true
}))

app.get('/products',async(req,res)=>{
    const sortCol = req.query.sortCol || 'name';
    const sortOrder = req.query.sortOrder || 'asc';

    const allProducts = await Product.findAll({
        order:[
            [sortCol,sortOrder]
        ]
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