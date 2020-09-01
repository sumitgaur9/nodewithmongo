const express = require('express');

var path = require('path');


var fs = require('fs');

const mongoose = require('mongoose');

var multer = require('multer');


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
const Medicine = require('../DB/Medicine');
const LabTest = require('../DB/LabTest');
const LabTestsPackage = require('../DB/LabTestsPackage');
const BookLabTest = require('../DB/BookLabTest');
const Admin = require('../DB/Admin');
const Item = require('../DB/Item');
const LabTechnician = require('../DB/LabTechnician');
const LabTestReport = require('../DB/LabTestReport');

const auth = require('../middleware/auth');
const { pathToFileURL } = require('url');

const route = express.Router();

route.use(express.static(__dirname+"./public/"));

const fast2sms = require('fast-two-sms')
 
route.post('/GenerateOTP', async (req, res) => {
  try {
    const user = await Participant.findOne({ email:req.body.email })
    if (!user) {
      throw new Error({ error: 'Email ID does not exist' })
    } 
    if (!user.phoneno) {
      throw new Error({ error: 'Phone number for user is not defined' })
    } 
     let otp = Math.floor(Math.random()*1000000);
     //var options = { authorization: 'DHfOUwAJ107WP2YN5pqhRo3zcKlITjXaM9tGrFQx8mv4i6nZydsW15y4bSw2qHGoBQEYpjIakKTgnUVu', message: 'Your HealthCare App account OTP to change password is: '+ otp, numbers: [ user.phoneno] }
    var options = { authorization: process.env.YOUR_API_KEY, message: 'Your HealthCare App account OTP to change password is: '+ otp, numbers: [ user.phoneno] }
    const response = await fast2sms.sendMessage(options)
    response.OTP = otp;
    console.log(response)
    res.status(200).send({ response })
  } catch (error) {
    res.status(400).send(error)
  }

})

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
});

var upload = multer({ 
  storage: Storage 
}).any('file');


route.post('/api/photo', upload, function (req, res) {

      try {
      var imageFile = req.files[0].filename;
      var success = req.files[0].filename + "Uploaded Successfully";
      var newItem = new Item({
        image: imageFile,
      });
      newItem.save()
      //res.render('render-file', { title: 'Upload File', success: success });
       res.status(200).send({ newItem })

    } catch (error) {
      //res.status(400).send(error)
      res.json({ error: error })
      // res.status(500).json({ message: err.message })

    }



 // });
});




route.post('/Save_DoctorProfile', upload, async (req, res) => {
  try {
    var imageFile = req.files[0].filename;
    //  var success = req.files[0].filename + "Uploaded Successfully";

    var doctor = new Doctor(req.body)
    doctor.image = imageFile;
    // var newLabTestReport = new Doctor({
    //   reportData: imageFile,
    //   bookLabTestId: req.body.bookLabTestId,
    //   labTechnicanID: req.body.labTechnicanID,
    //   labTechnicanName: req.body.labTechnicanName,
    //   reportGenerationDate: req.body.reportGenerationDate,
    // });
    doctor.save();
    res.status(200).send({ doctor })
  } catch (error) {
    res.json({ error: error })
  }
});

// route.post('/Save_DoctorProfile',  async (req, res) => {
//   // Create a new Doctor
//   try {    
//       const doctor = new Doctor(req.body)
//       await doctor.save()
//       res.status(200).send({ doctor })
//   } catch (error) {
//       res.status(400).send(error)
//   }
// })

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


