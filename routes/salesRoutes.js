const express = require('express');
const router = express.Router();
const Sale = require("../models/Sale");
const Stock = require("../models/Stock");

const {isAttendant,isAdmin, isManager} = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/auth');

router.get('/salesform',authorizeRoles('sales attendant','admin'), async (req, res)=>{
  try {
    const items = await Stock.find({ quantity: { $gt: 0}});

    if(!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;
    const cartTotal = cart.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);
    res.render('addsales', {
      items,
      cart: req.session.cart,
      cartTotal
    });

  } catch (error) {
    res.status(500).send('server error');
    console.error('error', error.message);
  }
});

//Cart routes

router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  res.render('addsales', {
    items: [],
    cart,
    cartTotal
  });
});

router.post('/cart/add', async (req, res) => {
  const {
    itemId,
    quantity,
    unitprice,
    customername,
    customercontact,
    customeraddress,
    customerdistance,
    paymentmethod
  } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const item = await Stock.findById(itemId);

  if (!item) {
    return res.status(404).send("Item not found");
  }

  const total = Number(quantity) * Number(unitprice);

  req.session.cart.push({
    itemId,
    itemname: item.itemName,
    quantity: Number(quantity),
    unitprice: Number(unitprice),
    customername,
    customercontact,
    customeraddress,
    customerdistance,
    paymentmethod,
    total
  });

  res.redirect('/salesform');
});

router.post('/cart/checkout', async (req, res) => {
  try{

    const count = await Sale.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

  const cart = req.session.cart || [];

  if (cart.length === 0) {
    return res.redirect('/salesform');
  }

  const {
    customername,
    customercontact,
    customeraddress,
    customerdistance,
    paymentmethod
  } = req.body;

  let phone = customercontact;
  if (!phone.startsWith('+256')) {
    phone = '+256' + phone.replace(/^0/, '');
  }
  //Calculate grand total
  const grandTotal = cart.reduce((sum, item)=> {
   return sum + Number(item.total || 0); },0);

   const needsTransport = req.body.needsTransport;

    //Transport calculation
    let transportcost = 0;

    if (needsTransport === 'no') {
      transportcost = 0;
    } else {
     if (grandTotal >= 500000 && Number(customerdistance)<= 10){
      transportcost = 0;
     }else{
      transportcost = 30000;
     }
    }
     const finalTotal = grandTotal + transportcost

     console.log(req.body);

  
  
  //Number of different items
  const numberOfItems = cart.length;

  //Reduce stock for each item
  for (const item of cart) {

    const stockItem = await Stock.findById(item.itemId);

    if (!stockItem) {
      continue;
    }

    // check stock
    if (stockItem.quantity < item.quantity) {
      return res.send(`Not enough stock for ${stockItem.itemName}`);
    }

    //reduce stock
    stockItem.quantity -= item.quantity;
    await stockItem.save();
    }

    // save sale
    const newItem = await Sale.create({
      customername,
      customercontact: phone,
      customeraddress,
      customerdistance,
      paymentmethod,
      invoiceNumber,
      attendant: req.user._id,

      items: cart.map(item => ({
        itemname: item.itemId,
        quantity: item.quantity,
        unitprice: item.unitprice,
        total: item.total
      })),


      grandTotal: finalTotal,
      numberOfItems: cart.length,
      transportcost
    });

  // clear cart
  req.session.cart = [];

  res.redirect(`/sales/receipt/${newItem._id}`);

}catch(error){
  console.error(error);
  res.status(500).send('Checkout failed');
}
});

router.post("/direct-sale",authorizeRoles('sales attendant','admin'), async (req, res) => {
  try {
    const { itemId, quantity, unitprice, customername, customercontact, customerdistance, customeraddress } = req.body;

    let phone = customercontact;
    if(!phone.startWith('+256')) {
      phone = '+256' + phone.replace(/^0/, '');
    }

    const item = await Stock.findById(itemId);
    if (!item) return res.status(404).send("Item not found");
    if (item.quantity < quantity) {
      return res.status(400).send("not enough stock available");
    }
    
    //Deduct quantity sold from stock quantity and save the new quantity to the stock collection
    item.quantity -= quantity;
    await item.save();
     const totalcost = quantity*unitprice;

    //Record the sale
    let newItem = new Sale({
      itemname: itemId,
      quantity,
      unitprice,
      customername,
      customercontact: phone,
      attendant: req.user._id,
      customeraddress,
      customerdistance,
      hasTransport : req.body.hasTransport ? true : false,
      transportcost,
      finaltotal
    });

    console.log(newItem);
    await newItem.save();

    res.redirect(`/sales/receipt/${newItem._id}`);

  } catch (error) {
    const items = await Stock.find({ quantity: { $gt: 0}});

    res.render("addsales", { error: error.message,items });

    console.error(error)
  }
});

//Get sales from the db
router.get('/salesList',authorizeRoles('sales attendant','admin','store manager'), async(req, res) =>{
  try {
    const allSales = await Sale.find()
      .populate('items.itemname','itemName category')
      .populate('attendant','fullname')
      .sort({date:-1});
      
      const grossRevenue = allSales.reduce((sum, sale) => {
          return sum + Number(sale.grandTotal || 0);
        }, 0);

        const totalSales = grossRevenue;

        // TODAY RANGE
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);

        const endOfDay = new Date();
        endOfDay.setHours(23,59,59,999);

        const todaySales = await Sale.find({
          date: { $gte: startOfDay, $lte: endOfDay }
        });

        const todayTotal = todaySales.reduce((sum, sale) => {
          return sum + Number(sale.grandTotal || 0);},0);

       res.render('sales-list',{sales: allSales, grossRevenue, totalSales, todaySales, todayTotal, user: req.user});


  } catch (error) {
    console.error(error)
    res.status(400).send('Unable to pick sales from the db')
  }
});

//Update sale
router.get('/sale/edit/:id',authorizeRoles("sales attendant", "admin"), async(req,res) =>{
  try {
    const sale = await Sale.findById(req.params.id)
    if(!sale) return res.status(404).send('Sale not found')
      res.render('sale_edit',{sale})
  } catch (error) {
      console.log(error)
      res.status(400).send('Unable to find sale in the Db')
  }
});
router.post('/sale/edit/:id',authorizeRoles("sales attendant", "admin"), async(req,res) => {
  try {
    const {quantity, unitprice, customername, customercontact} = req.body;
    const total = quantity*unitprice;
  
    await Sale.findByIdAndUpdate(req.params.id,{
      customername, 
      customercontact,

      $set : {
        'items.0.quantity': quantity,
        'items.0.unitprice': unitprice,
        'items.0.total': total,
        grandTotal: total
      }
    });

    res.redirect('/salesList');

  } catch (error) {
    console.error(error.message)
    const sale = await Sale.findById(req.params.id)
     res.render('sale_edit', { sale });
  } 
});

//Delete route
router.post('/delete/:id',authorizeRoles("sales attendant", "admin"), async(req,res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.redirect('/salesList')
  } catch (error) {
    console.error(error)
  }
});

//View and print receipt
router.get('/sales/receipt/:id', async (req,res) => {
  try {
    const sale = await Sale.findById(req.params.id)
    .populate('items.itemname','itemName category')
    .populate('attendant','fullname');

    const attendantName = sale.attendant ? sale.attendant.fullname : 'unkown';

    if(!sale) return res.status(404).send('Receipt not found')
    res.render('receipt', {sale, attendantName});

  } catch (error) {
    console.error(error)
     res.status(400).send('Unable to view receipt')
  }
});




module.exports = router;