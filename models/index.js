const dbConfig=require('../config/dbConfig.js')

const {Sequelize,DataTypes}=require('sequelize')

const sequelize=new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false
    }
)

sequelize.authenticate()
.then(()=>{
    console.log('connected')
})
.catch((err)=>{
    console.log('Error',err)
})

const db={

}

db.Sequelize=Sequelize
db.sequelize=sequelize

db.users=require('./userModel.js')(sequelize,DataTypes)
db.products=require('./productModel.js')(sequelize,DataTypes)


db.sequelize.sync({force:false})//not to loose data

.then(()=>console.log('resync done'))

module.exports=db