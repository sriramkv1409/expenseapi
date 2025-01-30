var express = require('express');
const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');  //import uuid
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const app = express();

// Configure CORS to accept requests from any origin during development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json()) // middleware between request and response;

// Basic route to check if server is running
app.get('/', (req, res) => {
    res.json({ message: "Expense Tracker API is running" });
});

mongoose.connect('mongodb+srv://sriramkv1409:helloworld@cluster0.gbsuknc.mongodb.net/')
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error("Error connecting to database:", err));

const expenseSchema = new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true},
});

const Expense = mongoose.model("Expenses",expenseSchema);

app.get('/api/expenses',async(req,res)=>{
    try{
        const expenses = await Expense.find();
        console.log("Fetched expenses:", expenses);
        res.status(200).json(expenses);
    }catch(err){
        console.error("Error fetching expenses:", err);
        res.status(500).json({ message: "Error fetching expenses", error: err.message });
    }
})

app.get('/api/expenses/:id',async(req,res)=>{
    try{
        const{id} = req.params;
        const expense = await Expense.findOne({id});
        if(!expense){
            return res.status(404).json({message:"The id with the expense is not available"});
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
        const deleteExpenses = await Expense.findOneAndDelete(
            {id},
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});