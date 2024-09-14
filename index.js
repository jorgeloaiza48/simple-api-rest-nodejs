import express from 'express'
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

//GET
app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

//GET con parámteros
app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    res.json(book);
});

//POST 
app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body, //con el spreadOperator le decimos que lo que venga por el body lo agregue a la variable newBook
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

//PUT
app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books[bookIndex] = {
        ...data.books[bookIndex], //los datos que están en la posición "bookIndex" serán actualizados con lo que llegue en el body
        ...body, //los datos que están en la posición "bookIndex" serán actualizados con lo que llegue en el body
    };
    writeData(data);
    res.json({ message: "Book updated successfully" });
});

//DELETE
app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    data.books.splice(bookIndex, 1); //splice elimina un elemento(si el segundo parámetro es 1)del array apartir del índice indicado -->> array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
    writeData(data);
    res.json({ message: "Book deleted successfully" });
});


app.get("/", (req, res) => {
    res.send("Bienvenidos a mi Api Rest en Nodejs")
})

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000")
})