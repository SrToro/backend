const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Product = require('./models/product');
const User = require('./models/user');
const Appointment = require('./models/appointment');
const Barber = require('./models/barber');
const HairCut = require('./models/hairCut');
const PurchaseOrder = require ('./models/purchaseOrder')

var cors = require('cors');

var app = express()

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Product{
            _id: ID!
            code: Float!
            name: String!
            description: String!
            price: Float!
            stock: Float!
            img: String!
        }

        type PurchaseOrder{
            _id: ID!
            user: User!
            products: Product!
            quantity: Float!
        }

        type User{
            _id: ID!
            name: String!
            email: String!
            password: String
            phoneNumber: Float!
            tipo: String
            appointments: [Appointment]
            purchaseOrder:[PurchaseOrder]
        }

        type Barber{
            _id: ID!
            name: String!
            correo: String!
            tel: Float!
            imag: String!
            appointments: [Appointment!]!
        }

        type Appointment{
            _id: ID!
            date: String!
            appointmentCreator: User!
            hairCutSelected: HairCut!
            barberSelected: Barber!
            hour: Float!
        }

        type HairCut{
            _id: ID!
            name: String!
            price: Float!
            time: Float!
            imag: String! 
        }

        input ProductInput {
            code: Float!
            name: String!
            description: String!
            price: Float!
            stock: Float!
            img: String!
        }

        input UserInput{
            name: String!
            email: String!
            password: String!
            phoneNumber: Float!
            tipo: String!
        }

        input BarberInput{
            name: String!
            correo: String!
            tel: Float!
            imag: String!
        }

        input HairCutInput{
            name: String!
            price: Float!
            time: Float!
            imag: String!
        }

        input AppointmentInput{
            user:String!
            date: String!
            hairCut: String!
            barber: String!
            hour: Float!
        }

        type RootQuery{
            getProducts: [Product!]!
            getUser(email: String!): User!
            getBarber(_id: ID!): Barber!
            getAppointment(_id: ID!): Appointment!
            getHairCut(_id: ID!): HairCut!
            getProduct(_id: ID!): Product!
            getHaircuts: [HairCut!]!
            getBarbers: [Barber!]!
            authUser(
                email: String
                password: String ): Boolean!

            findUser(
                email: String ): Boolean!
        }

        type RootMutation{
            createProduct(productInput: ProductInput ): Product
            createUser(userInput: UserInput): User
            createBarber(barberInput: BarberInput): Barber
            createHairCut(hairCutInput: HairCutInput): HairCut
            createAppointment(appointmentInput: AppointmentInput): Appointment
            addAppointment(appointmentInput: AppointmentInput): Boolean
            addPurchaseOrder(
                user: String!
                product: String!
                quantity: Float! ): Boolean
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }

        

    `),
    rootValue: {

        //GETTERS

        // auth user
        authUser: args =>{
            return User.findOne({email: args.email})
            .then(user =>{
                console.log(user)
                if(!user){
                    return false;
                }

                if(user.password !== args.password){
                    return false;
                }
                return true;
            })
            .catch(err =>{
                throw err;
            })
        },

        findUser: args =>{
            return User.findOne({email: args.email})
            .then(user =>{
                console.log(user)
                if(!user){
                    return false;
                }

                return true;
            })
            .catch(err =>{
                throw err;
            })
        },
        
        // get productos
        getProducts:()=>{
            return Product.find().then(products => {
                return products.map(products => {
                    return {...products._doc};
                })
            }).catch(err =>{
                throw err;
            });
        },

        //get producto
        getProduct: args =>{
            return Product.findOne({_id: args._id})
            .then(product =>{
                console.log(product)
                if(!product){
                    throw new Error('El producto no existe.');
                }
                return {...product._doc,_id: product._id.toString()}
                
            })
            .catch(err=>{
                console.log('metodo no funciona')
                throw err;
            })
        },

        //get Usuario
        getUser: args =>{
            return User.findOne({email: args.email})
            .then(user =>{
                console.log(user)
                if(!user){
                    throw new Error ('El usuario no existe.');
                } 
                return {...user._doc,
                    _id: user._doc.toString(),
                    appointments: () =>{
                        return Appointment.find({'_id': user.appointments})
                        .then(appointments => {
                            console.log("fasdfads")
                            console.log(appointments)
                            return appointments.map(appointment =>{
                                console.log(appointment)
                                return {...appointment._doc,
                                        _id: appointment._id.toString(),
                                        barberSelected: () =>{
                                            return Barber.findById(appointment.barberSelected).
                                            then(barber => {
                                                    console.log(barber)
                                                    return {...barber._doc}
                                            })
                                        },
                                        hairCutSelected: () =>{
                                            return HairCut.findById(appointment.hairCutSelected).
                                            then(haircut => {
                                                    console.log(haircut)
                                                    return {...haircut._doc}
                                            })
                                        }
                                    };
                            })
                        })
                    },
                    purchaseOrder: () =>{
                        return PurchaseOrder.find({'_id': user.purchaseOrder}).
                        then(purchaseOrder => {
                            console.log(purchaseOrder)
                            return purchaseOrder.map(purchaseOrderAux =>{
                                console.log(purchaseOrderAux)
                                return {...purchaseOrderAux._doc,
                                    _id: purchaseOrderAux._id.toString(),
                                    products: () =>{
                                        return Product.findById(purchaseOrderAux.products).
                                        then(product => {
                                                console.log(product)
                                                return {...product._doc}
                                        })
                                    }

                                };
                            })
                        })
                    }

                }
            })
            .catch(err =>{
                throw err;
            })
        },


        //get Barbero
        getBarber: args =>{
            return Barber.findOne({_id: args._id}).then(barber =>{
                console.log(barber)
                if(!barber){
                    throw new Error ('El barbero no existe.');
                } 
                return {...barber._doc,_id: barber._doc._id.toString()}
            })
            .catch(err =>{
                throw err;
            })
        },

        //get Barberos
        getBarbers:()=>{
            return Barber.find().then(barbers => {
                return barbers.map(barbers => {
                    return {...barbers._doc};
                })
            }).catch(err =>{
                throw err;
            });
        },

        //get cortes de cabello
        getHaircuts:()=>{
            return HairCut.find().then(haircuts => {
                return haircuts.map(haircuts => {
                    return {...haircuts._doc};
                })
            }).catch(err =>{
                throw err;
            });
        },

        //get Corte de Cabello
        getHairCut: args =>{
            return HairCut.findOne({_id: args._id}).then(haircut =>{
                console.log(haircut)
                if(!haircut){
                    throw new Error ('El corte de cabello no existe.');
                } 
                return {...haircut._doc,_id: haircut._doc._id.toString()}
            })
            .catch(err =>{
                throw err;
            })
        },

        //get Cita
        getAppointment: args =>{
            return Appointment.findOne({_id: args._id}).then(appointment =>{
                console.log(appointment)
                if(!appointment){
                    throw new Error ('La cita no existe.');
                }
                console.log('la cita funciona') 
                return {...appointment._doc,_id: appointment._doc._id.toString(),
                    appointmentCreator: () =>{
                        const appointmentsCreator = User.findById(appointment.appointmentCreator);
                        return appointmentsCreator
                    },
                    barberSelected: ()=>{
                        const barberSelected = Barber.findById(appointment.barberSelected)
                        return barberSelected
                    },
                    hairCutSelected: ()=>{
                        const hairCutSelected = HairCut.findById(appointment.hairCutSelected)
                        return hairCutSelected
                    }
                }
            })
            .catch(err =>{
                throw err;
            })

        },

        // CREATE

        //crear Producto
        createProduct: args =>{
        const product = new Product({
            code: +args.productInput.code,
            name: args.productInput.name,
            description: args.productInput.description,
            price: +args.productInput.price,
            stock: +args.productInput.stock,
            img: args.productInput.img
        });
           return product.save().then(result =>{
               console.log(result);
               return {...result._doc};
           }).catch(err =>{
               console.log(err);
               throw err;
           });
           
        },

        //Crear Usuario
        createUser: args =>{
            return User.findOne({email:args.userInput.email}).then(user =>{
                if(user){
                    throw new Error ('El usuario ya existe.')
                }
                return args.userInput.password;
            })
            .then(password =>{
                const user = new User({
                    name: args.userInput.name,
                    email: args.userInput.email,
                    password: password,
                    phoneNumber: +args.userInput.phoneNumber,
                    tipo: args.userInput.tipo,
                    

                });
                return user.save();
            }).then(result =>{
                console.log(result);
                return {...result._doc,_id:result.id};
            })
            .catch(err =>{
                throw err;
            });
            
        },

        //create Barbero
        createBarber: args =>{
            return Barber.findOne({correo: args.barberInput.correo})
            .then(barber =>{
                if(barber){
                    throw new Error ('El barbero ya existe.')
                }
            })
            .then(() =>{
                const barber = new Barber({
                    name: args.barberInput.name,
                    correo: args.barberInput.correo,
                    tel: +args.barberInput.tel,
                    imag: args.barberInput.imag
                });
                return barber.save();
            })
            .then(result =>{
                console.log(result);
                return {...result._doc,_id:result.id};
            })
            .catch(err =>{
                throw err ;
                
            });
        },

        //crear Corte de Cabello
        createHairCut: args =>{
            return HairCut.findOne({name: args.hairCutInput.name})
            .then(hairCut =>{
                
                if(hairCut){
                    throw new Error ('El Corte de cabello ya existe.')
                }
            })
            .then(() =>{
                const hairCut = new HairCut({
                    name: args.hairCutInput.name,
                    price: +args.hairCutInput.price,
                    time: +args.hairCutInput.time,
                    imag: args.hairCutInput.imag
                });
                return hairCut.save();
            })
            .then(result =>{
                console.log(result);
                return {...result._doc,_id:result.id};
            })
            .catch(err =>{
                throw err ;
                
            });
        },

        //add Cita
        addAppointment:args =>{
            return User.findOne({email:args.appointmentInput.user})
            .then(user=>{
                console.log(user)
                if(!user){
                    throw new Error ('El usuario no existe.')
                }
                return Barber.findOne({_id: args.appointmentInput.barber})
                .then(barber =>{
                    console.log(barber)
                    if(!barber){
                        throw new Error('El barbero no se encuentra')
                    }
                    return HairCut.findOne({_id:args.appointmentInput.hairCut})
                    .then(haircut=>{
                        console.log(haircut)
                        if(!haircut){
                            throw new Error('El corte no se encuentra')
                        }
                        const appointment = new Appointment({
                            date: new Date(args.appointmentInput.date),
                            appointmentCreator: user._id,
                            hairCutSelected: haircut._id,
                            barberSelected: barber._id,
                            hour: +args.appointmentInput.hour
                        });
                        appointment.save();
                        
                        barber.appointments.push(appointment);
                        barber.save();
                        
                        user.appointments.push(appointment);
                        user.save();
                        return true
                    })
                })
            })
            .catch(err=>{
                console.log(err);
                throw err;
            })
        },

        //add productos
        addPurchaseOrder: args =>{
            console.log(args.product)
            return User.findOne({email:args.user})
            .then(user=>{
                if(!user){
                    throw new Error('El usuario no se encuentra.')
                }

                return Product.findOne({_id:args.product})
                .then(product => {
                    if(!product){
                        throw new Error('El producto no se encuentra')
                    }
                    const purchaseOrder = new PurchaseOrder({
                        user: user._id,
                        products: product._id,
                        quantity: +args.quantity
                    });
                    console.log(purchaseOrder)

                    purchaseOrder.save()
                    user.purchaseOrder.push(purchaseOrder)

                    user.save();
                    product.stock = product.stock - args.quantity;
                    product.save()
                    
                    

                    return true
                        
                    
                })  
            })
            .catch(err=>{
                console.log(err);
                throw err;
            })
        },
    },

    graphiql: true
}));


mongoose.connect('mongodb://localhost/databaseLC',{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=>{
    app.listen(3000);
    console.log('db connected');
}).catch(err =>{
    console.log(err);
    console.log('db not connected');
})

