const jwt = require('jsonwebtoken');
const db = require('../models');
const User=db.users
const Product=db.products
const logger=require('./logger')

async function getUserNameFromJwt(token) {
    console.log(token)
  const decodedToken = jwt.decode(token);
  
  if (!decodedToken) {
    throw new Error('Invalid JWT token');
  }
    return decodedToken;
}

const authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    logger.info("unauthorized access")
    return res.status(401).send('Unauthorized Access');
    
  }
  const token = authHeader.substring(7);
  try {
    const username = await getUserNameFromJwt(token);
    console.log(username)
    // const user = await User.findOne({ where: { u_name: username.u_name} });
    if (username.id==Product.createdby) {
      console.log(username.id)
      logger.info("unauthorized access")
      return res.status(401).send('Unauthorized access');
    }
    // if (user.role !== 'admin') {
    //   logger.info("forbidden aaccess")
    //   return res.status(403).send('Forbidden access');
    // }
    next();
  } catch (err) {
    console.error(err);
    logger.error(err.message)
    return res.status(401).send('Someting went wrong');
  }
};

module.exports = authorization;

