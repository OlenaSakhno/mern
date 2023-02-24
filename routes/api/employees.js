const express = require("express");
const router = express.Router();
const path = require("path");
const data = {};
data.employees = require("../../model/employees.json");
const employeesController = require("../../controllers/employeesController");

//chain the methods for the same route
// all logic moved to controller
router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);
router.route("/:id").get(employeesController.getEmployee);
module.exports = router;
