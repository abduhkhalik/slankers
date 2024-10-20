const requestTime = async (req, _, next) => {
    console.info(req.requestTime = new Date().toLocaleString('id-ID'))
    next();
  };

module.exports = requestTime
