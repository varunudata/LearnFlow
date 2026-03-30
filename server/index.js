import express from "express"
const app = express()
const PORT = 4000

app.get("/", (req, res) => {
    // return res.status(200).json({ success: true, message: "Hello World!" })
    res.send("Hello from backend")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})