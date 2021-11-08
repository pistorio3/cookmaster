// Importação do jwt
const jwt = require('jsonwebtoken');
// Secret para gerar um token
const secret = 'MySecretPassword';
// HTTP status code 
const HTTP = {
  UNAUTHORIZED: 401,
};

module.exports = async (req, res, next) => {
  // Pega o token informado no header da requisição
  const token = req.headers.authorization;

  // Caso não seja informado o token retorna mensagem de erro
  if (!token) { return res.status(HTTP.UNAUTHORIZED).json({ message: 'missing auth token' }); }

  // Realiza o decode do token e caso tenha erro retorna mensagem
  try {
    const decoded = jwt.verify(token, secret);

    res.role = decoded.role;
    res.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(HTTP.UNAUTHORIZED).json({ message: 'jwt malformed' });
  }
};