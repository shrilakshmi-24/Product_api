const User=require('./userModel')
module.exports=(sequelize,DataTypes)=>{
    const Product= sequelize.define("product",{
       
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        description:{
            type:DataTypes.TEXT,
        },
        price:{
           type: DataTypes.INTEGER,
             allowNull:false

         },
         published:{
            type:DataTypes.BOOLEAN,
            default:false
         },
         img:{
            type: DataTypes.ARRAY(DataTypes.TEXT)

         },
         rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
              min: 1,
              max: 5
            }
          },
          
         category:{
            type: DataTypes.STRING,
             allowNull:false
         },
         createdby:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:User,
                key:"id"
            }
        },

       
         
       
    
    })
    
    return Product
}



