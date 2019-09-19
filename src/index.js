var express = require('express');
var lodash = require('lodash');
var multer = require('multer');
var fs = require('fs');

const storage = multer.diskStorage({
  destination: './store/media',
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage });

var router = express.Router();

router.get('/get-stores', (req, res) => {
  fs.readFile('store/db.json', function(err, data) {
    if (err) {
      return res.send({
        error: 'No find data !'
      });
    } else {
      return res.send(JSON.parse(data));
    }
  });
});

router.post('/update-store', upload.single('file'), (req, res) => {
  const file = req.file;
  const body = req.body;
  const store = {
    id: body.id || 1,
    logoUrl: file ? '/media/' + file.filename : body.logoUrl,
    name: body.name,
    address: body.address,
    district: body.district,
    city: body.city,
    phone: body.phone,
    redInvoive: {
      name: body.rName,
      address: body.rAddress,
      district: body.rDistrict,
      city: body.rCity,
      taxCode: body.taxCode,
    },
  }

  fs.readFile('store/db.json', (err, data) => {
    if (err) {
      return res.send({
        error: 'No find database !'
      });
    } else {
      const db = JSON.parse(data);
      var message = validate(db, store);
      if (message) {
        return res.send({ error: message })
      }
      const newDb = updateData(db, store);

      fs.writeFile('store/db.json', JSON.stringify(newDb), 'utf8', (err) => {
        if (err) {
          return res.send({
            error: 'No find data !'
          });
        } else {
          return res.send({ store });
        }
      });
    }
  });
});

const validate = (stores, item) => {
  var duplicateItem = lodash.find(stores,
    store => store.id != item.id && (store.name === item.name || store.redInvoive.name === item.redInvoive.name));

  return duplicateItem ? 'Store name and company name are uniqueness' : '';
}

const updateData = (stores, item) => lodash.map(stores, st => (st.id === item.id ? item : st));

module.exports = router;
