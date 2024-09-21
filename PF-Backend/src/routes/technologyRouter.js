const { Router } = require("express")
const { getAllTechnologies, createTechnology } = require("../handlers/technology-handler")

const technologyRouter = Router()

technologyRouter.get("/", getAllTechnologies)
technologyRouter.post("/", createTechnology)


module.exports = technologyRouter;