const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({
    data: [
      {
        id: 1,
        name: 'user1',
        email: 'user1@email.com',
      },
    ],
  });
});

module.exports = router;
