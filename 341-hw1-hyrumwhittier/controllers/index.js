const showSomeone = (req, res) => {

  res.send('Kari Whittier');
};

const showAnother = (req, res) => {
  res.json('Super Awesome Person');
};

module.exports = { showSomeone, showAnother };
