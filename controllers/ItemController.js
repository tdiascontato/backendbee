/*const fs = require('fs');
const path = require('path');*/
const mongoose = require("mongoose");
const Item = require("../models/Item");
const User = require("../models/User");

class ItemController {

  async index(req, res) {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Internal server error.' });
    }
  }
  
  async searchItem(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findById(id);
  
      if (!item) {
        return res.status(404).json({ Error: 'Item não encontrado.' });
      }
  
      res.status(200).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: 'Internal server error.' });
    }
  }
  
  
  async create(req, res) {
    try {
      const { code, price } = req.body;
      const createdBy = req.params.userId;
      const user = await User.findById(createdBy);
      
      if (!user) {
        return res.status(404).json({ Error: 'Usuário não encontrado.' });
      }

      // Verifique se um arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({ Error: 'Nenhuma imagem foi enviada.' });
      }

      // Use req.file.filename para obter o nome da imagem
      const imageName = req.file.filename;

      const item = await Item.create({ code, price, image: imageName, createdBy });

      console.log('Item created:', item);

      return res.status(201).json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Erro no Create Controller.' });
    }
  }
  

  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, price} = req.body;
      const item = await Item.findById(id);

      if (!item) {
        return res.status(404).json({ Error: 'Item não encontrado update controller.' });
      }
      item.code = code;
      item.price = price;
      
      await item.save();
  
      return res.status(200).json({ Message: 'Item atualizado com sucesso.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Internal server error.' });
    }
  }

  async deleteImage(req, res) {
    try {
      const { filename } = req.params;
  
      // Define o caminho da imagem
      const imagePath = path.join(__dirname, '../images', filename);
  
      // Verifique se o arquivo existe
      if (fs.existsSync(imagePath)) {
        // Exclua a imagem
        fs.unlinkSync(imagePath);
        return res.status(200).json({ Message: 'Imagem excluída com sucesso.' });
      }
  
      return res.status(404).json({ Error: 'Imagem não encontrada.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ Error: 'Internal server error.' });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ Error: 'ID inválido.' });
      }

      const item = await Item.findById(id);

      if (!item) {
        return res.status(404).json({ Error: 'Item não encontrado.' });
      }

      await item.deleteOne();
      return res.status(200).json({ Message: 'Item excluído com sucesso.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ Error: 'Internal server error.' });
    }
  }
}

module.exports = new ItemController();
