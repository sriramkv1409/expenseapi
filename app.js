var express = require('express');
const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');  //import uuid
const cors = require('cors')
const app = express();
app.use(express.json()) // middleware between request and response;
app.use(cors())


try{
mongoose.connect('mongodb+srv://sriramkv1409:sriramkv2005@cluster0.gbsuknc.mongodb.net/expensetracker').then(()=>{
    console.log('connected to database');
})
}
catch(err){
    console.log("erefsfsdf ")
}

const expenseSchema = new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true},
});

const Expense = mongoose.model("Expenses",expenseSchema);

app.get('/api/expenses',async(req,res)=>{
    try{
    const expenses =await Expense.find();
    console.log(expenses);
    res.status(200).json(expenses);
    res.end();
    }catch(err){
    console.log(err);
    }
})

app.get('/api/expenses/:id',async(req,res)=>{
    try{
        const{id} = req.params;
        const expense = await Expense.findOne({id});
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json(expense);
    }
    catch(err){
        res.status(500).json({message:"Error in fetching data"});
    }
})

app.post("/api/expenses",async(req,res)=>{
const {title,amount} = req.body
const newExpense = new Expense({
    id:uuidv4(),
    title:title, // similar to title,
    amount:amount,
});
const savedExpense = await newExpense.save();
res.status(200).json(savedExpense);
res.end();
})

app.put('/api/expenses/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,amount} = req.body;
    
        const updateExpense = await Expense.findOneAndUpdate(
            {id},
            {title,amount},
        )
        if(!updateExpense){
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json(updateExpense);
    }
    catch(err){
        return res.status(500).json({message:"Error in fetching data"});
    }
})

app.delete('/api/expenses/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,amount} = req.body;
        const deleteExpenses = await Expense.findOneAndDelete(
            {id},
            {title,amount},
        )
        if(!deleteExpenses){
            return res.status(404).json({message:"Data not found"});
        }
        else{
            return res.status(200).json({message:"Data is deleted"});
        }
    }
    catch(err){
        return res.status(500).json(err);
    }
})


app.listen(3001,()=>{
    console.log("The server is running in port 3001");
})