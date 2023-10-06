// db.js
require('dotenv/config');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB :c', error);
    process.exit(1); // Encerrar o aplicativo em caso de erro na conexão
  }
};

module.exports = connectDB;
