const isLogin = async (req, res, next) => {
    try {
      if (req.session.id) {
        next();
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const isLogout = async (req, res, next) => {
    try {
      if (req.session.id) {
        res.redirect('/home');
      } else {
        next();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  module.exports = {
    isLogin,
    isLogout
  };
  