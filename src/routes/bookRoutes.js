
import express from "express";
import BookSchema from "../model/bookSchema.js";
import authentication from "../middleware/auth.js";

const router = express.Router();


router.post("/addBook",authentication, async(req, res)=>{

    try {
        let { title,author,description,quantity,isAvailable,publisher,pages,language,newPrice,oldPrice,coverPic} = req.body;

        let bookDetails = await BookSchema.create({
            title,
            author,
            description,
            publisher,
            pages,
            language,
            newPrice,
            oldPrice,
            quantity,
            isAvailable,
            coverPic,
        });

        if(!bookDetails){
            return res.status(400).json({message : "failed to add book", success : false})
        }

        res.status(201).json({message : "Book Added Successfully", success : true});
    } catch (error) {
        console.log("some issue in adding book", error);
        res.status(500).send("error " + error.message);
    }
});

router.get("/getAllBooks",authentication, async(req, res)=>{

    try {
        let findAllBooks = await BookSchema.find({});

        if(findAllBooks.length ==0){
            return res.status(200).json({message : "Book List is Empty", success : false});
        }

        res.status(200).json({message : "Data fetch Successfully", success : true, data : findAllBooks});
    } catch (error) {
        console.log("some issue in fetching all books", error);
        res.status(500).send("error " + error.message);
    }
});

router.get("/getBookById/:id",authentication, async(req, res)=>{

    try {
        let id = req.params.id;

        let singleBook = await BookSchema.findOne({_id: id});

        if(!singleBook)
        {
            return res.status(400).json({message : "No Book Found", success : false});
        }

        res.status(200).json({message : "Fetch Successful", success : true, data :singleBook})
    } catch (error) {
        console.log("some issue in fetching single book", error);
        res.status(500).send("error " + error.message);
    }
});

router.put("/updateBook/:id",authentication, async(req,res)=>{

    try {
        let { title,author,description,publisher,pages,language,newPrice,oldPrice} = req.body;

        let id = req.params.id;
        let book = await BookSchema.findOne({_id: id});

        if(!book){
            return res.status(400).json({message : "No Book Found", success : false});
        }

        Object.keys(req.body).forEach(user => book[user] = req.body[user]);

        let updatedData = await book.save();

        res.status(200).json({message : "Book Updated", success : true, data : updatedData});

    } catch (error) {
        console.log("some issue in updating book", error);
        res.status(500).send("error " + error.message);
    }
});

router.delete("/deleteBook/:id",authentication,async(req, res)=>{
    try {
        let id = req.params.id;
        let deleteBook = await BookSchema.findByIdAndDelete({_id:id});

        res.status(200).json({message : `${deleteBook.title} Book Deleted`, success : true});

    } catch (error) {
        console.log("error in deleting book", error);
        res.status(500).send("error " + error.message);
    }
})


export default router;