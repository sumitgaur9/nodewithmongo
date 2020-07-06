const express = require('express');
const mongoose = require('mongoose');
const User = require('../DB/User');
const Participant = require('../DB/Participant');

const route = express.Router();
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

// // // Registration 
// route.post('/users', async (req, res) => {
//   const { fullname, email, mobile, role } = req.body;
//   let participant = {};
//   participant.fullname = fullname;
//   participant.email = email;
//   participant.moblie = mobile;
//   participant.password = password;
//   let participantModel = new Participant(participant);
//   await participantModel.save();
//   res.json(participantModel);
// });

route.post('/users', async (req, res) => {
  // Create a new user
  try {
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

// Getting all
route.get('/', async (req, res) => {
  try {
      const users = await User.find()
      res.send(users)
  } catch (err){
      res.status(500).json({ message: erro.message})
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
