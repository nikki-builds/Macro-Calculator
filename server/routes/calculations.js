const express = require('express');
const router = express.Router(); // creates a mini-app for routes
const Calculation = require('../models/Calculation');

//POST: create new data (POST /api/calculations & save a new calculation
// 
router.post('/', async (req,res)=> {
  try {
    const newCalculation = new Calculation(req.body);
    const savedCalculation = await newCalculation.save();
    res.status(201).json(savedCalculation);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});


// GET /api/calculations & get ALL calculations
router.get('/', async(req,res)=> {
  try {
    const calculations = await Calculation.find().sort({ createdAt: -1});
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
});

// GET /api/calculations/:id & get a single calculation by ID
router.get('/:id', async(req,res)=> {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if(!calculation) {
      return res.status(404).json({ message: 'Calculation not found'});
    }

    res.json(calculation);
  } catch (error) {
    res.status(505).json({ message: error.message });
  } 
});


// DELETE /api/calculations/:id & delete a calculation
router.delete('/:id', async(req,res)=> {
  try {
    const calculation = await Calculation.findByIdAndDelete(req.params.id);

    if(!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }
    res.json({ message:'Calculation deleted successfully'});
  } catch(error) {
    res.status(500).json({ message: error.message});
  }
});


// Users typically don't need to edit old calculations but include PUT part for comopleteness. 
// PUT /api/calculation/:id and update a calculation
router.put('/:id', async(req,res)=> {
  try {
    const updatedCalculation = await Calculation.findByIdAndUpdate(
      req.params.id, // which document to update
      req.body, // new data/values from req.body
      { new: true, runValidators: true } // new: controls which version is returned
    );
    if (!updatedCalculation) {
      return res.status(404).json({ message: 'Calculation not found'});
    }

    res.json(updatedCalculation);
  } catch (error) {
    res.status(400).json({ message: error.message});
  }
});


module.exports = router;