route.put('/Update_LabTechnicianProfile/:id', getLabTechnician, async (req, res) => {
  //Update a existing Doctor with id
  try {
    const labtech = await LabTechnician.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    res.send(labtech)
    
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one doctor profile
route.get('/Get_LabTechnicianProfile/:id', getLabTechnician, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

route.get('/Get_LabTechniciansList', async (req, res) => {
  try {
    const labtechnicians = await LabTechnician.find()
    res.send(labtechnicians)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getLabTechnician(req, res, next){
  let subscriber 
  try{
      subscriber = await LabTechnician.findById(req.params.id)
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
      if(req.body.role==1){
        subscr = await Appointment.findById(req.body.appointmentId)
        subscr.isVisitCompleted = true;
        const updatedSubscr = await subscr.save()
      } else if(req.body.role==2){
        subscr = await BookLabTest.findById(req.body.bookLabTestId)
        subscr.isCollectionCollected = true;
        const updatedSubscr1 = await subscr.save()
      }       

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

      let subscr;
      subscr = await Appointment.findById(req.body.appointmentId)
      subscr.isPharmacyProvided = true;
      const updatedSubscr = await subscr.save();

      let subscri;
      subscri = await PatientMedicinesForHomeDelivery.find({appointmentID: req.body.appointmentId})
      
      subscri[0].isPharmacyProvided = true;
      const updatedSubscri = await subscri[0].save();

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
route.get('/Get_AppointmentsByDocID/:doctorID', getFilteredDoctorAppointments, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredDoctorAppointments(req, res, next) {
  let subscriber
  try {
    if (req.body.sortBy && req.body.sortBy == "patientNname" && req.body.sortDir == 'desc') {
      subscriber = await Appointment.find({ doctorID: req.params.doctorID }).sort({ patientNname: 1 });
    } else if (req.body.sortBy && req.body.sortBy == "patientNname" && req.body.sortDir == 'asc') {
      subscriber = await Appointment.find({ doctorID: req.params.doctorID }).sort({ patientNname: -1 });
    } else if (req.body.sortBy && req.body.sortBy == "doctorName" && req.body.sortDir == 'desc') {
      subscriber = await Appointment.find({ doctorID: req.params.doctorID }).sort({ doctorName: 1 });
    } else if (req.body.sortBy && req.body.sortBy == "doctorName" && req.body.sortDir == 'asc') {
      subscriber = await Appointment.find({ doctorID: req.params.doctorID }).sort({ doctorName: -1 });
    } else {
      subscriber = await Appointment.find({ doctorID: req.params.doctorID });
    }
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" })
    }
  } catch (err) {
  }
  res.subscriber = subscriber
  next()
}


////////////

route.post('/Save_Medicine',  async (req, res) => {
  // Create a new Medicines
  try {    
      const medicine = new Medicine(req.body)
      await medicine.save()
      res.status(200).send({ medicine })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all diseases
route.get('/Get_MedicinesList', async (req, res) => {
  try {
    const medicines = await Medicine.find()
    res.send(medicines)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



//Get my(phamacist) pharmacy request list by phamacist's id
route.get('/Get_PharmaReqByPhamacistID/:pharmacistID', getFilteredPharmacyReq, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredPharmacyReq(req, res, next){
  let subscriber 
  try{
      subscriber = await PatientMedicinesForHomeDelivery.find({pharmacistID: req.params.pharmacistID});

      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){
  }
  res.subscriber = subscriber
  next()
}

///////////

//Get my(patient) appointments list by patient's id
route.get('/Get_AppointmentsByPatientID/:patientID', getFilteredPatientAppointments, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredPatientAppointments(req, res, next){
  let subscriber 
  try{
      subscriber = await Appointment.find({patientID: req.params.patientID});

      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){
  }
  res.subscriber = subscriber
  next()
}


route.post('/Save_LabTest',  async (req, res) => {
  // Create a new LabTest
  try {    
      const labtest = new LabTest(req.body)
      await labtest.save()
      res.status(200).send({ labtest })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Delete LabTest
route.delete('/Delete_LabTest/:id', getLabTest, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Lab Test Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })
  
  async function getLabTest(req, res, next){
      let subscriber 
      try{
          subscriber = await LabTest.findById(req.params.id)
          if (subscriber == null){
              return res.status(404).json({message: "Cannot find subscriber" })
          }
      } catch(err){  
      }
      res.subscriber = subscriber
      next()
  }


// Getting all lab tests
route.get('/Get_LabTestsList', async (req, res) => {
  try {
    const labtests = await LabTest.find()
    res.send(labtests)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




route.post('/Save_LabTestsPackage',  async (req, res) => {
  // Book a new LabTest
  try {    
      const labtestspackage = new LabTestsPackage(req.body)
      await labtestspackage.save()
      res.status(200).send({ labtestspackage })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Delete LabTestPackage
route.delete('/Delete_LabTestsPackage/:id', getLabTestPackage, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Lab Test Package Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })
  
  async function getLabTestPackage(req, res, next){
      let subscriber 
      try{
          subscriber = await LabTestsPackage.findById(req.params.id)
          if (subscriber == null){
              return res.status(404).json({message: "Cannot find subscriber" })
          }
      } catch(err){  
      }
      res.subscriber = subscriber
      next()
  }



// Getting all lab tests packages
route.get('/Get_LabTestsPackage', async (req, res) => {
  try {
    const labtestspackage = await LabTestsPackage.find()
    res.send(labtestspackage)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




route.post('/Save_BookLabTest',  async (req, res) => {
  // Book a new LabTest
  try {    
      const booklabtest = new BookLabTest(req.body)
      await booklabtest.save()
      res.status(200).send({ booklabtest })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Getting all lab tests booking list
route.get('/Get_LabTestsBookings', async (req, res) => {
  try {

    let labtestsbookings;

    if (req.body.nurseID != undefined && req.body.nurseID != '') {
      labtestsbookings = await BookLabTest.find({ nurseID: req.body.nurseID });
    } 
    else if (req.body.patientID != undefined && req.body.patientID != '') {
      labtestsbookings = await BookLabTest.find({ patientID: req.body.patientID });
    } 
    else if (req.body.isCollectionCollected != undefined && req.body.isCollectionCollected != '') {
      labtestsbookings = await BookLabTest.find({ isCollectionCollected: req.body.isCollectionCollected });
    }
    else {
      labtestsbookings = await BookLabTest.find();
    }


    res.send(labtestsbookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Save LabTestReport 
route.post('/Save_UploadLabTestReport', upload, async (req, res)=> {
      try {
      var pdfFile = req.files[0].filename;
      var success = req.files[0].filename + "Uploaded Successfully";
      var newLabTestReport = new LabTestReport({
        reportData: pdfFile,
        bookLabTestId: req.body.bookLabTestId,
        labTechnicanID: req.body.labTechnicanID,
        labTechnicanName: req.body.labTechnicanName,
        reportGenerationDate: req.body.reportGenerationDate,
      });
      newLabTestReport.save()

      subscr = await BookLabTest.findById(req.body.bookLabTestId)
      subscr.isReportGenerated = true;
      const updatedSubscr = await subscr.save()      

       res.status(200).send({ newLabTestReport })

    } catch (error) {
      res.json({ error: error })

    }
});




route.get('/Get_UploadedTestReportbyBookLabTestID/:BookLabTestID', async (req, res) => {
  try {
    
      let labtestreport = await LabTestReport.findOne({bookLabTestId: req.params.BookLabTestID});
      let filename = labtestreport.reportData;      
    var file = fs.createReadStream('./public/uploads/'+filename);
    var stat = fs.statSync('./public/uploads/'+filename);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename='+filename);
    file.pipe(res);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//////////////////////////

/// Doctor Dashboard API's

route.get('/Get_CommonDashboardCount', async (req, res) => {
  try {
    const doctors = await Doctor.find()
    const patients = await Patient.find()
    const nurses = await Nurse.find()
    const pharmacists = await Pharmacist.find()
    let obj ={
      total_no_of_doctors: doctors.length,
      total_no_of_patients: patients.length,
      total_no_of_nurses: nurses.length,
      total_no_of_pharmacists: pharmacists.length,
    }
    res.send(obj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



route.get('/Get_DiseaseWiseApptCount/:doctorID?', async (req, res) => {
  try {
    let appointments;
    if(req.params.doctorID!=undefined){
      appointments = await Appointment.find({doctorID: req.params.doctorID});
    } else{
      appointments = await Appointment.find()
    }
    const diseases = await Disease.find()
    let arr=[];
    for(let i=0;i<diseases.length;i++){
      let obj = new Object();
      obj.diseaseName = diseases[i].diseaseName;
      obj.apptCount = 0;
      for(let j=0;j<appointments.length;j++){
        if(diseases[i].diseaseName==appointments[j].disease){
          obj.apptCount++;
        }
      }
      arr.push(obj);
    }
    res.send(arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


route.get('/Get_MedicineWiseApptCount/:doctorID?', async (req, res) => {
  try {
    let patientmedicinesforhomedelivery;
    if(req.params.doctorID!=undefined){
      patientmedicinesforhomedelivery = await PatientMedicinesForHomeDelivery.find({doctorID: req.params.doctorID});
    } else{
      patientmedicinesforhomedelivery = await PatientMedicinesForHomeDelivery.find()
    }
    const medicines = await Medicine.find()
    let arr=[];
    for(let i=0;i<medicines.length;i++){
      let obj = new Object();
      obj.medicineName = medicines[i].medicineName;
      obj.apptCount = 0;
      for(let j=0;j<patientmedicinesforhomedelivery.length;j++){
        if(medicines[i].medicineName==patientmedicinesforhomedelivery[j].medicineName){
          obj.apptCount++;
        }
      }
      arr.push(obj);
    }
    res.send(arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})





route.get('/Get_PharmacistWiseApptCount/:doctorID?', async (req, res) => {
  try {
    let patientmedicinesforhomedelivery;
    if(req.params.doctorID!=undefined){
      patientmedicinesforhomedelivery = await PatientMedicinesForHomeDelivery.find({doctorID: req.params.doctorID});
    } else{
      patientmedicinesforhomedelivery = await PatientMedicinesForHomeDelivery.find()
    }

    const pharmacists = await Pharmacist.find()
    let arr=[];
    for(let i=0;i<pharmacists.length;i++){
      let obj = new Object();
      obj.pharmacistName = pharmacists[i].name;
      obj.apptCount = 0;
      for(let j=0;j<patientmedicinesforhomedelivery.length;j++){
        if(pharmacists[i]._id==patientmedicinesforhomedelivery[j].pharmacistID){
          obj.apptCount++;
        }
      }
      arr.push(obj);
    }
    res.send(arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


route.get('/Get_MonthlyHomeOnlineApptCount/:doctorID?', async (req, res) => {
  try {
     let appointments;
     if(req.params.doctorID!=undefined){
       appointments = await Appointment.find({doctorID: req.params.doctorID});
     } else{
       appointments = await Appointment.find()
     }

     // for test local data 

    //  let appointments = [
    //   { appointmentType:'Online' },
    //   {appointmentDate: "2020/07/29", appointmentType:'Online' },
    //   {appointmentDate: "2020/02/26", appointmentType:'HomeVisit' },
    //   {appointmentDate: "2020/01/25", appointmentType:'Online' },
    //   {appointmentDate: "2020/03/20", appointmentType:'HomeVisit' },
    //   {appointmentDate: "2020/01/26", appointmentType:'Online' },
    //   {appointmentDate: "2020/01/16", appointmentType:'HomeVisit' },
    // ];

      let arr = [];
      for(i=1;i<=12;i++){
        let obj = new Object();
        obj.HomeVisitCount = 0;
        obj.OnlineConsultationCount = 0;
        obj.MonthTotal= 0;
        for(let j=0;j<appointments.length;j++){
          
          if(appointments[j].appointmentDate){
            let correctDate = new Date(appointments[j].appointmentDate);
            if(i==correctDate.getMonth()+1){
              if (appointments[j].appointmentType == 'HomeVisit') {
                obj.HomeVisitCount++;
              } else if (appointments[j].appointmentType == 'Online') {
                obj.OnlineConsultationCount++;
              }
              obj.MonthTotal++;
              switch(correctDate.getMonth()+1){
                case 1: 
                obj.Month= "Jan";          
                break;
                case 2: 
                obj.Month= "Feb";  
                break;
                case 3: 
                obj.Month= "Mar";
                break;
                case 4: 
                obj.Month= "Apr";
                break;
                case 5: 
                obj.Month= "May";
                break;
                case 6: 
                obj.Month= "Jun";
                break;
                case 7: 
                obj.Month= "July";
                break;
                case 8: 
                obj.Month= "Aug";
                break;
                case 9: 
                obj.Month= "Sep";
                break;
                case 10: 
                obj.Month= "Oct";
                break;
                case 11: 
                obj.Month= "Nov";
                break;
                case 12: 
                obj.Month= "Dec";
                break;
              }
            }
            
            
          }
        }
        arr.push(obj); 
        for(let k = 0;k<arr.length;k++){
          if(arr[k].Month==undefined){
            switch(k+1){
              case 1: 
              arr[k].Month= "Jan";          
              break;
              case 2: 
              arr[k].Month= "Feb";  
              break;
              case 3: 
              arr[k].Month= "Mar";
              break;
              case 4: 
              arr[k].Month= "Apr";
              break;
              case 5: 
              arr[k].Month= "May";
              break;
              case 6: 
              arr[k].Month= "Jun";
              break;
              case 7: 
              arr[k].Month= "July";
              break;
              case 8: 
              arr[k].Month= "Aug";
              break;
              case 9: 
              arr[k].Month= "Sep";
              break;
              case 10: 
              arr[k].Month= "Oct";
              break;
              case 11: 
              arr[k].Month= "Nov";
              break;
              case 12: 
              arr[k].Month= "Dec";
              break;
            }
          }
         
        }
      }
  
    res.send(arr)
  }catch (err) {
    res.status(500).json({ message: err.message })
  }
})


/// Patient Dashboard API's

//Get my(patient) doctor wise appointment count by patient's id 
route.get('/Get_DoctorWiseApptCount/:patientID', getFilteredPatientAppointments, async (req, res) => {
  try {
    let myAppt = res.subscriber;

    const doctors = await Doctor.find()
    let arr=[];
    for(let i=0;i<doctors.length;i++){
      let obj = new Object();
      obj.doctorName = doctors[i].name;
      obj.apptCount = 0;
      for(let j=0;j<myAppt.length;j++){
        if(doctors[i]._id==myAppt[j].doctorID){
          obj.apptCount++;
        }
      }
      arr.push(obj);
    }
    res.send(arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//Get my(patient) individual lab test (ignore test packages) count by patient's id 
route.get('/Get_LabTestWisetestCount/:patientID', getFilteredPatientLabtests, async (req, res) => {
  try {
    let mytests = res.subscriber;

    const labtests = await LabTest.find()
    let arr=[];
    for(let i=0;i<labtests.length;i++){
      let obj = new Object();
      obj.testName = labtests[i].testName;
      obj.testCount = 0;
      for(let j=0;j<mytests.length;j++){
        if(labtests[i]._id==mytests[j].testsData[0].testID){
          obj.testCount++;
        }
      }
      arr.push(obj);
    }
    res.send(arr)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredPatientLabtests(req, res, next){
  let subscriber 
  try{
      subscriber = await BookLabTest.find({patientID: req.params.patientID});

      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){
  }
  res.subscriber = subscriber
  next()
}


//Get my(patient) individual lab test count to package count by patient's id 
route.get('/Get_IndividualToPackageLabTestCount/:patientID', getFilteredPatientLabtests, async (req, res) => {
  try {
    let mytests = res.subscriber;

    const labtests = await LabTest.find()
   
      let obj = new Object();
      obj.individualTestCount = 0;
      obj.packageCount = 0;
      for(let j=0;j<mytests.length;j++){
        if(mytests[j].testsData[0].packageID!=""){
          obj.packageCount++;
        } else {
          obj.individualTestCount++;
        }
      }     
    res.send(obj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})





//////////////////////////




/////////////////////////



route.post('/users', async (req, res) => {
  // Create a new user
  try {
    if(req.body.role){
      if(req.body.role===1){req.body.type = "Doctor" }
      else if(req.body.role===2){req.body.type = "Nurse" }
      else if(req.body.role===3){req.body.type = "Physio" }
      else if(req.body.role===4){req.body.type = "Pharmacist" }
      else if(req.body.role===5){req.body.type = "LabTechnician" }      
      else if(req.body.role===11){req.body.type = "Admin" }      
      else {req.body.type = "Individual" }
    }
      const user = new Participant(req.body)
      await user.save()
      const token = await user.generateAuthToken()
      let roleBaseId;
      let obj = {
        name: req.body.name,
        email: req.body.email,
        participantID: user.id,          
        phoneno: user.phoneno,          
      }
      if(req.body.role < 1){
        //Patient(Individual)
        const patient = new Patient(obj)
        await patient.save();
        roleBaseId= patient.id;
      } else if(req.body.role==1){
        //Doctor        
        const doctor = new Doctor(obj)
        await doctor.save();
        roleBaseId= doctor.id;
      } else if(req.body.role==2){
        //Nurse
        const nurse = new Nurse(obj)
        await nurse.save();
        roleBaseId= nurse.id;
      } else if(req.body.role==3){
        //Physio
        const physio = new Physio(obj)
        await physio.save();
        roleBaseId = physio.id;
      } else if(req.body.role==4){
        //Pharmacist
        const pharmacist = new Pharmacist(obj)
        await pharmacist.save();
        roleBaseId= pharmacist.id;
      } else if(req.body.role==5){
        //LabTechnician
        const labtechnician = new LabTechnician(obj)
        await labtechnician.save();
        roleBaseId= labtechnician.id;
      }  else if(req.body.role==11){
        //Admin
        const admin = new Admin(obj)
        await admin.save();
        roleBaseId = admin.id; //should be null not 'admin.id'
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
      const participantID = user.id;

      if(user.role < 1){        
        const patient = await Patient.findOne({ participantID });
        roleBaseId = patient.id;
      }else if(user.role==1){
        const doc = await Doctor.findOne({ participantID });
        roleBaseId = doc.id;
      }else if(user.role==2){        
        const nurse = await Nurse.findOne({ participantID });
        roleBaseId = nurse.id;
      }else if(user.role==3){        
        const physio = await Physio.findOne({ participantID });
        roleBaseId = physio.id;
      }else if(user.role==4){        
        const pharmacist = await Pharmacist.findOne({ participantID });
        roleBaseId = pharmacist.id;
      }else if(user.role==5){        
        const labtechician = await LabTechnician.findOne({ participantID });
        roleBaseId = labtechician.id;
      }else if(user.role==11){        
        const admin = await Admin.findOne({ participantID });
        roleBaseId = admin.id;
      }
      const token = await user.generateAuthToken() 
      res.send({ user, roleBaseId, token })
  } catch (error) {
      res.status(400).send(error)
  }

})

route.get('/users/me', auth, async (req, res) => {

  try {
  let user;
    // View logged in user profile 
    let roleBaseId;
    if (req.user.role < 1) {
      const docid = req.user.id
      //const doc = await Patient.findOne({ docid });
      const doc = await Patient.findOne({ participantID: docid });
      roleBaseId = doc.id;
      user = doc;
    } else if (req.user.role == 1) {
      const docid = req.user.id
      //const doc = await Doctor.findOne({ docid });
      const doc = await Doctor.findOne({ participantID: docid });
      roleBaseId = doc.id;
      user = doc;
    }
    else if (req.user.role == 2) {
      const nurseid = req.user.id
      //const nurse = await Nurse.findOne({ docid });
      const nurse = await Nurse.findOne({ participantID: nurseid });
      roleBaseId = nurse.id;
      user = nurse;
    }
    else if (req.user.role == 3) {
      const physioid = req.user.id
      //const physio = await Physio.findOne({ docid });
      const physio = await Physio.findOne({ participantID: physioid });
      roleBaseId = physio.id;
      user = physio;
    }
    else if (req.user.role == 4) {
      const pharmacistid = req.user.id
      //const pharmacist = await Pharmacist.findOne({ docid });
      const pharmacist = await Pharmacist.findOne({ participantID: pharmacistid });
      roleBaseId = pharmacist.id;
      user = pharmacist;
    }
    else if (req.user.role == 5) {
      const labtechicianid = req.user.id
      //const labtechnician = await LabTechnician.findOne({ docid });
      const labtechnician = await LabTechnician.findOne({ participantID: labtechicianid });
      roleBaseId = labtechnician.id;
      user = labtechnician;
    }
    // res.send(req.user, roleBaseId)
    res.status(200).send({ user, roleBaseId })

  }
  catch (error) {
    res.status(500).send(error)
  }
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
