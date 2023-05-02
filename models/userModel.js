
module.exports=(sequelize,DataTypes)=>{
    const User= sequelize.define("User",{
       id:{
        type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true
            
       },
        u_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        role:{
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user'
        }

    })
    return User
}