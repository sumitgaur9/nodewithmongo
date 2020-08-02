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
const Disease = require('../DB/Disease');
const Expertise = require('../DB/Expertise');
const Appointment = require('../DB/Appointment');
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

route.put('/Update_DoctorProfile/:id', getDoctor, async (req, res) => {
  //Update a existing Doctor with id
  try {
    const doct = await Doctor.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.send(doct)
    
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one doctor profile
route.get('/Get_DoctorProfile/:id', getDoctor, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
route.delete('/Delete_Doctor/:id', getDoctor, async (req, res) => {
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

route.put('/Update_PatientProfile/:id', getPatient, async (req, res) => {
  // Update a existing Patient with id
  try {
    const pat = await Patient.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.send(pat)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one patient profile
route.get('/Get_PatientProfile/:id', getPatient, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
route.delete('/Delete_Patient/:id', getPatient, async (req, res) => {
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

  route.put('/Update_PharmacistProfile/:id', getPharmacist, async (req, res) => {
    // Update a existing Pharmacist with id
    try {
      const pat = await Pharmacist.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
      res.send(pat)  
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })

  // Get one pharmacist profile
route.get('/Get_PharmacistProfile/:id', getPharmacist, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
  route.delete('/Delete_Pharmacist/:id', getPharmacist, async (req, res) => {
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

route.put('/Update_NurseProfile/:id', getNurse, async (req, res) => {
  // Update a existing Nurse with id
  try {
    const pat = await Nurse.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.send(pat)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

  // Get one nurse profile
  route.get('/Get_NurseProfile/:id', getNurse, async (req, res) => {
    try {
      res.send(res.subscriber)
    } catch (err) {
      res.status(500).json({ message: err.message })
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
route.delete('/Delete_Nurse/:id', getNurse, async (req, res) => {
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

route.put('/Update_PhysioProfile/:id', getPhysio, async (req, res) => {
  // Update a existing Physio with id
  try {
    const pat = await Physio.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.send(pat)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

  // Get one physio profile
  route.get('/Get_PhysioProfile/:id', getPhysio, async (req, res) => {
    try {
      res.send(res.subscriber)
    } catch (err) {
      res.status(500).json({ message: err.message })
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
route.delete('/Delete_Physio/:id', getPhysio, async (req, res) => {
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
//visit complete for all other than pharmacist
route.post('/Save_VisitCompleteIntimation',  async (req, res) => {
  // Create a new Physio
  try {    
      const visitcompleteintimation = new VisitCompletionIntimation(req.body)
      await visitcompleteintimation.save()

      let subscr;
      subscr = await Appointment.findById(req.body.appointmentId)
      subscr.isVisitCompleted = true;
      const updatedSubscr = await subscr.save()

      res.status(200).send({ visitcompleteintimation })
  } catch (error) {
      res.status(400).send(error)
  }
})
////////////

route.post('/Request_PatientMedicinesHomeDelivery',  async (req, res) => {
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
route.post('/Save_PharmaVisitCompleteIntimation',  async (req, res) => {
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

route.post('/Save_Disease',  async (req, res) => {
  // Create a new Disease
  try {    
      const disease = new Disease(req.body)
      await disease.save()
      res.status(200).send({ disease })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all diseases
route.get('/Get_DiseasesList', async (req, res) => {
  try {
    const diseases = await Disease.find()
    res.send(diseases)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting all expertise
route.get('/Get_ExpertiseList', async (req, res) => {
  try {
    const expertise = await Expertise.find()
    res.send(expertise)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

route.post('/Save_Expertise',  async (req, res) => {
  // Create a new Expertise
  try {    
      const expertise = new Expertise(req.body)
      await expertise.save()
      res.status(200).send({ expertise })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Get filterd doctors list based on expertise
  route.get('/Get_FilteredDoctors/:expertise', getFilteredDoctors, async (req, res) => {
    try {
      res.send(res.subscriber)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })

  async function getFilteredDoctors(req, res, next){
    let subscriber 
    try{
        subscriber = await Doctor.find({experties: req.params.expertise});
        if (subscriber == null){
            return res.status(404).json({message: "Cannot find subscriber" })
        }
    } catch(err){
    }
    res.subscriber = subscriber
    next()
}

//Save new appointment
route.post('/Save_BookAppointment',  async (req, res) => {
  // Create a new appointment
  try {    
      const appointment = new Appointment(req.body)
      await appointment.save()
      res.status(200).send({ appointment })
  } catch (error) {
      res.status(400).send(error)
  }
})

//Get my(doctor) appointments list by doctor's id
route.get('/Get_AppointmentsByDocID/:doctorID', getFilteredAppointments, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredAppointments(req, res, next){
  let subscriber 
  try{
      subscriber = await Appointment.find({doctorID: req.params.doctorID});

      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){
  }
  res.subscriber = subscriber
  next()
}



//////////////////////////







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
      let roleBaseId;
      if(req.body.role==1){
        //Doctor
        let obj = {
          name: req.body.name,
          email: req.body.email,
          participantID: user.id,          
        }
        const doctor = new Doctor(obj)
        await doctor.save();
        roleBaseId= doctor.id;
      } else if(req.body.role==2){
        //Nurse
        let obj = {
          name: req.body.name,
          email: req.body.email,
          participantID: user.id,          
        }
        const nurse = new Nurse(obj)
        await nurse.save();
        roleBaseId= nurse.id;
      } else if(req.body.role==3){
        //Physio
        let obj = {
          name: req.body.name,
          email: req.body.email,
          participantID: user.id,          
        }
        const physio = new Physio(obj)
        await physio.save();
        roleBaseId = physio.id;
      } else if(req.body.role==4){
        //Pharmacist
        let obj = {
          name: req.body.name,
          email: req.body.email,
          participantID: user.id,          
        }
        const pharmacist = new Pharmacist(obj)
        await pharmacist.save();
        roleBaseId= pharmacist.id;
      }     
      res.status(201).send({ user, roleBaseId, token })
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
      let roleBaseId;
      if(user.role==1){
        const participantID = user.id
        const doc = await Doctor.findOne({ participantID });
        roleBaseId = doc.id;
      }
      if(user.role==2){
        const participantID = user.id
        const nurse = await Nurse.findOne({ participantID });
        roleBaseId = nurse.id;
      }
      if(user.role==3){
        const participantID = user.id
        const physio = await Physio.findOne({ participantID });
        roleBaseId = physio.id;
      }
      if(user.role==4){
        const participantID = user.id
        const pharmacist = await Pharmacist.findOne({ participantID });
        roleBaseId = pharmacist.id;
      }
      const token = await user.generateAuthToken() 
      res.send({ user, roleBaseId, token })
  } catch (error) {
      res.status(400).send(error)
  }

})

route.get('/users/me', auth, async(req, res) => {
  // View logged in user profile 
  let  roleBaseId;
  if(req.user.role==1){
    const docid = req.user.id
    const doc = await Doctor.findOne({ docid });
    roleBaseId = doc.id;
  }
  if(req.user.role==2){
    const nurseid = req.user.id
    const nurse = await Nurse.findOne({ nurseid });
    roleBaseId = nurse.id;
  }
  if(req.user.role==3){
    const physioid = req.user.id
    const physio = await Physio.findOne({ physioid });
    roleBaseId = physio.id;
  }
  if(req.user.role==4){
    const pharmacistid = req.user.id
    const pharmacist = await Pharmacist.findOne({ pharmacistid });
    roleBaseId = pharmacist.id;
  }
  res.send(req.user, roleBaseId)
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
