const express = require('express');
const mongoose = require('mongoose');
const User = require('../DB/User');
const Participant = require('../DB/Participant');
const Doctor = require('../DB/Doctor');
const Patient = require('../DB/Patient');
const Pharmacist = require('../DB/Pharmacist');
const Nurse = require('../DB/Nurse');
const Physio = require('../DB/Physio');
const VisitCompletionIntimation = require('../DB/VisitCompletionIntimation');
const PatientMedicinesForHomeDelivery = require('../DB/PatientMedicinesForHomeDelivery');
const PharmacistVisitCompleteIntimation = require('../DB/PharmacistVisitCompleteIntimation');
const auth = require('../middleware/auth');

const route = express.Router();


route.post('/Save_DoctorProfile',  async (req, res) => {
  // Create a new Doctor
  try {    
      const doctor = new Doctor(req.body)
      await doctor.save()
      res.status(200).send({ doctor })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all doctors
route.get('/Get_DoctorsList', async (req, res) => {
  try {
    const doctors = await Doctor.find()
    res.send(doctors)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Doctor
route.delete('/Delete_Doctor:id', getDoctor, async (req, res) => {
try {
    await res.subscriber.remove()
    res.json({ message: "Doctor Deleted successfully "})
} catch (err) {
    res.status(500).json({ message: err.message })
}
})

async function getDoctor(req, res, next){
    let subscriber 
    try{
        subscriber = await Doctor.findById(req.params.id)
        if (subscriber == null){
            return res.status(404).json({message: "Cannot find subscriber" })
        }
    } catch(err){
    }
    res.subscriber = subscriber
    next()
}


route.post('/Save_PatientProfile',  async (req, res) => {
  // Create a new Patient
  try {    
      const patient = new Patient(req.body)
      await patient.save()
      res.status(200).send({ patient })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all patients
route.get('/Get_PatientsList', async (req, res) => {
  try {
    const patients = await Patient.find()
    res.send(patients)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Patient
route.delete('/Delete_Patient:id', getPatient, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Patient Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })
  
  async function getPatient(req, res, next){
      let subscriber 
      try{
          subscriber = await Patient.findById(req.params.id)
          if (subscriber == null){
              return res.status(404).json({message: "Cannot find subscriber" })
          }
      } catch(err){  
      }
      res.subscriber = subscriber
      next()
  }

  /////////////////////////////

  route.post('/Save_PharmacistProfile',  async (req, res) => {
    // Create a new Pharmacist
    try {    
        const pharmacist = new Pharmacist(req.body)
        await pharmacist.save()
        res.status(200).send({ pharmacist })
    } catch (error) {
        res.status(400).send(error)
    }
  })
  
  // Getting all pharmacist
  route.get('/Get_PharmacistsList', async (req, res) => {
    try {
      const pharmacists = await Pharmacist.find()
      res.send(pharmacists)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  // Delete Pharmacist
  route.delete('/Delete_Pharmacist:id', getPharmacist, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Pharmacist Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })
  
  async function getPharmacist(req, res, next){
      let subscriber 
      try{
          subscriber = await Pharmacist.findById(req.params.id)
          if (subscriber == null){
              return res.status(404).json({message: "Cannot find subscriber" })
          }
      } catch(err){
      }
      res.subscriber = subscriber
      next()
  }
//////////////////////  


route.post('/Save_NurseProfile',  async (req, res) => {
  // Create a new Nurse
  try {    
      const nurse = new Nurse(req.body)
      await nurse.save()
      res.status(200).send({ nurse })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all nurse
route.get('/Get_NursesList', async (req, res) => {
  try {
    const nurses = await Nurse.find()
    res.send(nurses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Nurse
route.delete('/Delete_Nurse:id', getNurse, async (req, res) => {
try {
    await res.subscriber.remove()
    res.json({ message: "Nurse Deleted successfully "})
} catch (err) {
    res.status(500).json({ message: err.message })
}
})

async function getNurse(req, res, next){
    let subscriber 
    try{
        subscriber = await Nurse.findById(req.params.id)
        if (subscriber == null){
            return res.status(404).json({message: "Cannot find subscriber" })
        }
    } catch(err){
    }
    res.subscriber = subscriber
    next()
}
////////////////////// 



route.post('/Save_PhysioProfile',  async (req, res) => {
  // Create a new Physio
  try {    
      const physio = new Physio(req.body)
      await physio.save()
      res.status(200).send({ physio })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all physio
route.get('/Get_PhysiosList', async (req, res) => {
  try {
    const physios = await Physio.find()
    res.send(physios)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Physio
route.delete('/Delete_Physio:id', getPhysio, async (req, res) => {
try {
    await res.subscriber.remove()
    res.json({ message: "Physio Deleted successfully "})
} catch (err) {
    res.status(500).json({ message: err.message })
}
})

async function getPhysio(req, res, next){
    let subscriber 
    try{
        subscriber = await Physio.findById(req.params.id)
        if (subscriber == null){
            return res.status(404).json({message: "Cannot find subscriber" })
        }
    } catch(err){
    }
    res.subscriber = subscriber
    next()
}

//////////////

route.post('/Save_VisitCompleteIntimation',  async (req, res) => {
  // Create a new Physio
  try {    
      const visitcompleteintimation = new VisitCompletionIntimation(req.body)
      await visitcompleteintimation.save()
      res.status(200).send({ visitcompleteintimation })
  } catch (error) {
      res.status(400).send(error)
  }
})
////////////

route.post('/PatMedForHomDel',  async (req, res) => {
  // Create a new Physio
  try {    
      const patientmedicinesforhomedelivery = new PatientMedicinesForHomeDelivery(req.body)
      await patientmedicinesforhomedelivery.save()
      res.status(200).send({ patientmedicinesforhomedelivery })
  } catch (error) {
      res.status(400).send(error)
  }
})
////////////
route.post('/PatMedForHomDel',  async (req, res) => {
  // Create a new Physio
  try {    
      const pharmacistvisitcompleteintimation = new PharmacistVisitCompleteIntimation(req.body)
      await pharmacistvisitcompleteintimation.save()
      res.status(200).send({ pharmacistvisitcompleteintimation })
  } catch (error) {
      res.status(400).send(error)
  }
})
////////////


route.post('/users', async (req, res) => {
  // Create a new user
  try {
    if(req.body.role){
      if(req.body.role===1){req.body.type = "Doctor" }
      else if(req.body.role===2){req.body.type = "Nurse" }
      else if(req.body.role===3){req.body.type = "Physio" }
      else {req.body.type = "Individual" }
    }
      const user = new Participant(req.body)
      await user.save()
      const token = await user.generateAuthToken()
      res.status(201).send({ user, token })
  } catch (error) {
      res.status(400).send(error)
  }
})

route.post('/users/login', async(req, res) => {
  //Login a registered user
  try {
      const { email, password } = req.body
      const user = await Participant.findByCredentials(email, password)
      if (!user) {
          return res.status(401).send({error: 'Login failed! Check authentication credentials'})
      }
      const token = await user.generateAuthToken() 
      res.send({ user, token })
  } catch (error) {
      res.status(400).send(error)
  }

})

route.get('/users/me', auth, async(req, res) => {
  // View logged in user profile
  res.send(req.user)
})

route.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})














// // Creating one 
route.post('/', async (req, res) => {
  const { firstName, lastName } = req.body;
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  let userModel = new User(user);
  await userModel.save();
  res.json(userModel);
});


// Getting all
route.get('/', async (req, res) => {
  try {
      const users = await User.find()
      res.send(users)
  } catch (err){
      res.status(500).json({ message: err.message})
  }
  })
 
  // Getting One
route.get('/:id', getSubscriber, (req, res) => {
  res.send(res.subscriber)
})

// Updating One
route.patch('/:id', getSubscriber, async (req, res) => {
  if(req.body.firtName != null){
      res.subscriber.firtName = req.body.firtName
  }
  if(req.body.lastName != null){
      res.subscriber.lastName = req.body.lastName
  }
  try {
      const updatedSubscriber = await res.subscriber.save()
      res.json(updatedSubscriber)
  } catch (err) {
      res.status(400).json({ message: err.message})
  }
})

// Delete
route.delete('/:id', getSubscriber, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })



async function getSubscriber(req, res, next){
  let subscriber 
  try{
      subscriber = await User.findById(req.params.id)
      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){

  }

  res.subscriber = subscriber
  next()
}


module.exports = route;
