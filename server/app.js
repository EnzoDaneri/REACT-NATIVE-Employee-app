const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./Employee');


app.use( bodyParser.json() );


const Employee = mongoose.model( 'employee' );


const mongoUri = 'mongodb+srv://enzo83:Qgvgrnb9yOCaV14R@cluster0.rxzdm.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo yeaaa!!!');
    
})


mongoose.connection.on('error', (err) => {
    console.log('error', err);
    
})


//Routes

app.get('/', ( req, res ) => {
   Employee.find({})
   .then(data => {
       res.send(data)
   })
   .catch(err => {
    console.log(err);
  });
});




app.post('/send-data', (req, res) => {
   const employee = new Employee({
       name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       salary: req.body.salary,
       position: req.body.position,
       picture: req.body.picture  
   });

     employee.save()
     .then(data => {
         console.log(data);
         res.send(data);
     }).catch(err => {
         console.log(err);
         
     });
 
})


app.delete('/delete', (req, res) => {
    Employee.findByIdAndRemove( req.body.id )
    .then(data => {
        console.log(data)
        res.send(data)
        
    })
    .catch(err => {
        console.log(err);
        
    })
})



app.put('/update', (req, res) => {
    Employee.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        salary: req.body.salary,
        position: req.body.position,
        picture: req.body.picture  
    })
    .then(data => {
        console.log(data)
        res.send(data)
        
    })
    .catch(err => {
        console.log(err);
        
    })
   
})





app.listen(3000, () => {
  console.log('Server running');
  
}); 


// "name": "Enzo",
// "position": "Full Stack",
// "email": "enzo@gmail.com",
// "phone": "1234567",
// "salary": "100.000",
// "picture": "someurl"  