const express = require('express');

var path = require('path');


var fs = require('fs');

const mongoose = require('mongoose');

var multer = require('multer');

var razorpayInstance = require('../DB/razorpay');
var crypto = require('crypto');

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
const ItemForImageByteArray = require('../DB/itemforimagebytearray');
const ItemForWebsite = require('../DB/ItemForWebsite');
const TextForWebsite = require('../DB/TextForWebsite');
const RazorpayPayments = require('../DB/RazorPayPayments');
const CartDetails = require('../DB/CartDetails');

const auth = require('../middleware/auth');
const { pathToFileURL } = require('url');

const route = express.Router();

route.use(express.static(__dirname+"./public/"));

const fast2sms = require('fast-two-sms')
 
route.post('/GenerateOTP', async (req, res) => {
  try {
    if(!req.body.email){
      res.status(501).json({ message: 'Email ID must be provided' })
      return;
    }
    const user = await Participant.findOne({ email:req.body.email })
    if (!user) {
      res.status(501).json({ message: 'Email ID does not exist' })
      return;
    } 
    if (!user.phoneno) {
      res.status(501).json({ message: 'Phone number for user is not defined' })
      return;
    } 
     let otp = Math.floor(Math.random()*1000000);
    //  var options = { authorization: 'DHfOUwAJ107WP2YN5pqhRo3zcKlITjXaM9tGrFQx8mv4i6nZydsW15y4bSw2qHGoBQEYpjIakKTgnUVu', message: 'Your HealthCare App account OTP to change password is: '+ otp, numbers: [ user.phoneno] }
    var options = { authorization: process.env.YOUR_API_KEY, message: 'Your HealthCare App account OTP to change password is: '+ otp, numbers: [ user.phoneno] }
    const response = await fast2sms.sendMessage(options)
    response.OTP = otp;
    response.regMobileNo = user.phoneno;
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



// Getting all api photos
route.get('/Get_APIPhoto', async (req, res) => {
  try {
    const images = await ItemForImageByteArray.find()
    res.send(images[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


route.post('/api/photo', upload,  (req, res)=> {

  try {  
    var newItem = new ItemForImageByteArray({ 
      image: { 
          data: fs.readFileSync(path.join('./public/uploads/' + req.files[0].filename)), 
          contentType: 'image/png'
      }
  }) 
    newItem.save()
    res.status(200).send({ newItem })

  } catch (error) {
    res.json({ error: error })
  }

});


// route.post('/api/photo', upload, function (req, res) {

//       try {
//       var imageFile = req.files[0].filename;
//       var success = req.files[0].filename + "Uploaded Successfully";
//       var newItem = new Item({
//         image: imageFile,
//       });
//       newItem.save()
//       //res.render('render-file', { title: 'Upload File', success: success });
//        res.status(200).send({ newItem })

//     } catch (error) {
//       //res.status(400).send(error)
//       res.json({ error: error })
//       // res.status(500).json({ message: err.message })

//     }



//  // });
// });

// Upload images for website
route.post('/SaveUpdate_UploadWebsiteImages', upload, async (req, res) => {
  try {

    if (req.files && req.files.length) {
      let doc = await ItemForWebsite.findOne({ locationEnum: parseInt(req.body.locationEnum) })
      // let doc = (docs && docs.length)? docs[0]:null;
      var newItem = {
        image: {
          data: fs.readFileSync(path.join('./public/uploads/' + req.files[0].filename)),
          contentType: 'image/png'
        },
        locationEnum: parseInt(req.body.locationEnum)
      }
      if (!doc) {
        const newrecord = new ItemForWebsite(newItem)
        await newrecord.save();
      } else {
        doc.image = newItem.image;
        await doc.save();
      }
    } else {
      throw new Error({ error: 'Image upload is MUST !!!' })
    }
   
    res.status(200).send({ newItem })

  } catch (error) {
    res.json({ error: error })
  }
});


// Getting image for website by  locationEnum
route.get('/Get_WebsiteImageByLocationEnum/:locationEnum', async (req, res) => {
  try {
    if(!req.params.locationEnum){
      throw new Error({ error: 'Please provide the locationEnum' });
    }
    let doc = await ItemForWebsite.findOne({ locationEnum: parseInt(req.params.locationEnum) })
    // let doc = (docs && docs.length)? docs[0]:null;
    res.send(doc)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


route.get('/Get_WebsiteImageByLocationEnumList', async (req, res) => {
  try {
    const ItemForWebsiteList = await ItemForWebsite.find()
    res.send(ItemForWebsiteList)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Save text data for website
route.post('/SaveUpdate_WebsiteTextData', upload, async (req, res) => {
  try {

    if (req.body.locationEnum && parseInt(req.body.locationEnum)) {
      let doc = await TextForWebsite.findOne({ locationEnum: parseInt(req.body.locationEnum) })
      var newItem = {
        textData: req.body.textData,
        locationEnum: parseInt(req.body.locationEnum)
      }
      if (!doc) {
        const newrecord = new TextForWebsite(newItem)
        await newrecord.save();
      } else {
        doc.textData = newItem.textData;
        await doc.save();
      }
    } else {
      throw new Error({ error: 'Location Enum is MUST !!!' })
    }
   
    res.status(200).send({ newItem })

  } catch (error) {
    res.json({ error: error })
  }
});

// Getting text data for website by  locationEnum
route.get('/Get_WebsiteTextDataByLocationEnum/:locationEnum', async (req, res) => {
  try {
    if(!req.params.locationEnum){
      throw new Error({ error: 'Please provide the locationEnum' });
    }
    let textDataforwebsite = await TextForWebsite.findOne({ locationEnum: parseInt(req.params.locationEnum) })
    res.send(textDataforwebsite)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


route.get('/Get_WebsiteTextDataByLocationEnumList', async (req, res) => {
  try {
    const TextForWebsiteList = await TextForWebsite.find()
    res.send(TextForWebsiteList)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




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

route.put('/Update_DoctorProfile/:id', upload, getDoctor, async (req, res) => {
  //Update a existing Doctor with id
  try {
    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {
      const DoctorProfileBeforeChange = await Doctor.findById(req.params.id)
      if(DoctorProfileBeforeChange.newimage){
        newImage = DoctorProfileBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    const doct = await Doctor.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    doct.newimage = newImage;
     await doct.save()
    res.status(200).send({ doct })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


// route.put('/Update_DoctorProfile/:id',upload, getDoctor, async (req, res) => {
//   //Update a existing Doctor with id
//   try {
//     let imageFile=''; 
//     if(req.files && req.files.length){
//       imageFile = req.files[0].filename;
//     } else {
//       const DoctorProfileBeforeChange = await Doctor.findById(req.params.id)
//       imageFile =  DoctorProfileBeforeChange.image;
//     }
//     const doct = await Doctor.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     doct.image = imageFile;
//      await doct.save()
//     res.status(200).send({ doct })
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

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

    // Doctor.updateMany(
    //  //{inActive: undefined}, //optional      
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });
    // Participant.updateMany(
    //   {}, //conditional optional  
    //   { phoneno: "9716342619" },
    //   { upsert: true },
    //   function (err, numberAffected) {
    //     console.log("No of records updated in Patient schema is: ", numberAffected);
    //   });
    // Appointment.updateMany(
    //   { appointmentDate: undefined }, //condition is optional not whole first parameter  
    //   { appointmentDate: '2020/07/29' },
    //   { upsert: true },
    //   function (err, numberAffected) {
    //     console.log("No of records updated in Appointment schema is: ", numberAffected);
    //   });
    // Physio.update(
    //   {},
    //   { phoneno: "9716342619" },
    //   { multi: true },
    //   function (err, numberAffected) {
    //     console.log("No of records updated in Patient schema is: ", numberAffected);
    //   });
    // Nurse.updateMany(
    //  //{inActive: undefined}, //optional
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });
    // Physio.updateMany(
    //  //{inActive: undefined}, //optional
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });
    // Pharmacist.updateMany(
    //  //{inActive: undefined}, //optional
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });
    // LabTechnician.updateMany(
    //  //{inActive: undefined}, //optional
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });
    // Participant.updateMany(
    //   {phoneno: undefined}, //optional
    //   { inActive: false },
    //   function (err, numberAffected) {
    //   });

    const doctors = await Doctor.find({inActive: false})

    res.send(doctors)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Doctor
route.delete('/Delete_Doctor/:id', getDoctor, async (req, res) => {
try {

  let participant = await Participant.findById(res.subscriber.participantID);
  participant.inActive = true;
  await participant.save();

  res.subscriber.inActive =true;
  await res.subscriber.save();
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

route.post('/Save_NewPatientProfileFromBookAppointment', upload, async (req, res) => {
  // Create a new Patient from Book Appointment form and Book Lab Test form
  try {

    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {     
        newImage = {
          data: [],
          contentType: 'image/png'
        }
    }

    const participant = await Participant.findOne({ email: req.body.email });
    if (participant) {
      if (participant.inActive == true) {
        res.status(501).json({ message: 'Already registered account, But Account is InActive currently' })
        return;
      }
    }

    let object = {
      name: req.body.name,
      email: req.body.email,
      phoneno: req.body.phoneno ? req.body.phoneno : '9716342619',
      password: 'test',
      role: 0,
      type: 'Individual',
      description: req.body.description,
      inActive: false
    }
    const user = new Participant(object)
    await user.save()

    const patient = new Patient(req.body)
    patient.participantID = user.id;
    patient.newImage = newImage;
    await patient.save()

    res.status(200).send({ patient })
  } catch (error) {
    res.status(400).send(error)
  }
})

// route.put('/Update_PatientProfile/:id', upload, getPatient, async (req, res) => {
//   // Update a existing Patient with id
//   try {
//     let imageFile = req.files[0].filename;
//     const pat = await Patient.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     pat.image = imageFile;
//      await pat.save()
//     res.send(pat)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

route.put('/Update_PatientProfile/:id', upload, getPatient, async (req, res) => {
  //Update a existing Patient with id
  try {
    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {
      const PatientProfileBeforeChange = await Patient.findById(req.params.id)
      if(PatientProfileBeforeChange.newimage){
        newImage = PatientProfileBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    const pat = await Patient.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    pat.newimage = newImage;
     await pat.save()
    res.status(200).send({ pat })
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
    const patients = await Patient.find({inActive: false})
    res.send(patients)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Patient
route.delete('/Delete_Patient/:id', getPatient, async (req, res) => {
  try {
    let participant = await Participant.findById(res.subscriber.participantID);
    participant.inActive = true;
    await participant.save();
  
    res.subscriber.inActive =true;
    await res.subscriber.save();
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

  // route.put('/Update_PharmacistProfile/:id', upload, getPharmacist, async (req, res) => {
  //   // Update a existing Pharmacist with id
  //   try {
  //     let imageFile = req.files[0].filename;
  //     const pharmacist = await Pharmacist.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
  //     pharmacist.image = imageFile;
  //     await pharmacist.save()
  //     res.send(pharmacist)  
  //   } catch (err) {
  //     res.status(400).json({ message: err.message })
  //   }
  // })

  route.put('/Update_PharmacistProfile/:id', upload, getPharmacist, async (req, res) => {
    //Update a existing Pharmacist with id
    try {
      let imageFile='';    
      var newImage = {};
      if (req.files && req.files.length) {
        imageFile = req.files[0].filename;
        newImage = {
          data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
          contentType: 'image/png'
        }
      } 
      else {
        const PharmacistProfileBeforeChange = await Pharmacist.findById(req.params.id)
        if(PharmacistProfileBeforeChange.newimage){
          newImage = PharmacistProfileBeforeChange.newimage;
        } else {
          newImage = {
            data: [],
            contentType: 'image/png'
          }
        }
      }
      const pharmacist = await Pharmacist.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
      pharmacist.newimage = newImage;
       await pharmacist.save()
      res.status(200).send({ pharmacist })
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
      const pharmacists = await Pharmacist.find({inActive: false})
      res.send(pharmacists)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  // Delete Pharmacist
  route.delete('/Delete_Pharmacist/:id', getPharmacist, async (req, res) => {
  try {
    let participant = await Participant.findById(res.subscriber.participantID);
    participant.inActive = true;
    await participant.save();
  
    res.subscriber.inActive =true;
    await res.subscriber.save();
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

// route.put('/Update_NurseProfile/:id', upload, getNurse, async (req, res) => {
//   // Update a existing Nurse with id
//   try {
//     let imageFile = req.files[0].filename;
//     const nurse = await Nurse.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     nurse.image = imageFile;
//     await nurse.save()
//     res.send(pat)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

route.put('/Update_NurseProfile/:id', upload, getNurse, async (req, res) => {
  //Update a existing Nurse with id
  try {
    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {
      const NurseProfileBeforeChange = await Nurse.findById(req.params.id)
      if(NurseProfileBeforeChange.newimage){
        newImage = NurseProfileBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    const nurse = await Nurse.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    nurse.newimage = newImage;
     await nurse.save()
    res.status(200).send({ nurse })
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
    const nurses = await Nurse.find({inActive: false})
    res.send(nurses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Nurse
route.delete('/Delete_Nurse/:id', getNurse, async (req, res) => {
try {
  let participant = await Participant.findById(res.subscriber.participantID);
  participant.inActive = true;
  await participant.save();

  res.subscriber.inActive =true;
  await res.subscriber.save();
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

// route.put('/Update_PhysioProfile/:id', upload, getPhysio, async (req, res) => {
//   // Update a existing Physio with id
//   try {
//     let imageFile = req.files[0].filename;
//     const physio = await Physio.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     physio.image = imageFile;
//     await physio.save()
//     res.send(pat)
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

route.put('/Update_PhysioProfile/:id', upload, getPhysio, async (req, res) => {
  //Update a existing Physio with id
  try {
    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {
      const PhysioProfileBeforeChange = await Physio.findById(req.params.id)
      if(PhysioProfileBeforeChange.newimage){
        newImage = PhysioProfileBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    const physio = await Physio.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    physio.newimage = newImage;
     await physio.save()
    res.status(200).send({ physio })
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
    const physios = await Physio.find({inActive: false})
    res.send(physios)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete Physio
route.delete('/Delete_Physio/:id', getPhysio, async (req, res) => {
try {
  let participant = await Participant.findById(res.subscriber.participantID);
  participant.inActive = true;
  await participant.save();

  res.subscriber.inActive =true;
  await res.subscriber.save();
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


// route.put('/Update_LabTechnicianProfile/:id', upload, getLabTechnician, async (req, res) => {
//   //Update a existing LabTechnician with id
//   try {
//     let imageFile = req.files[0].filename;
//     const labtech = await LabTechnician.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
//     labtech.image = imageFile;
//     await labtech.save()
//     res.send(labtech)    
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

route.put('/Update_LabTechnicianProfile/:id', upload, getLabTechnician, async (req, res) => {
  //Update a existing LabTechnician with id
  try {
    let imageFile='';    
    var newImage = {};
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } 
    else {
      const LabTechnicianProfileBeforeChange = await LabTechnician.findById(req.params.id)
      if(LabTechnicianProfileBeforeChange.newimage){
        newImage = LabTechnicianProfileBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    const labtech = await LabTechnician.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    labtech.newimage = newImage;
     await labtech.save()
    res.status(200).send({ labtech })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one LabTechnician profile
route.get('/Get_LabTechnicianProfile/:id', getLabTechnician, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

route.get('/Get_LabTechniciansList', async (req, res) => {
  try {
    const labtechnicians = await LabTechnician.find({inActive: false})
    res.send(labtechnicians)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete LabTechnician
route.delete('/Delete_LabTechnician/:id', getLabTechnician, async (req, res) => {
  try {
    let participant = await Participant.findById(res.subscriber.participantID);
    participant.inActive = true;
    await participant.save();
  
    res.subscriber.inActive =true;
    await res.subscriber.save();
    res.json({ message: "LabTechnician Deleted successfully "})
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
      subscri = await PatientMedicinesForHomeDelivery.findOne({appointmentID: req.body.appointmentId})
      
      subscri.isPharmacyProvided = true;
      const updatedSubscri = await subscri.save();

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

//Get my(doctor) appointments list by doctor's id (now docid coming in body, not in param but API name is not changed.)
route.post('/Get_AppointmentsByDocID', getFilteredDoctorAppointments, async (req, res) => {
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
      subscriber = await Appointment.find({ doctorID: req.body.doctorID }).sort({ patientNname: 1 });
    } else if (req.body.sortBy && req.body.sortBy == "patientNname" && req.body.sortDir == 'asc') {
      subscriber = await Appointment.find({ doctorID: req.body.doctorID }).sort({ patientNname: -1 });
    } else if (req.body.sortBy && req.body.sortBy == "doctorName" && req.body.sortDir == 'desc') {
      subscriber = await Appointment.find({ doctorID: req.body.doctorID }).sort({ doctorName: 1 });
    } else if (req.body.sortBy && req.body.sortBy == "doctorName" && req.body.sortDir == 'asc') {
      subscriber = await Appointment.find({ doctorID: req.body.doctorID }).sort({ doctorName: -1 });
    } else if (req.body.doctorID && req.body.doctorID != '' && req.body.appointmentDate && req.body.appointmentDate != '') {
      subscriber = await Appointment.find({ doctorID: req.body.doctorID, appointmentDate: req.body.appointmentDate });
    } else {
      subscriber = await Appointment.find({ doctorID: req.body.doctorID });
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

route.post('/Save_Medicine', upload, async (req, res) => {
  // Create a new Medicines
  try {

    let imageFile = '';
    var newImage = {};
    // if req contain image
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } else {
      newImage = {
        data: [],
        contentType: 'image/png'
      }
    }

    const medicine = new Medicine(req.body)
    medicine.newimage = newImage;
    await medicine.save()
    res.status(200).send({ medicine })
  } catch (error) {
    res.status(400).send(error)
  }
})

route.put('/Update_Medicine/:id', upload, getMedicine, async (req, res) => {
  //Update an existing Medicine with id
  try {
    let imageFile = '';
    var newImage = {};
    let medicine;

    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    }
    else {
      const MedicineBeforeChange = await Medicine.findById(req.params.id)
      if (MedicineBeforeChange.newimage) {
        newImage = MedicineBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }

    medicine = await Medicine.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    medicine.newimage = newImage;
    await medicine.save()
    res.status(200).send({ medicine })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one medicine profile
route.get('/Get_Medicine/:id', getMedicine, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getMedicine(req, res, next) {
  let subscriber
  try {
    subscriber = await Medicine.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" })
    }
  } catch (err) {
  }
  res.subscriber = subscriber
  next()
}

// Delete Medicine
route.delete('/Delete_Medicine/:id', getMedicine, async (req, res) => {
  try {
      await res.subscriber.remove()
      res.json({ message: "Medicine Deleted successfully "})
  } catch (err) {
      res.status(500).json({ message: err.message })
  }
  })

// Getting all diseases
route.get('/Get_MedicinesList/:companyName?', async (req, res) => {

  try {

    let medicines;
    if(req.params.companyName!=undefined){
      medicines = await Medicine.find({companyName: req.params.companyName});
    } else{
      medicines = await Medicine.find()
    }

    res.send(medicines)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})



//Get my(phamacist) pharmacy request list by phamacist's id (now converted into post request)
route.post('/Get_PharmaReqForHomeDel', getFilteredPharmacyReq, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


async function getFilteredPharmacyReq(req, res, next) {
  let subscriber
  try {
    if (req.body.doctorID && req.body.doctorID != '' ) {
      subscriber = await PatientMedicinesForHomeDelivery.find({doctorID: req.body.doctorID});
    } else if (req.body.patientID && req.body.patientID != '' ) {
      subscriber = await PatientMedicinesForHomeDelivery.find({patientID: req.body.patientID});
    } else if (req.body.pharmacistID && req.body.pharmacistID != '' ) {
      subscriber = await PatientMedicinesForHomeDelivery.find({pharmacistID: req.body.pharmacistID});
    }
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" })
    }
  } catch (err) {
  }
  res.subscriber = subscriber
  next()
}

///////////

//Get my(patient) appointments list by patient's id and now all patients appointments case for admin now added
route.get('/Get_AppointmentsByPatientID/:patientID?', getFilteredPatientAppointments, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getFilteredPatientAppointments(req, res, next){
  let subscriber 
  try{
    if(req.params.patientID != undefined){
      subscriber = await Appointment.find({patientID: req.params.patientID});
    } else {
      subscriber = await Appointment.find();
    }

      if (subscriber == null){
          return res.status(404).json({message: "Cannot find subscriber" })
      }
  } catch(err){
  }
  res.subscriber = subscriber
  next()
}


route.post('/Save_LabTest', upload, async (req, res) => {
  // Create a new LabTest
  try {

    let imageFile = '';
    var newImage = {};
    // if req contain image
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } else {
      newImage = {
        data: [],
        contentType: 'image/png'
      }
    }

    let labtest = new LabTest(req.body);
    labtest.newimage = newImage;
    await labtest.save()
    res.status(200).send({ labtest })
  } catch (error) {
    res.status(400).send(error)
  }
})

route.put('/Update_LabTest/:id', upload, getLabTest, async (req, res) => {
  //Update an existing LabTest with id
  try {
    let imageFile = '';
    var newImage = {};
    let labtest;

    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    }
    else {
      const LabTestBeforeChange = await LabTest.findById(req.params.id)
      if (LabTestBeforeChange.newimage) {
        newImage = LabTestBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }

    labtest = await LabTest.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    labtest.newimage = newImage;
    await labtest.save()
    res.status(200).send({ labtest })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

async function getLabTest(req, res, next) {
  let subscriber
  try {
    subscriber = await LabTest.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" })
    }
  } catch (err) {
  }
  res.subscriber = subscriber
  next()
}

// Get one LabTest 
route.get('/Get_LabTest/:id', getLabTest, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
  



// Getting all lab tests
route.get('/Get_LabTestsList', async (req, res) => {
  try {
    const labtests = await LabTest.find()
    res.send(labtests)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




route.post('/Save_LabTestsPackage', upload, async (req, res) => {
  // Create a new LabTestPackage
  try {

    let imageFile = '';
    var newImage = {};
    // if req contain image
    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    } else {
      newImage = {
        data: [],
        contentType: 'image/png'
      }
    }
    req.body.testsData = JSON.parse(req.body.testsData);
    let labtestpackage = new LabTestsPackage(req.body);
    labtestpackage.newimage = newImage;
    await labtestpackage.save()
    res.status(200).send({ labtestpackage })
  } catch (error) {
    res.status(400).send(error)
  }
})

route.put('/Update_LabTestsPackage/:id', upload, getLabTestPackage, async (req, res) => {
  //Update an existing LabTestPackage with id
  try {
    let imageFile = '';
    var newImage = {};
    let labtestpackage;

    if (req.files && req.files.length) {
      imageFile = req.files[0].filename;
      newImage = {
        data: fs.readFileSync(path.join('./public/uploads/' + imageFile)),
        contentType: 'image/png'
      }
    }
    else {
      const LabTestsPackageBeforeChange = await LabTestsPackage.findById(req.params.id)
      if (LabTestsPackageBeforeChange.newimage) {
        newImage = LabTestsPackageBeforeChange.newimage;
      } else {
        newImage = {
          data: [],
          contentType: 'image/png'
        }
      }
    }
    req.body.testsData = JSON.parse(req.body.testsData);
    labtestpackage = await LabTestsPackage.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
    labtestpackage.newimage = newImage;
    await labtestpackage.save()
    res.status(200).send({ labtestpackage })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get one LabTestsPackage 
route.get('/Get_LabTestsPackage/:id', getLabTestPackage, async (req, res) => {
  try {
    res.send(res.subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
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
route.get('/Get_LabTestsPackageList', async (req, res) => {
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
route.get('/Get_DoctorWiseApptCount/:patientID?', getFilteredPatientAppointments, async (req, res) => {
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


route.post('/payment/creteOrder', async (req, res) => {
  // Create a new LabTest
  try {
    let options = {
      amount: req.body.amount * 100,
      currency: req.body.currency,
      receipt: req.body.receipt
    }
    razorpayInstance.instance.orders.create(options, function (razor_error, order) {

      if (razor_error) {
        console.log("razor error", razor_error)

        res.status(417).json({
          message: razor_error.message,
          payload: null,
          error: "Razorpay order creation unsuccessful"
        })
        return

      } else {
        res.status(200).json({
          message: 'Order created successfully',
          payload: order,
          error: null
        })
      }
    });

  } catch (error) {
    res.status(400).send(error)
  }
})

route.post('/payment/verify', async (req, res) => {
  // Create a new LabTest
  try {
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id; 
    var expectedSignature = crypto.createHmac('sha256','9oad02hYU3YABqDfrd3msZfW')
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("rec sign: ",req.body.razorpay_signature);
                                  console.log("exp sign: ",expectedSignature);

    razorpayInstance.instance.payments.fetch(req.body.razorpay_payment_id, async (razor_error, paymentDetails) => {

      if (razor_error) {
        console.log("razor error", razor_error)
        res.status(417).json({
          message: razor_error.message,
          payload: null,
          error: `Razorpay payment fetching failed for PaymentId: ${req.body.razorpay_payment_id}`
        })
        return

      } else {
        var razorpayPayment = new RazorpayPayments()
        razorpayPayment.id = paymentDetails.id
        razorpayPayment.entity = paymentDetails.entity
        razorpayPayment.amount = paymentDetails.amount
        razorpayPayment.currency = paymentDetails.currency
        razorpayPayment.status = paymentDetails.status
        razorpayPayment.order_id = paymentDetails.order_id
        razorpayPayment.invoice_id = paymentDetails.invoice_id
        razorpayPayment.international = paymentDetails.international
        razorpayPayment.method = paymentDetails.method
        razorpayPayment.amount_refunded = paymentDetails.amount_refunded
        razorpayPayment.refund_status = paymentDetails.refund_status
        razorpayPayment.captured = paymentDetails.captured
        razorpayPayment.description = paymentDetails.description
        razorpayPayment.card_id = paymentDetails.card_id
        razorpayPayment.bank = paymentDetails.bank
        razorpayPayment.wallet = paymentDetails.wallet
        razorpayPayment.vpa = paymentDetails.vpa
        razorpayPayment.email = paymentDetails.email
        razorpayPayment.contact = paymentDetails.contact
        razorpayPayment.notes = paymentDetails.notes
        razorpayPayment.fee = paymentDetails.fee
        razorpayPayment.tax = paymentDetails.tax
        razorpayPayment.error_code = paymentDetails.error_code
        razorpayPayment.error_description = paymentDetails.error_description
        razorpayPayment.created_at = paymentDetails.created_at
        ///////
        razorpayPayment.paymentTypeEnumKey = req.body.paymentTypeEnumKey
        razorpayPayment.paymentTypeEnumValue = req.body.paymentTypeEnumValue
        razorpayPayment.localUIOrderID = req.body.localUIOrderID
        razorpayPayment.patientEmail = req.body.patientEmail
        await razorpayPayment.save();



        if (req.body.paymentTypeEnumKey == 1) {
          let appt = await Appointment.findById(req.body.localUIOrderID)
          appt.paymentID = razorpayPayment.id;//req.body.razorpay_payment_id
          appt.isPaymentDone = true;
          await appt.save();
        } else if (req.body.paymentTypeEnumKey == 2) {
          let booklabtest = await BookLabTest.findById(req.body.localUIOrderID)
          booklabtest.paymentID = razorpayPayment.id;
          booklabtest.isPaymentDone = true;
          await booklabtest.save();
        }


        if (req.body.razorpay_signature == expectedSignature) {

          res.status(200).json({ message: 'Signature Verified !!!' })
        } else {
          res.status(401).json({ message: 'OOPS !!! Signature not verified' })
          return;
        }


      }
    });


  } catch (error) {
    res.status(400).send(error)
  }
})

// Get all payments list from local schema
route.get('/Get_PaymentLists/:paymentTypeEnumKey?', async (req, res) => {
  try {
    let razorpayPayments;
    if(req.params.paymentTypeEnumKey!=undefined){
      razorpayPayments = await RazorpayPayments.find({paymentTypeEnumKey: req.params.paymentTypeEnumKey});
    } else {
      razorpayPayments = await RazorpayPayments.find();
    }
    res.send(razorpayPayments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


//////////////////////////

route.post('/Save_AddtoCart',  async (req, res) => {
  // Create a new cart details
  try {    
      const cartdetail = new CartDetails(req.body)
      await cartdetail.save()
      res.status(200).send({ cartdetail })
  } catch (error) {
      res.status(400).send(error)
  }
})

// Get one user cart details
route.get('/Get_CartDetails/:userId', async (req, res) => {
  try {
    let subscriber = await CartDetails.find({userId: req.params.userId});
    res.send(subscriber)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Remove one user cart details
route.delete('/RemoveCartDetails/:userId?/:itemID?', getCart, async (req, res) => {
  try {
    
    await res.subscriber.remove()
    res.json({ message: "Item Deleted successfully for userId "+ req.params.userId})
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getCart(req, res, next) {
  let subscriber
  try {
    if(req.params.userId!=undefined && req.params.itemID!=undefined){
      subscriber = await CartDetails.find({userId: req.params.userId, itemID: req.params.itemID});
    } else {
      subscriber = await CartDetails.find({userId: req.params.userId});
    }

    if (subscriber == null) {
      return res.status(404).json({ message: "Cannot find subscriber" })
    }
  } catch (err) {
  }
  res.subscriber = subscriber
  next()
}






/////////////////////////



route.post('/users', async (req, res) => {
  // Create a new user


  try {
    const participant = await Participant.findOne({ email:req.body.email });
    if (participant) {
      if (participant.inActive == true) {        
        res.status(501).json({ message: 'Already registered account, But Account is InActive currently'})
        return;
      }
    }


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
        phoneno: req.body.phoneno, 
        gender: req.body.gender,
        participantID: user.id,          
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

    const participant = await Participant.findOne({ email: req.body.email })
    if (!participant) {
      return res.status(401).send({ error: 'Email does not exist!!!' })
    } else if (participant.inActive == true) {
      res.status(401).json({ message: 'Login failed! This is an InActive Account !! To Deactivate, register with same credentials' })
      return;
    }

    const user = await Participant.findByCredentials(email, password)
    if (!user) {
      res.status(401).json({ message: 'Login failed! Check authentication credentials' })
      return;
    }
    let roleBaseId;
    const participantID = user.id;

    if (user.role < 1) {
      const patient = await Patient.findOne({ participantID });
      roleBaseId = patient.id;
    } else if (user.role == 1) {
      const doc = await Doctor.findOne({ participantID });
      roleBaseId = doc.id;
    } else if (user.role == 2) {
      const nurse = await Nurse.findOne({ participantID });
      roleBaseId = nurse.id;
    } else if (user.role == 3) {
      const physio = await Physio.findOne({ participantID });
      roleBaseId = physio.id;
    } else if (user.role == 4) {
      const pharmacist = await Pharmacist.findOne({ participantID });
      roleBaseId = pharmacist.id;
    } else if (user.role == 5) {
      const labtechician = await LabTechnician.findOne({ participantID });
      roleBaseId = labtechician.id;
    } else if (user.role == 11) {
      const admin = await Admin.findOne({ participantID });
      roleBaseId = admin.id;
    }
    const token = await user.generateAuthToken()
    res.send({ user, roleBaseId, token })
  } catch (error) {
    res.status(400).send(error)
  }

})

route.post('/users/changePassword', async (req, res) => {
  //Change password of current logged in registered user
  try {
    let email = req.body.email;
    let password = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    const user = await Participant.findByCredentials(email, password)
    if (req.body.oldPassword == req.body.newPassword) {
      return res.status(401).send({ error: 'New password must be different from Old password' })
    }
    else if (!user) {
      return res.status(401).send({ error: 'Username or Password Wrong!!! Check authentication credentials' })
    }
    user.password = newPassword;
    await user.save();
    res.send({ user })
  } catch (error) {
    res.status(400).send(error)
  }

})

route.post('/users/forgotPassword', async (req, res) => {
  //Change password of current logged in registered user
  try {
    let email = req.body.email;
    let newPassword = req.body.newPassword;
    const user = await Participant.findOne({ email:req.body.email })
     if (!user) {
      return res.status(401).send({ error: 'Email does not exist!!!' })
    }
    user.password = newPassword;
    if(req.body.isActivationRequired && req.body.isActivationRequired==true){
      if(user.inActive==true){
        user.inActive = false;

        if(user.role < 1){        
          const patient = await Patient.findOne({ participantID: user._id });
           patient.inActive = false;
           await patient.save();
        }else if(user.role==1){
          const doc = await Doctor.findOne({ participantID: user._id });
          doc.inActive = false;
           await doc.save();
        }else if(user.role==2){        
          const nurse = await Nurse.findOne({ participantID: user._id });
          nurse.inActive = false;
          await nurse.save();
        }else if(user.role==3){        
          const physio = await Physio.findOne({ participantID: user._id });
          physio.inActive = false;
           await physio.save();
        }else if(user.role==4){        
          const pharmacist = await Pharmacist.findOne({ participantID: user._id });
          pharmacist.inActive = false;
           await pharmacist.save();
        }else if(user.role==5){        
          const labtechician = await LabTechnician.findOne({ participantID: user._id });
          labtechician.inActive = false;
           await labtechician.save();
        }else if(user.role==11){        
          const admin = await Admin.findOne({ participantID: user._id });
          admin.inActive = false;
           await admin.save();
        }

      }
    }
    await user.save();
    res.send({ user })
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
    }else if (req.user.role == 11) {
      const adminid = req.user.id
      //const admin = await Admin.findOne({ docid });
      const admin = await Admin.findOne({ participantID: adminid });
      roleBaseId = admin.id;
      user = admin;
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
