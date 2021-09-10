const Cart = require('../models/cart.model');

// Add product to the cart
const addToCart = async (req, res) => {
    if (req.body) {
        const cart = new Cart({
            _id:req.body.id,
            title:req.body.title,
            qty:req.body.qty,
            size:req.body.size,
            price:req.body.price,
            discount:req.body.discount
        });
        try {
            const newCartItem = await cart.save();
            console.log(newCartItem)
            res.status(200).json(newCartItem);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
}

// Update cart quantity
const updateProductQty = async (req, res) => {
    if (req.params.id && req.body.qty) {

        const cartItem =await Cart.findById(req.params.id);
        cartItem.qty = req.body.qty;
        try {

            const updatedCartItem = await cartItem.save();
            res.status(200).json(updatedCartItem);

        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
}


// Remove from from cart

const removeFromCart = async (req, res) => {
    if (req.params.id) {
        const cartItem = Cart.findById(req.params.id);
        try {
            const removedCartItem = await cartItem.remove();
            res.status(200).json(removedCartItem);
        } catch (err) {
            res.status(400).json({message: err.message});
        }
    }
}

// Get all cart products

const getAllFromCart = async (req, res) => {
    try {
        const cartItems = await Cart.find({});

        res.status(200).json(cartItems);

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

const getCartItemByID=async(req,res)=>{
    if(req.params.id){
        try{
       const cartItem=await Cart.findById(req.params.id);
        res.status(200).json(cartItem);
        }catch (err){
            res.status(500).json({message: err.message});
        }
    }
}

//get total price of the items in the cart
const getTotalPrice = async (req, res) => {
    try {
        const cartItems = await Cart.find({});
        let total=0;
       if(cartItems.length>0){
           cartItems.map(item=>{
               total=total+(item.price*item.qty);
           })

       }
        res.status(200).json({total:total})

    } catch (err) {
        res.status(500).json({message: err.message});
    }
}



module.exports = {
    addToCart,
    updateProductQty,
    removeFromCart,
    getAllFromCart,
    getCartItemByID,
    getTotalPrice
}