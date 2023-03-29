const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: 'Logout successfully',
  });
};
module.exports = logoutUser;
