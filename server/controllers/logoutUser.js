const logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      expires: new Date(Date.now()),
    });
    res.status(200).json({
      success: true,
      message: 'Logout successfully',
    });
  } catch (error) {
    next(error)
  }
};
module.exports = logoutUser;
